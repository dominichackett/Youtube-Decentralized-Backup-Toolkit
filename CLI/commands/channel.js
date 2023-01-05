import chalk from "chalk";
import conf from 'conf';
import axios from "axios"
import {client} from  "../utils/client.js"
import pkg from '@apollo/client'
const {gql} = pkg 


export const  showChannels = async() =>
{
	
	
	    const channels = await client.query({query:gql`query{
  youtubeChannelInformationIndex(first:1000){
    edges{
      node{
        id,
        channelId,
        title
      }
    }
  
  }
}
	`})

channels.data.youtubeChannelInformationIndex.edges.forEach((item,index)=> {
 console.log(chalk.greenBright(`${index} ${item.node.title}`))	
})

 
}


 
 
