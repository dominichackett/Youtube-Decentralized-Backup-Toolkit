import '../styles/globals.css'

import {CeramicWrapper} from "../context";
import type { AppProps } from 'next/app'
import {KeyringProvider }  from '@w3ui/react-keyring'
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
var ax = require('@w3ui/react-uploader')

const client = createReactClient({
  provider: studioProvider({ apiKey: 'da927d9f-f559-45f2-b487-7bc0f2fb760c' }),
});
 
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
  return (
    <KeyringProvider >
      <ax.UploaderProvider >
    <LivepeerConfig client={client} theme={livepeerTheme}>

    <CeramicWrapper>
      <Component {...pageProps} ceramic />
    </CeramicWrapper></LivepeerConfig>
    </ax.UploaderProvider >
    </KeyringProvider>
  );
}

export default MyApp