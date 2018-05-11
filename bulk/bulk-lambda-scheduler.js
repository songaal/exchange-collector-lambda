let ccxt = require('ccxt');
let Worker = require('./bulk-worker.js');

let since = 1525915800000
let limit = 500
let workerSize = 4
let exchange_id = 'binance'

function run() {
    let exchange = new (ccxt)[exchange_id]()
    let promise = exchange.load_markets()
    promise.then(function (markets) {
        const symbolQueue = Object.keys(markets)
        console.log('totalSize=', symbolQueue.length)
        for (let i = 0; i < workerSize; i++) {
            let worker = new Worker(i, 'exchange-bulk-collector', 'binance')
            worker.callQueue(symbolQueue, since, limit)
        }
    }, function (err) {
        console.log(err);
    })
}

function run_symbols(argv) {
    console.log()
    symbols = argv[2]
    const symbolQueue = symbols.split(',')
    console.log('totalSize=', symbolQueue.length, symbolQueue)
    for (let i = 0; i < workerSize; i++) {
        let worker = new Worker(i, 'exchange-bulk-collector', 'binance')
        worker.callQueue(symbolQueue, since, limit)
    }
}

// run()
run_symbols(process.argv)
