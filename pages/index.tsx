/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/

import Image from 'next/image'
import Footer from '../src/footer/footer'

import React, { useEffect, useState } from 'react'
import {useKeyring  } from '@w3ui/react-keyring'
import {useRouter} from 'next/router'
import Notification from '../src/Notification/Notification'

export default function LandingPage() {
  const [{ space }, { loadAgent, unloadAgent, createSpace, registerSpace, cancelRegisterSpace }] = useKeyring()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

     // NOTIFICATIONS functions
     const [notificationTitle, setNotificationTitle] = useState();
     const [notificationDescription, setNotificationDescription] = useState();
     const [dialogType, setDialogType] = useState(1);
     const [show, setShow] = useState(false);
     const close = async () => {
       setShow(false);
     };

  useEffect(() => { loadAgent() }, []) // load the agent - once.
  if (space?.registered() == true) {

   // alert(JSON.stringify(space))
    // console.log(space)
   // router.push("/channels")
  }
  const handleRegisterSubmit = async e => {
    e.preventDefault()
    setSubmitted(true)
    try {
      await createSpace("YTBTK")
      await registerSpace(email)
    } catch (err) {
      setDialogType(2) // Error
      setNotificationTitle("Register/Sign Up Error")
      setNotificationDescription(err)
    } finally {
      setSubmitted(false)
    }
  }
  return (
    <div className="min-h-full">
    <main>
    <div className="mt-14 bg-white">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
          <div>
          <h3 className="text-center text-3xl font-bold tracking-tight sm:text-3xl lg:text-6xl">
                  <span className="block text-red">YouTube Decentralized</span>
                  <span className="block text-red-600">Backup Toolkit</span>
                </h3>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl">
             Built using the best of breed web3 technologies
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-gray-500">
              Protect your content from big tech censorship.  Download your content to your computer.
              Store your content in a decentralized manner on IPFS. Manager and view your content.
            </p>
       
          <div >
          {!submitted  &&   
            <form  className="mt-2 space-y-2 divide-y divide-gray-200" onSubmit={handleRegisterSubmit}>
      <div className='mt-2  className="sm:col-span-3'>
        <label className="block text-sm font-medium text-gray-700"  htmlFor='email'>Email address:</label>
        <input  className='mt-2 w-96' id='email' type='email' value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <button  className=" flex items-center justify-center rounded-md border border-transparent bg-red-600 px-5 py-3 text-base font-medium text-white hover:bg-red-700"
           type='submit' disabled={submitted}>Register</button>
    </form>}


    {submitted  &&  <div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl"
          
       >Verify your email address!</h1>
        <p    className="mt-3 max-w-2xl text-lg text-gray-500">Click the link in the email we sent to {email} to sign in.</p>
        <form onSubmit={e => { e.preventDefault(); cancelRegisterSpace() }}>
          <button type='submit'  className=" font-medium flex items-center justify-center rounded-md border border-transparent bg-red-600 px-5 py-3 text-base font-medium text-white hover:bg-red-700"
       >Cancel</button>
        </form>
      </div>}
    </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
            <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image alt='NextJs' src="/polygon.png" height={64} width={160}/>

            </div>
            <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image alt='Livepeer' src="/livepeer.png" height={64} width={160}/>
            </div>
            <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image alt="Web3 Storage" src="/web3.png" height={64} width={160}/>
            </div>
            <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image alt="IPFS" src="/ipfs.png" height={64} width={160}/>

            </div>
            <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image alt="Metamask" src="/metamask.png" height={64} width={160}/>

            </div>
            <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
              <Image alt ="Ceramic" src="/ceramic.png" height={64} width={160}/>
              
            </div>
            <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image src="/bundlr.png" height={64} width={160}/>

            </div>
            <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
              <Image src="/arweave.png" height={64} width={160}/>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
    <Footer/>     
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
