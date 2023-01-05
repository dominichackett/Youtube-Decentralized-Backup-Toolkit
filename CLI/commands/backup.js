import chalk from "chalk";
import conf from 'conf';
import axios from "axios"
import {client} from  "../utils/client.js"
import pkg from '@apollo/client'
import fs from 'fs'
import cp from 'child_process'
import readline from 'readline'
import ytdl from 'ytdl-core'
import ffmpeg from 'ffmpeg-static'
import fastq from 'fastq';
const {gql} = pkg 
const queue = fastq(downloadVideo, 1)

const  backup = async (cIndex) =>
{
   let _channels = [];	 
   const channels = await client.query({query:gql`query{
       youtubeChannelInformationIndex(first:1000){
    edges{
      node{
        id,
        channelId,
        title
      }
    } 
  
     } 
   }
	`})

channels.data.youtubeChannelInformationIndex.edges.forEach((item)=> {
	_channels.push({title:item.node.title,channel:item.node.channelId})
	
})

 
 
 let index = parseInt(cIndex); 
 
 if( isNaN(index))
 {
   console.log(chalk.redBright("Invalid index. Index must be a number"))
   return	 

 }
 
 if(_channels.length == 0)
 {
    console.log(chalk.redBright("No Channels found in database."))
 }	 

 if(index >= _channels.length)
 {
	 console.log(chalk.redBright(`Invalid index. Index must be less than ${_channels.length}`))
   return	 

 }	 
 
  getVideos(_channels[index])
     
}

async function getVideos(channel) {
   console.log(chalk.greenBright(`Fetching videos in channel - ${channel.title}`))
   
    let _videos = [];	 
   const videos = await client.query({query:gql`query{
       youtubeVideoInformationIndex(first:1000){
    edges{
      node{
        id,
        videoId,
		channel,
        title
      }
    } 
  
     } 
   }
	`})

videos.data.youtubeVideoInformationIndex.edges.forEach((item)=> {
	if(channel.channel == item.node.channel)
	_videos.push({title:item.node.title,videoId:item.node.videoId})
	
})

  if(_videos.length == 0){
     console.log(chalk.redBright(`No videos found.`))
     return  
  }
  
   console.log(chalk.greenBright(`Found ${_videos.length} Video(s)`))  
   if (!fs.existsSync(channel.title)){
    fs.mkdirSync(channel.title);
   }
  
 for (const v in _videos) 
//  _videos.forEach(async (_video) =>
  {
	 
	  await queue.push({videoId:_videos[v].videoId,channel:channel.title})
	// console.log("aa")
  }//	)
  
}	

 async function downloadVideo(arg,cb) 
{
	const ref = `https://www.youtube.com/watch?v=${arg.videoId}`;
	console.log(arg.videoId)
	console.log(ref)
const tracker = {
  start: Date.now(),
  audio: { downloaded: 0, total: Infinity },
  video: { downloaded: 0, total: Infinity },
  merged: { frame: 0, speed: '0x', fps: 0 },
};

// Get audio and video streams
const audio = ytdl(ref, { quality: 'highestaudio' })
  .on('progress', (_, downloaded, total) => {
    tracker.audio = { downloaded, total };
  });
const video = ytdl(ref, { quality: 'highestvideo' })
  .on('progress', (_, downloaded, total) => {
    tracker.video = { downloaded, total };
  });

// Prepare the progress bar
let progressbarHandle = null;
const progressbarInterval = 1000;
const showProgress = () => {
  readline.cursorTo(process.stdout, 0);
  const toMB = i => (i / 1024 / 1024).toFixed(2);

  process.stdout.write(`Audio  | ${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% processed `);
  process.stdout.write(`(${toMB(tracker.audio.downloaded)}MB of ${toMB(tracker.audio.total)}MB).${' '.repeat(10)}\n`);

  process.stdout.write(`Video  | ${(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)}% processed `);
  process.stdout.write(`(${toMB(tracker.video.downloaded)}MB of ${toMB(tracker.video.total)}MB).${' '.repeat(10)}\n`);

  process.stdout.write(`Merged | processing frame ${tracker.merged.frame} `);
  process.stdout.write(`(at ${tracker.merged.fps} fps => ${tracker.merged.speed}).${' '.repeat(10)}\n`);

  process.stdout.write(`running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(2)} Minutes.`);
  readline.moveCursor(process.stdout, 0, -3);
};

// Start the ffmpeg child process
const ffmpegProcess = cp.spawn(ffmpeg, [
  // Remove ffmpeg's console spamming
  '-loglevel', '8', '-hide_banner',
  // Redirect/Enable progress messages
  '-progress', 'pipe:3',
  // Set inputs
  '-i', 'pipe:4',
  '-i', 'pipe:5',
  // Map audio & video from streams
  '-map', '0:a',
  '-map', '1:v',
  // Keep encoding
  '-c:v', 'copy',
  // Define output file
  `./${arg.channel}/${arg.videoId}.mp4`,
], {
  windowsHide: true,
  stdio: [
    /* Standard: stdin, stdout, stderr */
    'inherit', 'inherit', 'inherit',
    /* Custom: pipe:3, pipe:4, pipe:5 */
    'pipe', 'pipe', 'pipe',
  ],
});

ffmpegProcess.on('close', () => {
  console.log('done');
  // Cleanup
  process.stdout.write('\n\n\n\n');
  clearInterval(progressbarHandle);
  cb(null)

});

// Link streams
// FFmpeg creates the transformer streams and we just have to insert / read data
ffmpegProcess.stdio[3].on('data', chunk => {
  // Start the progress bar
  if (!progressbarHandle) progressbarHandle = setInterval(showProgress, progressbarInterval);
  // Parse the param=value list returned by ffmpeg
  const lines = chunk.toString().trim().split('\n');
  const args = {};
  for (const l of lines) {
    const [key, value] = l.split('=');
    args[key.trim()] = value.trim();
  }
  tracker.merged = args;
});
audio.pipe(ffmpegProcess.stdio[4]);
video.pipe(ffmpegProcess.stdio[5]);	


}

export default backup;
