import { abi, contractAddresses, abiDAO, abiToken } from "../constants/index.js"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useEffect, useState, useRef } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
import { Bell } from "@web3uikit/icons"
import {
  List,
  ListInput,
  ListItem,
  Segmented,
  SegmentedButton,
} from "konsta/react"

const AutopassDAO = () => {
  // Extract chainId from useMoralis and rename it to chainIdHex, which is a hexadecimal value, e.g., 0xa123...
  const { chainId: chainIdHex, isWeb3Enabled, Moralis, account, deactivateWeb3 } = useMoralis()
  // Declare a variable chainId (which won't conflict with chainIdHex) and convert the hexadecimal value to decimal
  const chainId = parseInt(chainIdHex)
  // Declare a variable raffleAddress, which is either the contract address associated with the decimal chainId value in contractAddresses.json or null if it is not found
  const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
  const tokenAddress = chainId in contractAddresses ? contractAddresses[chainId][1] : null
  const DAOAddress = chainId in contractAddresses ? contractAddresses[chainId][2] : null

  // The chainId variable from useMoralis is only retrieved after connecting to a wallet
  let nowChainId = parseInt(chainIdHex)

  // Declare variables using useState, initialized to 0, for entranceFee, numPlayers, recentWinner, contractBalance, playerTimes, winChance, winnerBalance, and ethPrice, respectively
  const [userContractBalance, setUserContractBalance] = useState(0)
  const [contractBalance, setContractBalance] = useState(0)
  const [userPrice, setUserPrice] = useState(0)
  const [entranceFee, setEntranceFee] = useState(0.01)
  const [issue, setIssue] = useState({ value: "", changed: false })
  const [voteGroupValue, setVoteGroupValue] = useState("")
  const [proposalList, setProposalList] = useState([])
  const [activeProposal, setActiveProposal] = useState({
    id: -1,
    support: false,
  })
  const [voteRate, setVoteRate] = useState(0)

  // Call the getEntranceFee view function from the Raffle contract using the Moralis useWeb3Contract hook to retrieve the minimum entrance fee

  // Function to deposit funds into the contract
  // const {
  //   runContractFunction: spendMoney,
  //   isLoading,
  //   isFetching,
  // } = useWeb3Contract({
  //   abi: abi,
  //   contractAddress: raffleAddress,
  //   functionName: "spendMoney",
  //   params: {
  //     thirdPartyPay: ethers.utils.parseEther(entranceFee.toString()),
  //     thirdPartyAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  //   },
  //   msgValue: ethers.utils.parseEther(entranceFee.toString()),
  // })

  // Function to mint token from contract
  const {
    runContractFunction: mintToken,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abiToken,
    contractAddress: tokenAddress,
    functionName: "mintToken",
    params: {},
  })

  const { runContractFunction: delegate } = useWeb3Contract({
    abi: abiToken,
    contractAddress: tokenAddress,
    functionName: "delegate",
    params: {
      delegatee: account,
    },
  })

  const { runContractFunction: createProposal } = useWeb3Contract({
    abi: abiDAO,
    contractAddress: DAOAddress,
    functionName: "createProposal",
    params: {
      description: issue.value,
    },
  })

  const { runContractFunction: getActiveProposals } = useWeb3Contract({
    abi: abiDAO,
    contractAddress: DAOAddress,
    functionName: "getActiveProposals",
    params: {},
  })

  const { runContractFunction: vote } = useWeb3Contract({
    abi: abiDAO,
    contractAddress: DAOAddress,
    functionName: "vote",
    params: {
      proposalId: activeProposal.id,
      support: activeProposal.support,
    },
  })

  const { runContractFunction: quorumNumerator } = useWeb3Contract({
    abi: abiDAO,
    contractAddress: DAOAddress,
    functionName: "quorumNumerator",
    params: {},
  })

  const { runContractFunction: mintedTokens } = useWeb3Contract({
    abi: abiDAO,
    contractAddress: DAOAddress,
    functionName: "mintedTokens",
    params: {},
  })

  // Use the retrieve function to check user's balance in the contract
  const { runContractFunction: retrieve } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "retrieve",
    params: {
      spender: account,
      thirdPartyAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
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
        const userContractBalance = (await retrieve())
          ? (await retrieve()).toString()
          : ""

        const contractBalance = (await getContractBalance())
          ? (await getContractBalance()).toString()
          : ""

        // todo getProposal
        const preProposalList = (await getActiveProposals())
        ? (await getActiveProposals()).toString()
        : ""
        const proposals = []
        let tempProposal = {}
        preProposalList.split(',').forEach((data, i) => {
          switch (i%6) {
            case 0:
              tempProposal.id = data
              break;
            case 1:
              tempProposal.proposer = data
              break;
            case 2:
              tempProposal.title = data
              break;
            case 3:
              tempProposal.aproval = !!Number(data)
              break;
            case 4:
              tempProposal.against = !!Number(data)
              break;
            case 5:
              tempProposal.canExcute = data
              proposals.push(tempProposal)
              tempProposal = {}
              break;

            default:
              break;
          }
        })
        console.log('pre', preProposalList)
        const voteNum = (await mintedTokens())
          ? (await mintedTokens()).toString()
          : ""
        const quorum = (await quorumNumerator())
          ? (await quorumNumerator()).toString()
          : ""
        setContractBalance(ethers.utils.formatEther(contractBalance))
        setUserContractBalance(ethers.utils.formatEther(userContractBalance))
        setProposalList(proposals)
        setVoteRate(((voteNum * quorum) / 100).toFixed(2))
        setUserPrice(userPrice)
      } catch (error) {
        console.log(error)
      }
    }
  }

  // Ethereum to USD conversion function
  function priceConvert(fees) {
    // fees = fees || "0x0"
    // const a = ethers.utils.formatUnits(fees, "ether")
    // const b = ethers.utils.formatUnits(ethPrice, "ether")
    // const percent = a * b * 100
    // const round = Math.round(percent) / 100
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

  useEffect(() => {
    if (activeProposal.id > -1) {
      vote()
    }
  }, [activeProposal])

  // JsonRpcProvider and Contract objects
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://eth-goerli.g.alchemy.com/v2/eO-4t0dSBC3mQckIv5zVo90O_yV6H95k"
  // )
  // const CONTRACT_ADDR = "0xfA28691A9dFB27173B50Baa343a3CD35138a3932"
  // const contract = new ethers.Contract(CONTRACT_ADDR, abi, provider)

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
    console.log(error);
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

  const callMintToken = async () => {
    try {
      await mintToken({
        onSuccess: handleSuccess,
        onError: handleError,
      })

      await callDelegate()

    } catch (error) {
      handleErrorNotification()
      console.log(error)
    }
  }

  const callDelegate = async () => {
    try {
      await delegate({
        onSuccess: handleSuccess,
        onError: handleError,
      })
    } catch(error) {
      handleErrorNotification()
      console.log(error)
    }
  }

  const callCreateProposal = async () => {
    try {
      // todo createProposal
      await createProposal({
        onSuccess: handleSuccess,
        onError: handleError,
      })
    } catch (error) {
      handleErrorNotification()
      console.log(error)
    }
  }
  const onIssueChange = (e) => {
    setIssue({ value: e.target.value, changed: true });
  };

  const voteProposal = (id, support) => {
    setActiveProposal({
      id,
      support,
    })
  }

  return (
    <div className="p-5 rounded-lg bg-slate-100">
      {isWeb3Enabled ? (
        nowChainId == chainId ? (
          <div className="items-center space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={callMintToken}
              disabled={isLoading || isFetching}
            >
              {isLoading || isFetching ? (
                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
              ) : (
                <div>Mint!</div>
              )}
            </button>
            <List strongIos insetIos>
              <ListInput
                label="Issue"
                type="text"
                placeholder="Give me an idea"
                disabled={isLoading || isFetching}
                value={issue.value}
                onChange={onIssueChange}
              />
            </List>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={callCreateProposal}
              disabled={isLoading || isFetching}
            >
              {isLoading || isFetching ? (
                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
              ) : (
                <div>Submit!</div>
              )}
            </button>

            <List strongIos outlineIos>
              {proposalList.map(proposal => {
                return (
                    <ListItem
                      label
                      title={proposal.title}
                      key={proposal.id}
                      after={
                        <Segmented rounded>
                          <SegmentedButton
                            disabled={proposal.aproval || proposal.against}
                            active={proposal.value === true}
                            onClick={() => voteProposal(proposal.id, true)}
                          >
                            Aproval
                          </SegmentedButton>
                          <SegmentedButton
                            disabled={proposal.aproval || proposal.against}
                            active={proposal.value === false}
                            onClick={() => voteProposal(proposal.id, false)}
                          >
                            Against
                          </SegmentedButton>
                        </Segmented>
                      }
                    />
                  );
                })
              }
            </List>
          </div>
        ) : (
          <div className="text-blue-600 hover:underline font-medium">Wrong chain</div>
        )
      ) : (
        <div className="text-rose-500 hover:underline font-medium">No web3 wallet</div>
      )}
    </div>
  )
}

export default AutopassDAO
