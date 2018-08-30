const AWS = require('aws-sdk')
const lambda = new AWS.Lambda({region: 'ap-northeast-2'})

testScheduler = function () {
    var module = require('./upbit-exchange-scheduler.js')
    module.handler({}, null);
}

testCollector = function () {
    var module = require('./upbit-exchange-collector.js')
    event = {
        base: 'KRW',
        coin: 'ONT',
        symbol: `ONT/KRW`,
        exchange: 'upbit'
    }
    module.handler(event, null);
}

testScheduler()

// testBulkLambda = function () {
//     let functionName = 'exchange-bulk-collector'
//     let attr = {
//         exchange: 'binance',
//         coin: 'BNB',
//         base: 'BTC',
//         symbol: 'BNB/BTC',
//         since: 1491004800000,
//         limit: 10
//     }
//     let ret = lambda.invoke({
//         FunctionName: functionName,
//         Payload: JSON.stringify(attr)
//     }, function (err, data) {
//         if (err) console.log(attr.base, attr.coin, err, err.stack);
//         else console.log('data>>', data)
//
//         if (data.StatusCode == 200) {
//             retSince = data.Payload
//             console.log('retSince>>', retSince)
//         }
//     });
// }
//
// let Worker = require('./bulk/bulk-worker.js');
// testBulkWorker = function () {
//     let since = 1525915800000
//     let limit = 500
//     let size = 4
//     workers = new Array(size)
//     coins = ['ETH','BNB', 'XRP', 'BCC']
//     for(let i=0;i<size;i++) {
//         workers[i] = new Worker('exchange-bulk-collector', 'binance')
//         workers[i].call(coins[i] + '/BTC', coins[i], 'BTC', since, limit)
//     }
// }
