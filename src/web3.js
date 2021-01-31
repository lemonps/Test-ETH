const Web3 = require('web3')

const HTTP_ENDPOINT = "http://localhost:9545"
const WS_ENDPOINT = process.env.WS_ENDPOINT

//const web3 = new Web3(new Web3.providers.HttpProvider(HTTP_ENDPOINT))
const web3 = new Web3(new Web3.providers.WebsocketProvider(HTTP_ENDPOINT))

module.exports = web3