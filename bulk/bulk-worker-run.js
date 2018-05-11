let since = 1525915800000
let limit = 500

let Worker = require('./bulk-worker.js');
let seq = process.argv[2]
let symbol = process.argv[3]
let worker = new Worker(seq, 'exchange-bulk-collector', 'binance')
const tmp = symbol.split("/")
const coin = tmp[0]
const base = tmp[1]
worker.call(symbol, coin, base, since, limit)
    .then(function(data){
         console.log(data);
        }, function (err) {
         console.log(attr.base, attr.coin, err, err.stack);
    })