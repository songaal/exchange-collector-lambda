var request = require("request");
var binance = require("./exchange/binance");
var queue = require("./queue");

var market = "binance";
// API 참고 https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#klinecandlestick-data
var API_URL = "https://api.binance.com/api/v1/klines";
var QUEUE_URL = process.env.QUEUE_URL;

exports.handler = (event, context, callback) => {
    var coin = event.coin;
    var base = event.base;
    var symbol = event.symbol;

    var options = {
        url: API_URL,
        qs: {
            symbol: symbol,
            interval: '1m',
            limit: 3
        }
    };

    request(options, function(error, response, body) {
        if (error) throw error;
        var kline = JSON.parse(body);
        var data = binance.getLatestOhlcv(kline);
        if (process.env.NODE_ENV == 'dev') {
            console.log(market, coin, base, data);
        }
        if(data) {
            queue.put(data.ohlcv, data.ts, market, coin, base, QUEUE_URL);
        }
    });
}
