import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import { App } from "konsta/react"
import { ThemeProvider } from "next-themes"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <ThemeProvider forcedTheme="dark">
        <NotificationProvider>
          <div className="grid items-center justify-center h-screen">
            <div className="mockup-phone border-primary">
              <div className="camera"></div>
              <div className="display">
                <div className="artboard artboard-demo phone-1">
                  <App theme="ios">
                    <Component {...pageProps} />
                  </App>
                </div>
              </div>
            </div>
          </div>
        </NotificationProvider>
      </ThemeProvider>
    </MoralisProvider>
  )
}

export default MyApp
