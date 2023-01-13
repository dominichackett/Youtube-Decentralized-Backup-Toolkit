import Header from '../src/header/header'
import { FilmIcon   } from '@heroicons/react/20/solid'
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Footer from '../src/footer/footer'
import Notification from '../src/Notification/Notification'
import { Player } from '@livepeer/react';
import Image from 'next/image';
import * as React from 'react';
 import Link from 'next/link'
 
const PosterImage = (props:any) => {
  return (
    <Image
      src={props.banner}
      layout="fill"
      objectFit="cover"
      priority
    />
    
  );
};
 
import {useRouter} from 'next/router'
export default function Videos() {

     // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);
  const [show, setShow] = useState(false);
  const close = async () => {
    setShow(false);
  };


 
   
  const router = useRouter()
  const handleClickChannel = (channel:any) =>{
    router.push({pathname:"/channel",query:{channel:router.query.channel,channelId:router.query.channelId,banner:router.query.banner,thumbnail:router.query.thumbnail,title:router.query.channelTitle}})
 }

 const handleMintClick = ()=>{
  router.push({pathname:"mint",query:{...router.query}})
 }
    return(      <div className="min-h-full">
    <Header/>
    <div className="py-4">
    <header className='grid justify-items-center' >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Video</h1>
      </div>
     
    </header>
    <main>
      <div className="mt-2 mb-4 mx-auto max-w-3xl  sm:px-4 lg:px-6">
        <Player
      title="Waterfalls"
src={ router.query.ipfsCID != "NU" && router.query.ipfs == true  ? `https://${router.query.ipfsCID}.ipfs.w3s.link` : `ar://${router.query.arweaveID}`}

      className="w-96"
      
        autoPlay
      showTitle={false}
      muted
      poster={<PosterImage banner={router.query.videoThumbnail} />}
    />
     <h1 className="mb-3 mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900">{router.query.title}</h1>
     
     <a className='cursor-pointer'  onClick={handleClickChannel}> <div className="flex items-center">
                         <div className="h-10 w-10 flex-shrink-0">
         <img referrerPolicy='no-referrer' className="h-10 w-10 rounded-full" src={router.query.thumbnail}
 alt="" />
                          </div>
                          <h3 className="ml-2 text-2xl font-medium leading-tight tracking-tight text-gray-500">{router.query.channelTitle}</h3>
    
    
                        </div>
    </a>    
    <button
                type="button"
                onClick={handleMintClick}
                className="ml-3 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-1 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                <span>Mint NFT</span>
              </button>

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
