/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains:['yt3.ggpht.com',"googleusercontent.com","i.ytimg.com","www.tailwindui.com"]
  },
  env: {
    
    NEXT_PUBLIC_NFT_STORAGE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDM1OTMyM2U4OTZkMTUwMjAxRkFkODQ1MzE4RTZjOWM1NDkyRjEwN2YiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMzM2ODk0OTI1OSwibmFtZSI6IlVuc3RvcHBhYmxlIFN0cmVhbXMifQ.aaXjhUhPFhOYQxdWeaQE0PV2chNvwWEYm9sVAppe4zY",
    

  },
  async headers() {
    return [
      {
        source: '/mint',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {key:"Cross-Origin-Resource-Policy",value:"cross-origin"}
        ],
      },
    ];
  },
       
}
module.exports = nextConfig
