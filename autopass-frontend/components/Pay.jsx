import { abi, contractAddresses, abiDAO } from "../constants/index.js"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useEffect, useState, useRef } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
import { Block } from "konsta/react"
import { Bell } from "@web3uikit/icons"

const Payment = () => {
  // Extract chainId from useMoralis and rename it to chainIdHex, which is a hexadecimal value, e.g., 0xa123...
  const { chainId: chainIdHex, isWeb3Enabled, Moralis, account, deactivateWeb3 } = useMoralis()
  // Declare a variable chainId (which won't conflict with chainIdHex) and convert the hexadecimal value to decimal
  const chainId = parseInt(chainIdHex)
  // Declare a variable raffleAddress, which is either the contract address associated with the decimal chainId value in contractAddresses.json or null if it is not found
  const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
  const DAOAddress = chainId in contractAddresses ? contractAddresses[chainId][1] : null

  // The chainId variable from useMoralis is only retrieved after connecting to a wallet
  let nowChainId = parseInt(chainIdHex)

  // Declare variables using useState, initialized to 0, for entranceFee, numPlayers, recentWinner, contractBalance, playerTimes, winChance, winnerBalance, and ethPrice, respectively
  const [userContractBalance, setUserContractBalance] = useState(0)
  const [contractBalance, setContractBalance] = useState(0)
  const [userPrice, setUserPrice] = useState(0)
  const [entranceFee, setEntranceFee] = useState(0.01)

  // Function to deposit funds into the contract
  const {
    runContractFunction: spendMoney,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "spendMoney",
    params: {
      thirdPartyPay: ethers.utils.parseEther(entranceFee.toString()),
      thirdPartyAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    },
    msgValue: ethers.utils.parseEther(entranceFee.toString()),
  })

  // Use the retrieve function to check user's balance in the contract
  const { runContractFunction: retrieve } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "retrieve",
    params: {
      spender: account,
      thirdPartyAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    },
  })

  // Only contract owner can use the withdrawProceeds function to withdraw the contract balance
  const { runContractFunction: withdrawProceeds } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "withdrawProceeds",
    params: {},
  })

  // Use getContractBalance function to check the contract balance
  const { runContractFunction: getContractBalance } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getContractBalance",
    params: {},
  })

  // When this function is called, call the contract to get values and update them in State
  async function UpdateUI() {
    if (nowChainId == chainId) {
      // Use try-catch to ensure the webpage continues running.
      // The writing style uses a ternary operator to check if the object exists. If not, pass an empty value.
      try {
        const userContractBalance = (await retrieve()) ? (await retrieve()).toString() : ""

        const contractBalance = (await getContractBalance())
          ? (await getContractBalance()).toString()
          : ""

        setContractBalance(ethers.utils.formatEther(contractBalance))
        setUserContractBalance(ethers.utils.formatEther(userContractBalance))
        setUserPrice(userPrice)
      } catch (error) {
        console.log(error)
      }
    }
  }

  // Ethereum to USD conversion function
  function priceConvert(fees) {
    return Number(fees)*30
  }

  // Switch network function
  async function swtichNetwork(chain) {
    const chainIdHex = await Moralis.switchNetwork(chain)
    return chainIdHex
  }

  // useEffect hook to call view function and get deposit amount
  // Triggered after the page has loaded and when MetaMask is connected
  // Does not call getEntranceFee on the first page load when the user is not connected to a wallet
  // Include isWeb3Enabled in the dependency array to trigger this useEffect when the wallet is connected
  // This useEffect is triggered every time the account is connected or disconnected
  useEffect(() => {
    if (isWeb3Enabled) {
      UpdateUI()
    }
  }, [isWeb3Enabled])

  // useEffect hook that runs only once after the page refreshes
  useEffect(() => {
    // When an account change is detected after connecting to a wallet
    Moralis.onAccountChanged((account) => {
      // If the account is empty, it may have been disconnected manually, so deactivateWeb3
      if (account == null) {
        deactivateWeb3()
      } else if (account != null) {
        UpdateUI()
      }
    })
  }, [])

  useEffect(() => {
    // When a chain change is detected after connecting to a wallet
    Moralis.onChainChanged((chain) => {
      const chainIdHex = swtichNetwork(chain)
      nowChainId = parseInt(chainIdHex)
      UpdateUI()
    })
  }, [])

  // useNotification hook for dispatching notifications
  const dispatch = useNotification()

  // Async function to handle successful enterRaffle onClick calls
  const handleSuccess = async function (tx) {
    // Wait for one block confirmation
    await tx.wait(1)
    // Trigger another function
    handleNewNotification(tx)
    // Update UI after successful deposit
    UpdateUI()
  }

  const handleError = async function (error) {
    console.log(error)
    // const contractState = await getRaffleState()
    // console.log(`contract State : ${contractState}`);
    handleErrorNotification()
  }

  // This function is called by handleSuccess and is a general function
  // Call dispatch of useNotification and pass in the format of the notification to be sent
  // Refer to https://web3ui.github.io/web3uikit/?path=/docs/5-popup-notification--hook-demo
  const handleNewNotification = function () {
    // The object passed to dispatch is an object
    dispatch({
      type: "info",
      message: "Transaction successful!",
      title: "Transaction Notification",
      position: "topR",
      icon: <Bell fontSize="50px" />,
    })
  }

  const handleErrorNotification = function () {
    // The object passed to dispatch is an object
    dispatch({
      type: "error",
      message: "Transaction failed.",
      title: "Transaction Notification",
      position: "topR",
      icon: <Bell fontSize="50px" />,
    })
  }

  const callSpendMoney = async () => {
    try {
      await spendMoney({
        onSuccess: handleSuccess,
        onError: handleError,
      })
    } catch (error) {
      handleErrorNotification()
      console.log(error)
    }
  }

  return (
    <Block strong inset className="space-y-4">
      <div className="p-5 rounded-lg">
        {isWeb3Enabled ? (
          nowChainId == chainId ? (
            <div className="items-center">
              <div className="text-xl">
                <span className="font-medium">Parking cost:</span> {entranceFee} xDai (
                {priceConvert(entranceFee)} TWD)
              </div>
              <div className="text-xl">
                <span className="font-medium">Contract value:</span> {contractBalance} xDai (
                {priceConvert(contractBalance)} TWD)
              </div>
              <div className="pt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={callSpendMoney}
                  disabled={isLoading || isFetching}
                >
                  {isLoading || isFetching ? (
                    <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                  ) : (
                    <div>Pay Now</div>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="items-center">
              <div className="text-blue-600 hover:underline font-medium">Wrong chain</div>
            </div>
          )
        ) : (
          <div className="items-center">
            <div className="text-rose-500 hover:underline font-medium">No web3 wallet</div>
          </div>
        )}
      </div>
    </Block>
  )
}

export default Payment
