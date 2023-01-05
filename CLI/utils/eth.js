import {ethers} from 'ethers'
import chalk from "chalk";
import conf from 'conf';


export const createAccount = async () =>{
    const config = new conf()
	
	if(config.get("wallet")!= undefined)
		
	{
		
		console.log(chalk.greenBright(`Wallet: ${JSON.stringify(config.get("wallet"))}`))
		console.log(ethers.getDefaultProvider())
		return
    }	

    const newWallet = ethers.Wallet.createRandom()
    
	config.set("wallet",{address:newWallet.address,mnemonic:newWallet.mnemonic.phrase,privateKey:newWallet.privateKey})
	
	
}