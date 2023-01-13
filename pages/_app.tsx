import '../styles/globals.css'

import {CeramicWrapper} from "../context";
import type { AppProps } from 'next/app'
import {KeyringProvider }  from '@w3ui/react-keyring'
import { AptosClient } from 'aptos';

import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
import { createContext, useMemo } from 'react';

var ax = require('@w3ui/react-uploader')

const client = createReactClient({
  provider: studioProvider({ apiKey: 'da927d9f-f559-45f2-b487-7bc0f2fb760c' }),
});
export const AptosContext = createContext<AptosClient | null>(null);

const livepeerTheme = {
  colors: {
    accent: 'rgb(0, 145, 255)',
    containerBorderColor: 'rgba(0, 145, 255, 0.9)',
  },
  fonts: {
    display: 'Inter',
  },
};
const MyApp = ({ Component, pageProps }: AppProps) => {

  const aptosClient = useMemo(
    () => new AptosClient('https://fullnode.devnet.aptoslabs.com/v1'),
    [],
  );
  return (
    <KeyringProvider >
      <ax.UploaderProvider >
      <AptosContext.Provider value={aptosClient}>
    
    <LivepeerConfig client={client} theme={livepeerTheme}>

    <CeramicWrapper>
      <Component {...pageProps} ceramic />
    </CeramicWrapper></LivepeerConfig>
    </AptosContext.Provider>

    </ax.UploaderProvider >
    </KeyringProvider>
  );
}

export default MyApp