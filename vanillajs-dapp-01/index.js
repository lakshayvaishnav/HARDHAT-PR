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

async function fund() {
  console.log(`funding...`)
  const ethAmount = '77'
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.BrowserProvider(window.ethereum) //browser provider instead of ethers.provider.web3provider
    const signer = await provider.getSigner()
    console.log(signer)
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      })
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
    provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    console.log(signer)
    const contract = new ethers.Contract(contractAddress, abi, signer)
    const transactionResponse = await contract.fund({
      value: ethers.parseEther(ethAmount),
    })
  } else {
    // connect.log('maa chudaye')
  }
}
