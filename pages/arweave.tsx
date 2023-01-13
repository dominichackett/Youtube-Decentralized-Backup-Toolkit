import Header from '../src/header/header'
import { FilmIcon   } from '@heroicons/react/20/solid'
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Footer from '../src/footer/footer'
import Notification from '../src/Notification/Notification'
import { useEffect } from 'react'
import { useRouter} from 'next/router'
import { useCeramicContext } from '../context'
import { authenticateCeramic } from '../utils'
import {useKeyring  } from '@w3ui/react-keyring'
  
export default function Videos() {

  const [videos,setVideos] = useState([])
  const [channels,setChannels] = useState(new Map())
  const [channelArray,setChannelArray] = useState([])
  const [gotChannels,setGotChannels] = useState(false)
  const [selectedChannel,setSelectedChannel] = useState("all")
  const [refreshData,setRefreshData] = useState()
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
 
  const [{ space }, {loadAgent }] = useKeyring()
  const router = useRouter()
  const handleLogin = async () => {
    await authenticateCeramic(ceramic, composeClient)
   
      console.log(ceramic.did)
      
  }


  useEffect(() => { loadAgent() }, []) // load the agent - once.


  useEffect(()=>{
    console.log(space)
    async function getData()
    {
      if(ceramic.did !== undefined) {
        
        const _videos = await composeClient.executeQuery(`
        query{
          youtubeVideoInformationIndex(first:1000){
            edges{
              node{
                id,
                channel,
                title,
                videoId
                downloaded,
                thumbnails,
                description,
                ipfsCID,
                arweaveID
              }
            }
          }
        }
        
        `);
        let ch:any = []
        _videos.data.youtubeVideoInformationIndex.edges.forEach((item:any)=>{
          let thumbnail:any = JSON.parse(item.node.thumbnails)
          console.log(thumbnail.default.url)
          if((item.node.channel == selectedChannel  && item.node.arweaveID !="NU")|| (selectedChannel == "all" && item.node.arweaveID !="NU")) 
          {
            let _data = {id:item.node.id,videoId:item.node.videoId,ipfsCID:item.node.ipfsCID,arweaveID:item.node.arweaveID,dowloaded:item.node.downloaded,channel:item.node.channel,title:item.node.title,thumbnail:(thumbnail.maxres?.url ? thumbnail.maxres?.url : thumbnail.default.url)}
            ch.push(_data)
          }
        })
        setVideos(ch)


      }
  
    }
    if(refreshData && gotChannels)
      getData()

      console.log(gotChannels)
      console.log(refreshData)
  },[refreshData,selectedChannel,gotChannels])

  
  useEffect(()=>{
    async function getData()
    {
      if(ceramic.did !== undefined) {
        console.log(composeClient)
        
        const _channels = await composeClient.executeQuery(`
        query{
          youtubeChannelInformationIndex(first:1000){
            edges{
              node{
                id,
                channelId,
                title,
                banner,
                thumbnails,
                description
              }
            }
          }
        }
        
        `);
        console.log(_channels)
        let ch:any = new Map()
        let chArray:any = [];
        _channels.data.youtubeChannelInformationIndex.edges.forEach((item:any)=>{
          let thumbnail:any = JSON.parse(item.node.thumbnails)
           ch.set(item.node.channelId,{id:item.node.id,banner:item.node.banner,channelId:item.node.channelId,title:item.node.title,thumbnail:thumbnail.high.url})
           chArray.push({id:item.node.id,banner:item.node.banner,channelId:item.node.channelId,title:item.node.title,thumbnail:thumbnail.high.url})
          })

        setChannelArray(chArray)
        setChannels(ch)
        console.log(_channels)
        setGotChannels(true)

      }
  
    }
    if(refreshData && !gotChannels) 
      getData()
  },[refreshData])

  
  
  /**
   * On load check if there is a DID-Session in local storage.
   * If there is a DID-Session we can immediately authenticate the user.
   * For more details on how we do this check the 'authenticateCeramic function in`../utils`.
   */
  useEffect(() => {
    if(localStorage.getItem('did')) {
     
      handleLogin()
      setRefreshData(new Date())

    }
  }, [ ])

  const handleChange = (event:any) => {
    setSelectedChannel(event.target.value)
    setRefreshData(new Date())
  }

  const handleClickChannel = (channel:any) =>{
    router.push({pathname:"/channel",query:{channel:channel.id,channelId:channel.channelId,banner:channel.banner,thumbnail:channel.thumbnail,title:channel.title}})
 }


 const handleClickVideo = (video:any,channel:any) =>{

    router.push({pathname:"/video" ,query:{id:video.id,thumbnail:channel.thumbnail,channel:channel.id,channelTitle:channel.title,title:video.title,ipfsCID:video.ipfsCID,arweaveID:video.arweaveID,channelId:video.channel,banner:channel.banner,videoThumbnail:video.thumbnail,ipfs:false}})

  }
    

    return(      <div className="min-h-full">
    <Header/>
    <div className="py-10">
    <header>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Arweave Videos</h1>
      </div>
      <div className="mt-2 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <select
            id="channel"
            name="channel"
            onChange={handleChange}
            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
          >
            <option value="all" >
              Select channel to filter videos {console.log(JSON.stringify(videos))}
            </option>
            {channelArray.map((value) => (
             
              <option value={value.channelId}>{value.title}</option>
             ))}
          </select>
      </div>
    </header>
    <main>
      <div className="mt-4 mb-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      {videos.map((video) => (
        <li key={video.videoId} className="relative">
          <div className="group  aspect-video block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
            <a  className='cursor-pointer' onClick={()=> handleClickVideo(video,channels.get(video.channel))}>
            <img src={video.thumbnail}  alt="" className=" object-fill h-48 w-96 group-hover:opacity-75" />
            </a>
           
          </div>
          <p className="truncate pointer-events-none mt-2 mb-2 block  text-sm font-medium text-gray-900">{video.title}</p>
          <a className='cursor-pointer'  onClick={()=> handleClickChannel(channels.get(video.channel))}> 
             <div className="flex items-center">
                <div className="h-10 w-10 flex-shrink-0">
                   <img className="h-10 w-10 rounded-full" src={channels.get(video.channel)?.thumbnail} alt="" referrerPolicy='no-referrer'/>
                 </div>
           <h3 className="ml-2 text-lg font-medium leading-tight tracking-tight text-black">{channels.get(video.channel)?.title}</h3>
    
    
         </div>
          </a>   
       </li>
      ))}
    </ul>
        
      </div>
    </main>
  </div>
  
 
    <Footer />
   
  </div>

  
    )
}
