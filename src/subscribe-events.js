const web3 = require('./web3')
const { abi, networks } = require("../build/contracts/Token.json")

const contract = new web3.eth.Contract(abi, networks[5777].address)

const subscribeLogEvent = (contract, eventName) => {
    try {
        const eventJsonInterface = web3.utils._.find(
            contract._jsonInterface,
            o => o.name === eventName && o.type === 'event',
        )

        const subscription = web3.eth.subscribe('logs', {
            address: contract.options.address,
            topics: [eventJsonInterface.signature]
        });

        subscription.on("data", async function(result) {
            const eventObj = await web3.eth.abi.decodeLog(
                eventJsonInterface.inputs,
                result.data,
                result.topics.slice(1)
            )
            console.log(`\nNew event [ ${eventName} ] \n`, eventObj)
        })

        subscription.on("error", function(error) {
            console.log(`Subscription Error! ${error}`)
        })

    } catch (error) {
        throw new Error(`Oops something wrong! ${error}`)
    }
}

const subscribePendingEvent = () => {
    try {

        subscription = web3.eth.subscribe('pendingTransactions', function(error, txHash) {
            if (!error) {
                console.log('\n=========================================================================')
                console.log(`\nPending Transaction ... \n [txHash] => ${txHash}`);
            } else {
                console.log(`Error! ${error}`)
            }
        })

    } catch (error) {
        throw new Error(`Oops something wrong! ${error}`)
    }
}

subscribeLogEvent(contract, 'Transfer')