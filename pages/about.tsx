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
import Header from '../src/header/header'
import Footer from '../src/footer/footer'



export default function About() {

  return (
    <div className="min-h-full">
    <Header/>
    <main>
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
          <div>
          <h3 className="text-center text-3xl font-bold tracking-tight sm:text-3xl lg:text-6xl">
                  <span className="block text-red">YouTube Decentralized</span>
                  <span className="block text-red-600">Backup Toolkit</span>
                </h3>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
             Built using the best of breed web3 technologies
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-gray-500">
              Protect your content from big tech censorship.  Download your content to your computer.
              Store your content in a decentralized manner on IPFS. Manager and view your content.
            </p>
            <div className="mt-8 sm:flex">
              <div className="rounded-md shadow">
                <a
                  href="/channels"
                  className="flex items-center justify-center rounded-md border border-transparent bg-red-600 px-5 py-3 text-base font-medium text-white hover:bg-red-700"
                >
                  View Channels
                </a>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <a
                  href="/config"
                  className="flex items-center justify-center rounded-md border border-transparent bg-red-100 px-5 py-3 text-base font-medium text-red-700 hover:bg-red-200"
                >
                  Configure
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
            <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image src="/polygon.png" height={64} width={160}/>

            </div>
            <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image src="/livepeer.png" height={64} width={160}/>
            </div>
            <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image src="/web3.png" height={64} width={160}/>
            </div>
            <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image src="/ipfs.png" height={64} width={160}/>

            </div>
            <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image src="/metamask.png" height={64} width={160}/>

            </div>
            <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
              <Image src="/ceramic.png" height={64} width={160}/>
              
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
    </div>
  )
}
