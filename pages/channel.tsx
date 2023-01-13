import Header from '../src/header/header'
import { FilmIcon   } from '@heroicons/react/20/solid'
import { Fragment, useRef, useState,useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Footer from '../src/footer/footer'
import Notification from '../src/Notification/Notification'
import { ArrowUpCircleIcon ,ArrowDownCircleIcon} from '@heroicons/react/20/solid'
import { useRouter} from 'next/router'
import { useCeramicContext } from '../context'
import { authenticateCeramic } from '../utils'
var ax = require('@w3ui/react-uploader')
import {useKeyring  } from '@w3ui/react-keyring'
import axios from 'axios'
import { WebBundlr } from '@bundlr-network/client';
import { providers } from 'ethers';
import fileReaderStream from "filereader-stream";
import BigNumber from "bignumber.js";

export default function Channel() {
  const [fundAmount, setFundAmount] = useState(1);
  const [fundMessage, setFundMessage] = useState("");
  const [nodeBalance, setNodeBalance] = useState(0);

  const [bundlr,setBundlr] = useState()
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [videos,setVideos] = useState([])
  const [videoMap,setVideoMap] =useState(new Map())
  const [{ storedDAGShards }, uploader] = ax.useUploader()
  const videoFilesRef = useRef("")
  const arweaveFilesRef = useRef("")

  const [refreshData,setRefreshData] = useState(new Date())
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
 
  const [{ space }, {loadAgent }] = useKeyring()

     // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);
  const [show, setShow] = useState(false);
  const close = async () => {
    setShow(false);
  };


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
        let _videoMap = new Map()
        _videos.data.youtubeVideoInformationIndex.edges.forEach((item:any)=>{
          let thumbnail:any = JSON.parse(item.node.thumbnails)
          console.log(thumbnail.default.url)
          if(item.node.channel == router.query.channelId) 
          {
            let _data = {id:item.node.id,videoId:item.node.videoId,ipfsCID:item.node.ipfsCID,arweaveID:item.node.arweaveID,dowloaded:item.node.downloaded,channel:item.node.channel,title:item.node.title,thumbnail:(thumbnail.maxres?.url ? thumbnail.maxres?.url : thumbnail.default.url)}
            _videoMap.set(_data.videoId,_data)
            ch.push(_data)
          }
        })
        setVideoMap(_videoMap)
        setVideos(ch)
        console.log(_videoMap)


      }
  
    }
    if(refreshData)
      getData()
  },[refreshData])

  useEffect(()=>{
   async function init(){
    await window.ethereum.enable();
   const provider = new providers.Web3Provider(window.ethereum);
   const _bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", provider, {
    providerUrl: "https://polygon-mumbai.infura.io/v3/91e44a8b6a134115a89ec7894615e143",
});await _bundlr.ready();

    setBundlr(_bundlr)
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    const curBalance = await _bundlr.getBalance(account);
    setNodeBalance(
        _bundlr.utils.unitConverter(curBalance).toFixed(7, 2).toString(),
    );
   }
   init()
  },[])
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


  const getVideoMetadata =async (e:any) => {
    const channel = router.query.channelId
    const playlist = channel.substring(0, 1) + "U" + channel.substring( 2);
    e.preventDefault()
    await axios.get('https://youtube.googleapis.com/youtube/v3/playlistItems',{
    
    params: {
    part: 'snippet,contentDetails',
    playlistId:playlist,
    key:localStorage.getItem("apikey"),
    maxResults:5
    },
      headers: {
      Accept: 'application/json'
    }
  }).then(async function(httpResponse) {
    
    let data = httpResponse.data.items;
    saveVideos(data)
    setRefreshData(new Date())
  setDialogType(1) //Success
   setNotificationTitle("Video Metadata")
   setNotificationDescription("Successfully feteched Video Data.")
   setShow(true)
   
	
 }).catch(err => {
      if (err.response) {

        setDialogType(2) //Error
        setNotificationTitle("Video Metadata")
        setNotificationDescription(err.message)
        setShow(true)
	     
        console.log(err.response.status);
        console.log(err.response.statusText);
        console.log(err.message);
        console.log(err.response.headers); 
        console.log(err.response.data); 
      }
	  
 });    
  }

  async function saveVideos(data:any) {
    //console.log(data)
   for(const index in data){
    let video = data[index]
    let videoId = video.snippet.resourceId.videoId
    let channelId = video.snippet.channelId;
    let title = video.snippet.title;
    let description = video.snippet.description;
    let thumbnails=JSON.stringify(video.snippet.thumbnails);
    
    let vData = {i:{content:{channel:channelId,videoId:videoId,title:title,thumbnails:thumbnails,description:description,downloaded:false,ipfsCID:"NU",arweaveID:"NU"}}}
    console.log(vData) 
    let map:  Record<"i",any>
    map = vData
    const save = await composeClient.executeQuery(`mutation createYoutubeVideoInformation($i: CreateYoutubeVideoInformationInput!) {
      createYoutubeVideoInformation(input: $i) {
        document {
          channel
          videoId
          title
          thumbnails
        description
        downloaded
        ipfsCID
        arweaveID
        }
      }
    }
    
    `,map)
    console.log(save)
    if(save.errors)
    {
      setNotificationTitle("Add Video")
      setNotificationDescription("Error adding video.")
      setDialogType(2) //Error
      setShow(true)
    }else
    {
      setNotificationTitle("Add Video")
      setNotificationDescription("Successfully added video.")
      setDialogType(1) //Success
      setShow(true)
      setOpen(false)  
      
    }
  }
  setRefreshData(new Date())
  }

  const handleClickVideo = (video:any) =>{
    if(video.ipfsCID=="NU" && video.arweaveID == "NU")
    {
      setNotificationTitle("View Video")
      setNotificationDescription("Video not uploaded to IPFS or Arweave.")
      setDialogType(2) //Error
      setShow(true)
      
    }
    else  
    {
      router.push({pathname:"/video" ,query:{id:video.id,thumbnail:router.query.thumbnail,channel:router.query.channel,channelTitle:router.query.title,title:video.title,ipfsCID:video.ipfsCID,channelId:router.query.channelId,banner:router.query.banner,videoThumbnail:video.thumbnail,arweaveID:video.arweaveID}})
 
    }
      }

    const [open, setOpen] = useState(false)
   
  const cancelButtonRef = useRef(null)
  const router = useRouter()

  
  const videoFilesSelected = async () => {


   
    console.log(uploader)
    console.log(space)
    
    for  (var file =0 ; file <   videoFilesRef.current.files.length; file++)
    {
       let cid:any;
       console.log( videoFilesRef.current.files[file])
       setFile(videoFilesRef.current.files[file])
       const  video = videoMap.get(videoFilesRef.current.files[file].name.replace(".mp4",""))
    
       if(video== undefined)
       {
          if(show)
            setShow(false) 
          setDialogType(2) //Error
           setNotificationTitle("File Error.")
           setNotificationDescription(`File: ${videoFilesRef.current.files[file].name} not found in database.`)
           setShow(true)
           continue     
       }

       if(video.ipfsCID != "NU")
       {

        setDialogType(2) //Error
           setNotificationTitle("File Error.")
           setNotificationDescription(`File: ${videoFilesRef.current.files[file].name} already uploaded.`)
           setShow(true)
           

        continue
       }

       try{
            setStatus('uploading')
            setDialogType(1) //Success
            setNotificationTitle("Uploading File.")
            setNotificationDescription(`File: ${videoFilesRef.current.files[file].name}`)
            setShow(true)
            cid =  await uploader.uploadFile( videoFilesRef.current.files[file])
       }catch(err)
       {
          console.log(err)
          return
       }finally {
        setStatus('done')
      }
       console.log(cid.toString())
       
       console.log(videoFilesRef.current.files[file].name.replace(".mp4",""))
       const d = {i:{id:video.id,content:{ipfsCID:cid.toString(),downloaded:true}}}
       let map:  Record<"i",any>
       map = d
       const save = await composeClient.executeQuery(`mutation updateYoutubeVideoInformation($i: UpdateYoutubeVideoInformationInput!) {
         updateYoutubeVideoInformation(input: $i) {
           document {
             ipfsCID
             downloaded
           }
         }
       }
       
       `,map)
       if(save.errors)
    {
      setNotificationTitle("Update Video")
      setNotificationDescription(JSON.stringify(save.errors))
      setDialogType(2) //Error
      setShow(true)
    }else
    {
      setNotificationTitle("Update Video")
      setNotificationDescription("Successfully updated video.")
      setDialogType(1) //Success
      setShow(true)
      setOpen(false)  
      setRefreshData(new Date())
    }
    }

  }; 


  const arweaveFilesSelected = async () => {
    console.log(uploader)
    console.log(space)
    /*const price = await bundlr.getPrice(arweaveFilesRef.current.files[0].size);
    alert(price)
    return*/ 
    for  (var file =0 ; file <   arweaveFilesRef.current.files.length; file++)
    {
       let tx:any;
       console.log( arweaveFilesRef.current.files[file])
       setFile(arweaveFilesRef.current.files[file])
       const  video = videoMap.get(arweaveFilesRef.current.files[file].name.replace(".mp4",""))
    
       if(video== undefined)
       {
          if(show)
            setShow(false) 
          setDialogType(2) //Error
           setNotificationTitle("File Error.")
           setNotificationDescription(`File: ${arweaveFilesRef.current.files[file].name} not found in database.`)
           setShow(true)
           continue     
       }

       if(video.arweaveID != "NU")
       {

        setDialogType(2) //Error
           setNotificationTitle("File Error.")
           setNotificationDescription(`File: ${arweaveFilesRef.current.files[file].name} already uploaded to arweave.`)
           setShow(true)
           

        continue
       }

       try{
            setStatus('uploading')
            setDialogType(1) //Success
            setNotificationTitle("Uploading File.")
            setNotificationDescription(`File: ${arweaveFilesRef.current.files[file].name}`)
            setShow(true)
            
            const dataStream = fileReaderStream(arweaveFilesRef.current.files[file]);
            
            tx = await bundlr.upload(dataStream, {
    tags: [{ name: "Content-Type", value: "video/mp4" }],
});
       }catch(err)
       {
          console.log(err)
          setNotificationTitle("Update Video")
          setNotificationDescription(err.message)
          setDialogType(2) //Error
          setShow(true)

          return
       }finally {
        setStatus('done')
      }
       //console.log(cid.toString())
       
       console.log(arweaveFilesRef.current.files[file].name.replace(".mp4",""))
       const d = {i:{id:video.id,content:{arweaveID:tx.id,downloaded:true}}}
       let map:  Record<"i",any>
       map = d
       const save = await composeClient.executeQuery(`mutation updateYoutubeVideoInformation($i: UpdateYoutubeVideoInformationInput!) {
         updateYoutubeVideoInformation(input: $i) {
           document {
             arweaveID
             downloaded
           }
         }
       }
       
       `,map)
       if(save.errors)
    {
      setNotificationTitle("Update Video")
      setNotificationDescription(JSON.stringify(save.errors))
      setDialogType(2) //Error
      setShow(true)
    }else
    {
      setNotificationTitle("Update Video")
      setNotificationDescription("Successfully updated video.")
      setDialogType(1) //Success
      setShow(true)
      setOpen(false)  
      setRefreshData(new Date())
    }
    }

  }

  const handleUploadIPFS = (e:any) => {
    videoFilesRef.current.click(); 
  }; 

  
  const handleUploadArweave = (e:any) => {
    arweaveFilesRef.current.click(); 
  }; 

  const fundNode = async () => {
   
    const fundAmountParsed = new BigNumber(fundAmount).multipliedBy(
        bundlr.currencyConfig.base[1],
    );
    await bundlr
        .fund(fundAmountParsed.toString())
        .then((res) => {
            setFundMessage("Wallet Funded");
        })
        .catch((e) => {
            console.log(e);
            setFundMessage("Error While Funding ", e.message);
        });
};

    return(      <div className="min-h-full">
    <Header/>
    <div className="py-10">
  
    <main>
    <div>
      <div>
        <img referrerPolicy='no-referrer' className="h-32 w-full object-cover lg:h-48" src={router.query.banner} alt="" />
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex">
            <img referrerPolicy='no-referrer' className="h-24 w-24 object-fill rounded-full ring-4 ring-white sm:h-32 sm:w-32"  src={router.query.thumbnail} alt="" />
          </div>
          <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
              <h1 className="truncate text-2xl font-bold text-gray-900">{router.query.title}</h1>
            </div>
            <div className="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={getVideoMetadata}
                className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-1 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                <ArrowDownCircleIcon className="-ml-1 mr-2 h-5 w-5 text-white" aria-hidden="true" />
                <span>Get Video Metadata</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-1 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
               onClick={handleUploadIPFS}
             >
                <ArrowUpCircleIcon className="-ml-1 mr-2 h-5 w-5 text-white" aria-hidden="true" />
                <span>Upload to IPFS</span>
                <input type="file"   accept="video/mp4" multiple    ref={videoFilesRef} hidden={true} onChange={videoFilesSelected}/>

              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-1 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
               onClick={handleUploadArweave}
             >
                <ArrowUpCircleIcon className="-ml-1 mr-2 h-5 w-5 text-white" aria-hidden="true" />
                <span>Upload to Arweave</span>
                <input type="file"   accept="video/mp4" multiple    ref={arweaveFilesRef} hidden={true} onChange={arweaveFilesSelected}/>

              </button>
            </div>
          
          </div>
        </div>
        <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
          <h1 className="truncate text-2xl font-bold text-gray-900">{router.query.title}</h1>
        </div>
      </div>
    </div>
    <div className="px-4 py-5 flex flex-col" id="fund_container">
            <label
                className="pr-5block mb-2 text-sm font-medium text-text"
                for="file_input"
            >
                Fund Arweave Node
            </label>
            <div className="flex flex-row">
                <input
                    className="rounded w-20 pl-3 focus:outline-none text-black"
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                />
                <button
                     className="ml-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-1 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
               
                    onClick={fundNode}
                >
                    Fund
                </button>
            </div>
            <p className="text-messageText text-sm">{fundMessage}</p>
            <p className="mt-2 text-messageText text-sm">Balance: {nodeBalance} Matic</p>

        </div>
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Videos</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the videos in this channel.
          </p>
        </div>
      
      </div>
      <div className="mt-4 mb-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      {videos.map((video) => (
        <li key={video.videoId} className="relative">
          <div className=" group  aspect-video block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
            <a  onClick={()=> handleClickVideo(video)} className="cursor-pointer">
            <img referrerPolicy='no-referrer' src={video.thumbnail} alt="" className="object-fill h-48 w-96 group-hover:opacity-75" />
            </a>
          </div>
          <p className="pointer-events-none mt-2 block  text-sm font-medium text-gray-900">{video.title}</p>
          {video.ipfsCID == "NU" ? <span className="inline-flex rounded-full bg-red-500 px-2 text-xs font-semibold leading-5 text-white">
                          IPFS
                        </span> : 
                        <span className="inline-flex rounded-full bg-green-500 px-2 text-xs font-semibold leading-5 text-white">
                         IPFS
                      </span>
                        }
         {video.arweaveID == "NU" ? <span className="ml-2 inline-flex rounded-full bg-red-500 px-2 text-xs font-semibold leading-5 text-white">
                          Arweave
                        </span> : 
                        <span className="ml-2 inline-flex rounded-full bg-green-500 px-2 text-xs font-semibold leading-5 text-white">
                        Arweave
                      </span>
                        }                
        </li>
      ))}
    </ul>
        
      </div>
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
