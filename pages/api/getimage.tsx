import { NextApiRequest, NextApiResponse } from 'next';
export type GetImageBody = {
    url: string;
       };

       export type ApiError = {
        message: string;
       };

       export type ImageResponse = {
        image:  Uint8Array    };      
const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<Uint8Array | ApiError>
   ) => {
  
    const method = req.method;
try {
 if (method === 'POST') {
 const { url }: GetImageBody = req.body;

 if (!url ) {
 return res.status(400).json({ message: 'Missing  url in body.' });
 }
 await fetch(url).then(async (data)=>{
  res.setHeader('Content-Type', 'image/jpeg')
    const imageBuffer =   await data.arrayBuffer()
    const image = new Uint8Array(imageBuffer)
    const resp:ImageResponse = {image:image}
    res.send(image)

 })
 }
}catch(e:any)
{
    res.status(400).json({message:e.message})
} 
 

}


export default handler;
