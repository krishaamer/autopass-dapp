import Head from "next/head"
import React, { useLayoutEffect, useState } from "react"
import Payment from "../components/Payment"
import Profile from "../components/Profile"
import { Page, Navbar, Tabbar, TabbarLink } from "konsta/react"

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
        {activeTab === "profile" && <Profile />}
        {activeTab === "payment" && <Payment />}
        <div className="mochi absolute left-4 bottom-40"></div>
        <Tabbar labels={true} icons={false} className="absolute bottom-24">
          <TabbarLink
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
            label={"Profile"}
          />
          <TabbarLink
            active={activeTab === "payment"}
            onClick={() => setActiveTab("payment")}
            label={"Pay"}
          />
        </Tabbar>
      </Page>
    </>
  )
}
