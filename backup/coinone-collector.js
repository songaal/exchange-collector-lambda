var request = require("request");
var coinone = require("./exchange/coinone");
var queue = require("./queue");

var market = "coinone";
var API_URL = "https://api.coinone.co.kr/trades?currency=";
var QUEUE_URL = process.env.QUEUE_URL;

exports.handler = (event, context, callback) => {
    var coin = event.coin;
    var base = event.base;
    var url = API_URL + coin;
    request(url, function(error, response, body) {
        if (error) throw error;
        var orders = JSON.parse(body);
        var data = coinone.getLatestOhlcv(orders);
        if (process.env.NODE_ENV == 'dev') {
            console.log(market, coin, base, data);
        }
        if (data) {
            queue.put(data.ohlcv, data.ts, market, coin, base, QUEUE_URL);
        }
    });
}
