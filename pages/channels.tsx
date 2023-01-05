import Header from '../src/header/header'
import { FilmIcon   } from '@heroicons/react/20/solid'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Footer from '../src/footer/footer'
import Notification from '../src/Notification/Notification'
import { useCeramicContext } from '../context'
import { authenticateCeramic } from '../utils'
import  { useRouter } from 'next/router'
import axios from 'axios'
//import { gql } from '@apollo/client'
export default function Channels() {
  const [myChannels,setMyChannels] = useState([])
  const [refreshData,setRefreshData] = useState()
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
 const router = useRouter() 
  const handleLogin = async () => {
    await authenticateCeramic(ceramic, composeClient)
   
      console.log(ceramic.did)
      
  }

  
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


  useEffect(()=>{
    async function getData()
    {
      if(ceramic.did !== undefined) {
        console.log(composeClient)
        
        const channels = await composeClient.executeQuery(`
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
        console.log(channels)
        let ch:any = []
        channels.data.youtubeChannelInformationIndex.edges.forEach((item:any)=>{
          let thumbnail:any = JSON.parse(item.node.thumbnails)
          console.log(thumbnail.default.url)
           ch.push({id:item.node.id,banner:item.node.banner,channelId:item.node.channelId,title:item.node.title,thumbnail:thumbnail.high.url})
        })

        setMyChannels(ch)
        console.log(channels)


      }
  
    }
    if(refreshData)
      getData()
  },[refreshData])

     // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);
  const [show, setShow] = useState(false);
  const close = async () => {
    setShow(false);
  };

  async function saveChannel(data:any) {
    let channelId = data.id;
    let title = data.brandingSettings.channel.title;
    let description = data.brandingSettings.channel.description;
    let banner=data.brandingSettings.image.bannerExternalUrl;
    let thumbnails=JSON.stringify(data.snippet.thumbnails);

    console.log(`channelId: ${channelId} title:${title} description: ${description} thumbnails:${thumbnails}`)
    console.log(data)  
    const d = {i:{content:{channelId:channelId,title:title,banner:banner,thumbnails:thumbnails,description:description}}}
    let map:  Record<"i",any>
    map = d
    const save = await composeClient.executeQuery(`mutation createYoutubeChannelInformation($i: CreateYoutubeChannelInformationInput!) {
      createYoutubeChannelInformation(input: $i) {
        document {
          channelId
          title
        banner
        thumbnails
        description
        }
      }
    }
    
    `,map)

    console.log(save)

    if(save.errors)
    {
      setNotificationTitle("Add Channel")
      setNotificationDescription("Error adding channel.")
      setDialogType(2) //Error
      setShow(true)
    }else
    {
      setNotificationTitle("Add Channel")
      setNotificationDescription("Successfully added channel.")
      setDialogType(1) //Success
      setShow(true)
      setOpen(false)  
      setRefreshData(new Date())
    }
    
 
  }
  const addChannel = async() => {

    await axios.get('https://youtube.googleapis.com/youtube/v3/channels',{
    
    params: {
    part: 'snippet,contentDetails,statistics,brandingSettings',
    id:document.getElementById("channelId").value,
    key:localStorage.getItem("apikey")
    },
      headers: {
      Accept: 'application/json'
    }
  }).then(async function(httpResponse) {
    
    let data = httpResponse.data.items[0];
	saveChannel(data);
   
	
 }) .catch(err => {
      if (err.response) {
        setDialogType(2)
        setNotificationTitle("Get Video Metadata")
        setNotificationDescription(err.message)
        setShow(true)
        console.log(err.response.status);
        console.log(err.response.statusText);
        console.log(err.message);
        console.log(err.response.headers); 
        console.log(err.response.data); 
      }
      else
      {
        setDialogType(2)
        setNotificationTitle("Get Video Metadata")
        setNotificationDescription("Error getting video metadata")
        setShow(true)
      }
	  
 });
     
  }

  const handleClickChannel = (channel:any) =>{
     router.push({pathname:"/channel",query:{channel:channel.id,channelId:channel.channelId,banner:channel.banner,thumbnail:channel.thumbnail,title:channel.title}})
  }

    const [open, setOpen] = useState(false)
   
  const cancelButtonRef = useRef(null)
  
    return(      <div className="min-h-full">
    <Header/>
    <div className="py-10">
    <header>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Channels</h1>
      </div>
      <div className="mt-2 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <button
      onClick={()=> setOpen(true)}
        type="button"
        className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Add Channel
        <FilmIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
      </button>
      </div>
    </header>
    <main>
      <div className="mt-4 mb-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      {myChannels.map((channel) => (
        <li key={channel.id} className="relative">
          <div className=" group  aspect-video block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
            <a  onClick={()=> handleClickChannel(channel)} className="cursor-pointer">
            <img referrerPolicy='no-referrer' src={channel.thumbnail} alt="" className="object-cover h-48 w-96 group-hover:opacity-75" />
            </a>
          </div>
          <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{channel.title}</p>
        </li>
      ))}
    </ul>
        
      </div>
    </main>
  </div>
  
  <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-24 sm:w-24">
                    <FilmIcon className="h-20 w-20 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Add YouTube Channel
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to add a YouTube channel? This will allow you to backup your channel on IPFS.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-600">
      <label htmlFor="name" className="block text-xs font-medium text-gray-900">
        Channel ID
      </label>
      <input
        type="text"
        name="channelId"
        id="channelId"
        className="block w-full p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
        placeholder="Enter YouTube Channel ID"
      />
    </div>
                <div className="mt-5 sm:mt-4 sm:ml-10 sm:flex sm:pl-4">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto sm:text-sm"
                    onClick={() =>  addChannel()}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
   
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
