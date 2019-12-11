export interface Window {
    ethereum: any
    web3?: any
    addEventListener: any,
    tokenContract?: any,
    blogContract?: any
}

export interface Post {
    date: Date,
    message: string,
    latitude: string,
    longitude: string
}