const Web3 = require('web3')
import * as utils from './utils'
import {Window, Post} from './types'

declare let window: Window

const blogJSONAbiString = '[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"blogEntries","outputs":[{"name":"post","type":"string"},{"name":"timestamp","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"tokenAddress","type":"address"},{"name":"firstPost","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"poster","type":"address"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"postId","type":"uint256"}],"name":"BlogPost","type":"event"},{"constant":true,"inputs":[],"name":"getLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getEntry","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_post","type":"string"}],"name":"post","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]'
const blogJSONAbi = JSON.parse(blogJSONAbiString)
const blogAddress = '0x0407011c482E3446b66Eb9554E23786A625f493c'

const tokenJSONAbiString = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_who","type":"address"},{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'
const tokenJSONAbi = JSON.parse(tokenJSONAbiString)
const tokenAddress = '0x72749495Ab74A59eF9E53f63062e99d074060ebc'

export async function fetchWeb3() {
    utils.getWeb3().then(async (web3: any) => {
        if (!web3) {
            alert("Please login to metamask & restart the page, or restart your browser")
        }
        window.web3 = web3
        console.log("listening:", web3? await web3.eth.net.isListening(): false)
        console.log(await getAccount())
        
        await tryBlogContract()
        await tryTokenContract()    
    })
}

export async function getAccount(): Promise<string> {
    let accounts = await window.web3.eth.getAccounts()
    return accounts[0]
}

export async function tryBlogContract() {
    window.blogContract = new window.web3.eth.Contract(blogJSONAbi, blogAddress)
}

export async function tryTokenContract() {
    window.tokenContract = new window.web3.eth.Contract(tokenJSONAbi, tokenAddress)
}

export async function getPostsHtml(): Promise<Post[]> {

    if (!window.blogContract) {
        console.error("Messages could not be fetched, because contract is not set.")
        return []
    }

    let posts = [
        {
            date: new Date(2019, 6, 16),
            message:'Ma is megosztottunk valamit'
        },
        {
            date: new Date(2019, 6, 17),
            message: 'Meg ma is'
        }
    ]

    let length = await window.blogContract.methods.getLength().call()
    let entry
    for (let i = 0; i < length; i++) {
        entry = await window.blogContract.methods.getEntry(i).call()
        posts.push({
            date: new Date(entry[0] * 1000),  
            message: entry[1]
        })
    }
    return posts
}

export async function estimateGas(message: string): Promise<string> {
    return await window.blogContract.methods.post(message).estimateGas({from: await getAccount()})
}

export async function sendPost(message: string): Promise<any> {
    return await window.blogContract.methods.post(message).send()
}

export async function getTokenBalance(): Promise<any> {
    let account = await getAccount()
    return window.tokenContract.methods.balanceOf(account).call()
}
