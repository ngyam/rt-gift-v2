
const blogAbiDefinition = '';
const blogBytecode = '0x6060604052341561000c57fe5b604051602080610168833981016040528080519060200190919050505b806000819055505b505b610126806100426000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806367e0badb146044578063cd16ecbf146067575bfe5b3415604b57fe5b60516084565b6040518082815260200191505060405180910390f35b3415606e57fe5b60826004808035906020019091905050608f565b005b600060005490505b90565b60006000549050816000819055506000546001026000191681600102600019163373ffffffffffffffffffffffffffffffffffffffff167f108fd0bf2253f6baf35f111ba80fb5369c2e004b88e36ac8486fcee0c87e61ce60405180905060405180910390a45b50505600a165627a7a72305820b86215323334042910c2707668d7cc3c3ec760d2f5962724042482293eba5f6b0029';
const blogAddress = '0x925d81c01d878899adbb7d38f84ce9d5284fa2e7';

window.addEventListener('load', function() {
    console.log("Shit runs");
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        console.log(web3);
        window.web3 = new Web3(web3.currentProvider);
        console.log('Web3 provider found!');
    } else {
        console.log(web3);
        console.log('Injected web3 was not found! Trying localhost..');
        window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
    }
    // Now you can start your app & access web3 freely:
    if(checkConnection()) {
        console.log(getActiveAcc());
        grabContracts();
    }
})

function checkConnection() {
    // Set the connect status on the app
    if (window.web3 && window.web3.isConnected()) {
        console.log("Connected");
        return true;
    }
    console.log('Connection to node could not be estabilished..');
    window.alert('Connection to a node could not be estabilished. Please setup metamask/mist or a local node at "http://localhost:8545 and reload the page."');
    return false;
}

function estimateGas(message) {
    
}

function post(message) {
    
}

function loadPosts() {
    
}

/**
 * Get the token balance of the currently active metamask account (0).
 */
async function getTokenBalance() {
    var account = getActiveAcc();
    var bal = await window.tokenContract.balanceOf(account).call({from: account});
    return window.web3.toDecimal(bal);
}

/**
 * Get the balances of the currently active metamask account (0).
 */
async function getETHBalance() {
    var account = getActiveAcc();
    var bal = await window.web3.eth.getBalance(account);
    console.log("Balance: " + account + ": " + window.web3.toDecimal(bal));
    return window.web3.toDecimal(bal);
}

function getActiveAcc() {
    return window.web3.eth.accounts[0];
}

function grabContracts() {
    window.blogContract = new web3.eth.Contract(blogAbiDefinition, blogAddress, {
        from: getActiveAcc(), // default from address
        gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    });
    window.tokenContract = new web3.eth.Contract(tokenAbiDefinition, tokenAddress, {
        from: getActiveAcc(), // default from address
        gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    });
}