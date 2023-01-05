//import { ApolloClient, ApolloLink, InMemoryCache, Observable } from '@apollo/client'
import { ComposeClient } from '@composedb/client'
import pkg from '@apollo/client';
const { ApolloClient, ApolloLink, InMemoryCache, Observable } = pkg;
// Path to the generated runtime composite definition
import { definition } from '../defs/ytbackup.js'
import { DIDSession } from 'did-session'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'

import {EthereumNodeAuth, getAccountId } from '@didtools/pkh-ethereum'
import conf from 'conf';
import chalk from "chalk";
import {ethers} from "ethers"
import Web3 from 'web3'
import HDWalletProvider from '@truffle/hdwallet-provider';

const config = new conf()


const compose = new ComposeClient({ ceramic: 'http://localhost:7007', definition })
//compose.setDID("d5ff761d31ac5a902016a45209ec972b602b7875ed023a7b48082095a9252a38")
// Create a custom ApolloLink using the ComposeClient instance to execute operations
const link = new ApolloLink((operation) => {
  return new Observable((observer) => {
    compose.execute(operation.query, operation.variables).then(
      (result) => {
        observer.next(result)
        observer.complete()
      },
      (error) => {
        observer.error(error)
      }
    )
  })
})

// Use the created ApolloLink instance in your ApolloClient configuration
export const client = new ApolloClient({ cache: new InMemoryCache(), link })