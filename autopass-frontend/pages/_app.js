import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import { App } from "konsta/react"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  return (
    <div className="grid items-center justify-center h-screen">
      <div className="mockup-phone border-primary">
        <div className="camera"></div>
        <div className="display">
          <div className="artboard artboard-demo phone-1">
            <App theme="ios">
              <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                  <Component {...pageProps} />
                </NotificationProvider>
              </MoralisProvider>
            </App>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyApp
