import Header from '../src/header/header'
import {  useRef, useState,useEffect } from 'react'
import Footer from '../src/footer/footer'
import Notification from '../src/Notification/Notification'
import { NFTStorage } from "nft.storage";
 
import { createFFmpeg } from '@ffmpeg/ffmpeg';
import { videoNftAbi } from '../utils/videoNftAbi';

import { ethers } from "ethers"

 
import {useRouter} from 'next/router'
export default function Videos() {
    const [videoKey,setVideoKey] = useState(new Date().getTime())
    const router = useRouter()
    const ffmpeg = createFFmpeg({   corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js"
    ,log: true });

    const [fileData,setFileData] = useState()
    const [clipData,setCLipData] = useState()
   const [src,setSrc]  = useState()
   const [videoUrl,setVideoUrl] = useState()
   const [nftstorage] = useState(
    new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_KEY })
  );
    // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);
  const [show, setShow] = useState(false);
  const close = async () => {
    setShow(false);
  };


 

    const [open, setOpen] = useState(false)
   const sourceRef = useRef
  const cancelButtonRef = useRef(null)
  const handleClickChannel = (channel:any) =>{
    router.push({pathname:"/channel",query:{channel:router.query.channel,channelId:router.query.channelId,banner:router.query.banner,thumbnail:router.query.thumbnail,title:router.query.channelTitle}})
 }

const handleClick = async()=>{


if(!fileData)
{
   setDialogType(2) //Error
   setNotificationTitle("Clip Video")
   setNotificationDescription("No file data found.")
   setShow(true)
   return
}
try {

  
  await ffmpeg.load();

const fromSeconds = toTime(document.getElementById("fromSeconds").value)
const fromMinutes = toTime(document.getElementById("fromMinutes").value)
const toSeconds = toTime(document.getElementById("toSeconds").value)
const toMinutes = toTime(document.getElementById("toMinutes").value)

ffmpeg.FS(
    "writeFile",
    "video.mp4",
    fileData
  ); 

  const r =  await ffmpeg.run( "-i", "video.mp4", "-ss",    `00:${fromMinutes}:${fromSeconds}` ,"-to" ,`00:${toMinutes}:${toSeconds}`, "-c:v", "copy" ,"-c:a", "copy", "output.mp4");
 // read the MP4 file back from the FFmpeg file system
  const output = ffmpeg.FS("readFile", "output.mp4");
  if(src)
     window.URL.revokeObjectURL(src)
 const clip = output.buffer    
 setCLipData(clip)
 setSrc(window.URL.createObjectURL(new Blob([clip], { type: "video/mp4" })))  
 setVideoKey(new Date().getTime())
}catch(err)
{
    setDialogType(2) //Error
    setNotificationTitle("Clip Video")
    setNotificationDescription(err.message+" Please refresh page.")
    setShow(true)
    return
}

}

const handleViewFullVideo = () => {
 
    if(!fileData)
    {
       setDialogType(2) //Error
       setNotificationTitle("Clip Video")
       setNotificationDescription("No file data found.")
       setShow(true)
       return
    }
    if(src)
      window.URL.revokeObjectURL(src)
    setSrc(window.URL.createObjectURL(new Blob([fileData], { type: "video/mp4" })))  

    setVideoKey(new Date().getTime())
}

const mintNFT = async ()=>{
    if(!clipData)
{
   setDialogType(2) //Error
   setNotificationTitle("Clip Video")
   setNotificationDescription("No file data found.")
   setShow(true)
   return
}

const metadata = await nftstorage.store({
    name: router.query.title,
     description: `${router.query.channelTitle} - ${router.query.title}`,
    image: new File([clipData], 'video.mp4', { type: 'application/mp4' })
  })

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const accounts = await provider.send("eth_requestAccounts", []);
  const nftContract = new ethers.Contract(
    "0xA4E1d8FE768d471B048F9d73ff90ED8fcCC03643",
    videoNftAbi,
    provider.getSigner()
  );

  let transaction = await nftContract.mint(accounts[0],metadata.url)

  try {
    await transaction
      .wait()
      
      setDialogType(1); //Success
      setNotificationTitle("Mint NFT")
      setNotificationDescription(`Successfully minted NFT.`)
      setShow(true)

   }catch(error)
   {
    setOpen(false);

     setDialogType(2); //Failed
     setNotificationTitle("Mint NFT Failed")
     setNotificationDescription( error.data ? error.data.message:error.message)
     setShow(true)

   }

}

 useEffect(()=>{
 
  console.log(`https://${router.query.ipfsCID}.ipfs.w3s.link`)
    async function getFile(){
        
        const file = await fetch(`https://${router.query.ipfsCID}.ipfs.w3s.link`,{ crossDomain:true}).then(async (data)=>{
        console.log(data)
        const d =   await data.arrayBuffer()
        const x = new Uint8Array(d)
        
        console.log(sourceRef.current)   
        setFileData(x)
        setSrc( window.URL.createObjectURL( new Blob([x], { type:"video/mp4"})))
        })
    }
    if(router.query.ipfsCID)
    {
        setVideoUrl(`https://${router.query.ipfsCID}.ipfs.w3s.link`)
        getFile()
    }
 },[router.query.ipfsCID])

function toTime(value)
{
   if(isNaN(value))
     return "00"

   if(value >59)
     return "00"

  if(value < 10)
    return "0"+value.toString()
    
  return value.toString()  
     
}
    return(      <div className="min-h-full">
    <Header/>
    <div className="py-4">
    <header className='grid justify-items-center' >
      <div className="content-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Mint NFT</h1>
      </div>
     
    </header>
    <main>
        
   
      <div className="mt-2 mb-4 mx-auto max-w-3xl  sm:px-4 lg:px-6">
      <video controls autoplay muted  loop  poster={router.query.videoThumbnail} key={videoKey}  className="w-full"
 >
 {src && <source src={src}   type="video/mp4"  />}
  
  
  Your browser does not support the video tag.
 
</video>

     <h1 className="mb-3 mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900">{router.query.title}</h1>
     
     <a className='cursor-pointer'  onClick={handleClickChannel}> <div className="flex items-center">
                         <div className="h-10 w-10 flex-shrink-0">
         <img referrerPolicy='no-referrer' className="h-10  w-10 rounded-full" src={router.query.thumbnail}
 alt="" crossorigin="anonymous" />
                          </div>
                          <h3 className="ml-2 text-2xl font-medium leading-tight tracking-tight text-gray-500">{router.query.channelTitle}</h3>
    
                     
                        </div>
    </a>  
    <button
                type="button"
                className="mt-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-1 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={handleViewFullVideo}
                >
                <span>View Full Video</span>
              </button>  
              <button
                type="button"
                onClick={handleClick}
                className="ml-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-1 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                <span>Clip Video</span>
              </button>
              <button
               onClick={mintNFT}
                type="button"
                className="ml-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-1 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                <span>Mint NFT</span>
              </button>
              <div  className='mt-2 grid grid-rows-2 gap-2 gap-y-1'>
             
                <div className='grid grid-cols-6 gap-2'> 
                <span className='font-bold'>From:</span>  
                 <input id='fromMinutes' defaultValue={0} type="number" min={0} max={59} />
                <input id='fromSeconds' defaultValue={0}  type="number" min={0} max={59} />
               </div>
                
                <div className='grid grid-cols-6 gap-2'>
                <span className='font-bold'>To:</span>  
               <input id='toMinutes' defaultValue={0} type="number" min={0} max={59} />
                <input id='toSeconds' defaultValue={0} type="number" min={0} max={59} />
                </div> 
              </div>
              
              
      </div>
    </main>
  </div>
  
  
   
    <Footer />
    <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
  </div>

  
    )
}
