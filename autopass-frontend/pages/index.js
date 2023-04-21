import Head from "next/head"
import React, { useLayoutEffect, useState } from "react"
import { ConnectButton } from "web3uikit"
import Autopass from "../components/Autopass"
import { Page, Navbar, Block, List, ListItem, Toggle } from "konsta/react"

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  useLayoutEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"))
  })

  return (
    <>
      <Head>
        <title>Autopass</title>
        <meta name="description" content="Autopass" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page className="bg-triangles">
        <Navbar title="Autopass" className="mt-28" />
        <Block strong>Pay with ETH</Block>
        <div className="mochi animate-bounce ease-in-out duration-1000"></div>
        <div className="p-5 border-b-2 flex flex-row">
          <div className="ml-auto py-2 px-4">
            <List strong inset>
              <ListItem
                title="Dark Mode"
                label
                after={
                  <Toggle component="div" onChange={() => toggleDarkMode()} checked={darkMode} />
                }
              />
            </List>
            <ConnectButton moralisAuth={false} />
          </div>
        </div>
        <Autopass />
      </Page>
    </>
  )
}
