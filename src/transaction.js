const web3 = require('./web3')
const Tx = require('ethereumjs-tx')
const { abi, networks } = require('../build/contracts/Token.json')

//==============================================Transfer Functions======================================================

const contract = new web3.eth.Contract(abi, networks[5777].address)

transfer = async(contract, fromAddress, toAddress, amount) => {
    await contract.methods.transfer(toAddress, amount)
        .send({ from: fromAddress, gas: 0 })
        .then(res => { console.log(res) })

    // get receiver balance after transfer
    contract.methods.balanceOf(toAddress).call(console.log)
}

getBalance = async(address) => {
    return await contract.methods.balanceOf(address).call()
}

// transfer ERC-20 token via 
transferToken = async(contract, contractAddress, fromAddress, toAddress, amount, privateKey) => {
    // console.log("from:", fromAddress)
    let count = await web3.eth.getTransactionCount(fromAddress);
    console.log(`count: ${count}`)

    let data = await contract.methods.transfer(toAddress, amount).encodeABI(); // data is a encoded data of transfer function
    // console.log(data)

    // let estimateGas
    // await web3.eth.estimateGas({ to: toAddress, data: data }).then((gas) => {
    //     estimateGas = gas
    // });
    // console.log("Gas:", estimateGas)

    let rawTransaction = {
        from: fromAddress,
        nonce: web3.utils.toHex(count),
        gasPrice: "100",
        gasLimit: "100",
        to: contractAddress,
        value: "0x0",
        data: data,
    };

    let privKey = new Buffer.from(privateKey, 'hex');
    let tx = new Tx(rawTransaction); // create new Tx object
    tx.sign(privKey); // sign tx using private key of sender
    let serializedTx = tx.serialize(); // change tx object to Json format 

    await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        if (!err) {
            // console.log("Transfer successfully!", hash);
            contract.methods.balanceOf(fromAddress).call().then(bal => {
                console.log(`Sender balance: [${bal}]`)
            })
            contract.methods.balanceOf(toAddress).call().then(bal => {
                    console.log(`Reciever balance: [${bal}]`)
                })
                // console.log("Sender balance:", contract.methods.balanceOf(fromAddress).call())
                // console.log("Reciever balance:", contract.methods.balanceOf(toAddress).call())
        } else {
            console.log(err);
        }
    }).on('receipt', (receipt) => {
        console.log(receipt) // print the detail of transaction
    })
}


(async() => {
    await getBalance("0x8a9e7cd9f1f894e7a0025531b93584ca3121546d").then(res => console.log(`Available: ${res} Token`))
    await getBalance("0xfa0485f6ed026eb3af9b2ab55c209da4d275fad5").then(res => console.log(`Available: ${res} Token`))
    await transfer(contract, "0x8a9e7cd9f1f894e7a0025531b93584ca3121546d", "0xfa0485f6ed026eb3af9b2ab55c209da4d275fad5", "5")
    await getBalance("0x8a9e7cd9f1f894e7a0025531b93584ca3121546d").then(res => console.log(`Available: ${res} Token`))
    await getBalance("0xfa0485f6ed026eb3af9b2ab55c209da4d275fad5").then(res => console.log(`Available: ${res} Token`))
})();