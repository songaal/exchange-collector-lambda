let Worker = require('./bulk-worker.js');
function run() {
    let since = 1525915800000
    let limit = 500
    let size = 4
    workers = new Array(size)
    coins = ['ETH', 'BNB', 'XRP', 'BCC']
    for (let i = 0; i < size; i++) {
        workers[i] = new Worker('exchange-bulk-collector', 'binance')
        workers[i].call(coins[i] + '/BTC', coins[i], 'BTC', since, limit)
    }
}

run()
