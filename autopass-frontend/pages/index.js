import Head from "next/head"
import { ConnectButton } from "web3uikit"
import Autopass from "../components/Autopass"
import { App, Page, Navbar, Block } from "konsta/react"

export default function Home() {
  return (
    <App theme="ios">
      <Page>
        <Navbar title="My App" />
        <Block strong>Autopass</Block>
        <div className="bg-triangles">
          <div className="container">
            <div className="mochi animate-bounce ease-in-out duration-1000"></div>
            <Head>
              <title>Autopass</title>
              <meta name="description" content="Autopass" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="p-5 border-b-2 flex flex-row">
              <h1 className="py-4 px-4 font-blog text-3xl">Autopass</h1>
              <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
              </div>
            </div>
            <Autopass />
          </div>
        </div>
      </Page>
    </App>
  )
}
