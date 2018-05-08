/*jshint esversion: 6 */
var request = require("request");
var ccxt = require('ccxt');
var queue = require("./queue");
var QUEUE_URL = process.env.QUEUE_URL;
let limit = 10
let since = 1491004800000
exports.handler = (event, context, callback) => {

    (async () => {
        let exchange_id = event.exchange
        let exchange = new (ccxt)[exchange_id] ()
        let markets = await exchange.loadMarkets ()
        //console.log(markets)
        let i = 1
        for (var symbol in markets) {
            market = markets[symbol]

            let base = market.info.quoteAsset
            let coin = market.info.baseAsset
            let k = 1
            console.log(i, k, symbol)
            while(true) {
                dataList = await exchange.fetchOHLCV (symbol, '1m', since, limit)
                if (process.env.NODE_ENV == 'dev') {
                    console.log(exchange_id, coin, base, symbol, dataList);
                }
                for (let m =0; m < dataList.length; m++) {
                    data = dataList[m]
                    let ts = data[0]
                    let ohlcv = {
                        "o": data[1],
                        "h": data[2],
                        "l": data[3],
                        "c": data[4],
                        "v": data[5]
                    }
                    //queue.put(ohlcv, ts, market, coin, base, QUEUE_URL);
                    //TODO 마지막 시간을 확인하고 다음 루프의 since 시간으로 셋팅한다.
                    // console.log(ohlcv, ts, market, coin, base, QUEUE_URL);
                    console.log(ts, coin, base, since, ohlcv);
                }

                await new Promise(x => setTimeout(x, 1000))
                k++
            }
            console.log('--------------------------')
            i++
        }
    }) ()
}
