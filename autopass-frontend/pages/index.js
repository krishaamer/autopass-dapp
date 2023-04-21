import Head from "next/head"
import React, { useLayoutEffect, useState } from "react"
import { ConnectButton } from "web3uikit"
import Autopass from "../components/Autopass"
import {
  Page,
  Navbar,
  Block,
  List,
  ListItem,
  Toggle,
  Tabbar,
  TabbarLink,
  Sheet,
  Button,
  Toolbar,
  Link,
} from "konsta/react"

export default function Home() {
  const [sheetOpened, setSheetOpened] = useState(false)
  const [activeTab, setActiveTab] = useState("tab-1")
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
        <Navbar title="Autopass" className="absolute top-28" />
        <div className="mt-60"></div>
        {activeTab === "tab-1" && (
          <>
            <Block strong inset className="space-y-4 bg-slate-100">
              <div class="flex items-center space-x-4">
                <img
                  className="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                  src="/user.svg"
                  alt="Bordered avatar"
                />
                <div className="font-medium dark:text-white">
                  <div>林美玲</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">2021年1月加入</div>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div className="font-medium dark:text-white">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Connect Wallet</div>
                </div>
                <ConnectButton moralisAuth={false} />
              </div>
            </Block>
            <Block strong inset className="space-y-4 bg-slate-100">
              <div class="flex items-center space-x-4">
                <div className="font-medium dark:text-white">
                  <div>Previous Purchases</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    2023年1月加入 0.0023 ETH
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    2022年11月加入 0.0133 ETH
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    2022年10月加入 0.0011 ETH
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    2022年9月加入 0.0024 ETH
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    2022年8月加入 0.0123 ETH
                  </div>
                </div>
              </div>
            </Block>
          </>
        )}
        {activeTab === "tab-2" && (
          <Block strong inset className="space-y-4">
            <Autopass />
          </Block>
        )}
        <div className="mochi absolute left-4 bottom-40"></div>
        <Tabbar labels={true} icons={false} className="absolute bottom-24">
          <TabbarLink
            active={activeTab === "tab-1"}
            onClick={() => setActiveTab("tab-1")}
            label={"Connect"}
          />
          <TabbarLink
            active={activeTab === "tab-2"}
            onClick={() => setActiveTab("tab-2")}
            label={"Pay"}
          />
        </Tabbar>
      </Page>
    </>
  )
}
