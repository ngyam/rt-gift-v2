const Web3 = require('web3')
import * as utils from './utils'
import {Window, Post} from './types'

declare let window: Window

const blogJSONAbiString = '[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"blogEntries","outputs":[{"name":"timestamp","type":"uint256"},{"name":"lat","type":"bytes16"},{"name":"lon","type":"bytes16"},{"name":"post","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"tokenAddress","type":"address"},{"name":"_timestamp","type":"uint256"},{"name":"_lat","type":"bytes16"},{"name":"_lon","type":"bytes16"},{"name":"firstPost","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"poster","type":"address"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"postId","type":"uint256"}],"name":"BlogPost","type":"event"},{"constant":true,"inputs":[],"name":"getLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getEntry","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes16"},{"name":"","type":"bytes16"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_post","type":"string"},{"name":"_lat","type":"bytes16"},{"name":"_lon","type":"bytes16"}],"name":"post","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]'
const blogJSONAbi = JSON.parse(blogJSONAbiString)
const blogAddress = '0xaAc6B15e7e6ADdE49f0068dBDCA25bc3B9527Ec6'

const tokenJSONAbiString = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_who","type":"address"},{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'
const tokenJSONAbi = JSON.parse(tokenJSONAbiString)
const tokenAddress = '0x63108b8b58548Bc1Dc63031fe34dde6c7664b3da'

export async function fetchWeb3() {
    let web3: any = await utils.getWeb3()
    if (!web3) {
        alert("Please login to Metamask & restart the page, or restart your browser")
    }
    window.web3 = web3
    console.log("listening: ", web3? await web3.eth.net.isListening(): false)
    console.log("Network: ", web3? await web3.eth.net.getId(): undefined)

    await tryBlogContract()
    await tryTokenContract()

    return web3
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

    let posts: Post[] = []

    let length = await window.blogContract.methods.getLength().call()
    let entry
    for (let i = length - 1; i >= 0 ; i--) {
        entry = await window.blogContract.methods.getEntry(i).call()
        posts.push({
            date: new Date(entry[0] * 1000),
            latitude: window.web3.utils.hexToUtf8(entry[1]),
            longitude: window.web3.utils.hexToUtf8(entry[2]),
            message: entry[3]
        })
    }
    return posts
}

export async function estimateGas(message: string): Promise<string> {
    return await window.blogContract.methods.post(message).estimateGas()
}

export function checkLat(lat){
    let ck_lat: RegExp = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/
    return ck_lat.test(lat)
}

export function checkLon(lon) {
    let ck_lon: RegExp = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/
    return ck_lon.test(lon)
}

export async function sendPost(message: string, lat: string, lon: string): Promise<any> {
    
    if(!checkLat(lat)) {
        throw new Error("Latitude is wrong, should be (-90,90)")
    }

    if(!checkLon(lon)) {
        throw new Error("Longitude is wrong, should be (-180,180)")
    }

    return await window.blogContract.methods.post(
        message,
        window.web3.utils.utf8ToHex(lat),
        window.web3.utils.utf8ToHex(lon)
    )
    .send({ from: await getAccount() })
}

export async function getTokenBalance(): Promise<any> {
    return window.web3.utils.fromWei(
        await window.tokenContract.methods.balanceOf(await getAccount()).call(),
        "ether"
    )
}

export async function getETHBalance(): Promise<any> {
    return window.web3.utils.fromWei(
        await window.web3.eth.getBalance(await getAccount()),
        "ether"
    )
}
