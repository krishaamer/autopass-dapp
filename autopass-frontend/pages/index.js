import Head from "next/head"
import React, { useState } from "react"
import Pay from "../components/Pay"
import AutopassDAO from "../components/AutopassDAO"
import Profile from "../components/Profile"
import { Page, Navbar, Tabbar, TabbarLink } from "konsta/react"

export default function Home() {

  const [activeTab, setActiveTab] = useState("profile")

  return (
    <>
      <Head>
        <title>Autopass</title>
        <meta name="description" content="Autopass" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page className="bg-triangles">
        <Navbar title="Autopass" className="absolute top-20" />
        <div className="mt-40"></div>
        {activeTab === "profile" && <Profile />}
        {activeTab === "vote" && <AutopassDAO />}
        {activeTab === "pay" && <Pay />}
        <div className="mochi absolute left-4 bottom-20"></div>
        <Tabbar labels={true} icons={false} className="absolute bottom-14">
          <TabbarLink
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
            label={"Login"}
          />
          <TabbarLink
            active={activeTab === "pay"}
            onClick={() => setActiveTab("pay")}
            label={"Pay"}
          />
          <TabbarLink
            active={activeTab === "vote"}
            onClick={() => setActiveTab("vote")}
            label={"DAO"}
          />
        </Tabbar>
      </Page>
    </>
  )
}
