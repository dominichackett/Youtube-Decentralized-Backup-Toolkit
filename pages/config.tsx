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
import { Fragment, useState,useEffect } from 'react'
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  PaperClipIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import { Listbox, Transition } from '@headlessui/react'
import Header from '../src/header/header'
import Footer from '../src/footer/footer'
import Notification from '../src/Notification/Notification'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Config() {
 // NOTIFICATIONS functions
 const [notificationTitle, setNotificationTitle] = useState();
 const [notificationDescription, setNotificationDescription] = useState();
 const [dialogType, setDialogType] = useState(1);
 const [show, setShow] = useState(false);
 const close = async () => {
   setShow(false);
 };


const [apikey,setApiKey] = useState()
useEffect(()=>{
  if(localStorage.getItem("apikey"))
    setApiKey(localStorage.getItem("apikey"))

},[])

const saveKey = (e) =>{
 // alert( document.getElementById("apikey").value)
  localStorage.setItem("apikey", document.getElementById("apikey").value)
  setDialogType(1) //Success
  setNotificationTitle("Saved API Key")
  setNotificationDescription("API Key Saved Successfully.") 
  setShow(true) 
  e.preventDefault()

}

  return (
    <div className="min-h-full">
    <Header/>
    <main>
    <form className="m-12 space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Configuration</h3>
            <p className="mt-1 text-sm text-gray-500">
              You will need a YouTube API key to use this software.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
           

            <div className="sm:col-span-6">
              <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                YouTube API Key
              </label>
              <div className="mt-1">
                <textarea
                  id="apikey"
                  name="apikey"
                  rows={9}
                  className="block w-full rounded-md border-gray-500 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  defaultValue={apikey}
                />
              </div>
            </div>

           
            
          </div>
        </div>

       

        
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={saveKey}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </form>
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
