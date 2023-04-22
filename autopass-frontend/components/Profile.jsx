import { ConnectButton } from "web3uikit"
import { Block, BlockTitle, List, ListItem } from "konsta/react"

const Profile = () => {
  return (
    <>
      <Block strong inset className="space-y-4 bg-slate-100">
        <div className="flex items-center space-x-4">
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
        <div className="flex items-center space-x-4">
          <div className="font-medium dark:text-white">
            <div className="text-sm text-gray-500 dark:text-gray-400">Connect Wallet</div>
          </div>
          <ConnectButton moralisAuth={false} />
        </div>
      </Block>
      <BlockTitle>Previous Purchases</BlockTitle>
      <List strong inset>
        <ListItem title="停車 0.0023 ETH" link header="2023年1月加入 " />
        <ListItem title="停車 0.0133 ETH" link header="2022年11月加入" />
        <ListItem title="停車 0.0011 ETH" link header="2022年10月加入" />
        <ListItem title="停車 0.0024 ETH" link header="2022年9月加入" />
        <ListItem title="停車 0.0123 ETH" link header="2022年8月加入 " />
      </List>
    </>
  )
}

export default Profile
