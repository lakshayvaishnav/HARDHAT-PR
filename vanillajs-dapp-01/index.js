import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js'
import { abi, contractAddress } from './constants.js'

const connectButton = document.getElementById('connectButton')
const withdrawButton = document.getElementById('withdrawButton')
const fundButton = document.getElementById('fundButton')
const balanceButton = document.getElementById('balanceButton')

// click events
connectButton.onclick = connect
withdrawButton.onclick = withdraw
fundButton.onclick = fund
balanceButton.onclick = getBalance

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' })
    } catch (error) {
      console.log(error)
    }
    connectButton.innerHTML = 'connected'
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    console.log(accounts)
  } else {
    connectButton.innerHTML = 'please install metamask'
  }
}

async function getBalance() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(
      'the current account balance is : ',
      ethers.formatEther(balance)
    )
  }
}

async function fund() {
  console.log(`funding...`)
  const ethAmount = document.getElementById('ethAmount').value
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.BrowserProvider(window.ethereum) //browser provider instead of ethers.provider.web3provider
    const signer = await provider.getSigner()
    console.log(signer)
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      console.log('funding with : ', ethAmount)
      const transactionResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      })
      // how to give indication the transaction has run throug and succeeded.
      // listen for tx to be mined.
      await listenForTransactionMine(transactionResponse, provider)
    } catch (error) {
      console.log(error)
    }
  } else {
    connect.log('maa chudaye')
  }
}

async function withdraw() {
  console.log(`withdrawing...`)
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.BrowserProvider(window.ethereum) //browser provider instead of ethers.provider.web3provider
    const signer = await provider.getSigner()
    console.log('the signer is : ', signer)
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
    } catch (error) {
      console.log(error)
    }
  } else {
    // connect.log('maa chudaye')
  }
}

// function listenForTransactionMine(transactionResponse, provider) {
//   console.log('mining tansaction: ', transactionResponse.hash)
//   provider.once(transactionResponse.hash, (transactionReceipt) => {
//     console.log(
//       'completed with tranasacion :  ',
//       transactionReceipt.confimations
//     )
//   })
// }  //this provider.once had becomce outdated

async function listenForTransactionMine(transactionResponse, provider) {
  console.log('Mining transaction:', transactionResponse.hash)

  try {
    const transactionReceipt = await provider.getTransactionReceipt(
      transactionResponse.hash
    )
    console.log(
      'Completed with confirmations: ',
      transactionReceipt.blockNumber
    )
  } catch (error) {
    console.error('Error while listening for transaction mining:', error)
  }
}
