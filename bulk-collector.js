var request = require("request");
var ccxt = require('ccxt');
var queue = require("./queue");
var QUEUE_URL = process.env.QUEUE_URL;
let limit = 10
let since = 1491004800000 // 2017.4.1
exchange_id = process.env.EXCHANGE;

(async () => {
    let exchange = new (ccxt)[exchange_id] ()
    let markets = await exchange.loadMarkets ()
    let i = 1
    for (let symbol in markets) {
        market = markets[symbol]
        let base = market.info.quoteAsset
        let coin = market.info.baseAsset
        let k = 1
        console.log(i, k, exchange_id, symbol)
        while(true) {
            console.log(since, symbol, k);
            dataList = await exchange.fetchOHLCV (symbol, '1m', since, limit)
            size = dataList.length
            if(size == 0){
                console.log('No more data since ', since)
                break;
            }
            if (process.env.DRY_RUN != 'true') {
                queue.bulk_put(dataList, exchange_id, coin, base, QUEUE_URL);
            }

            await new Promise(x => setTimeout(x, 1000))
            lastData = dataList[size - 1]
            // 마지막 시간을 확인하고 다음 루프의 since 시간으로 셋팅한다.
            since = lastData[0]
            k++
        }
        console.log('--------------------------')
        i++
    }
}) ()
