var request = require("request");
var coinone = require("./exchange/coinone");
var queue = require("./queue");

var market = "coinone";
var coin = "btc";
var base = "krw";

var API_URL = "https://api.coinone.co.kr/trades?currency=btc";

exports.handler = (event, context, callback) => {
    request(API_URL, function(error, response, body) {
        if (error) throw error;
        var orders = JSON.parse(body);
        var ohlcv = coinone.getLatestOhlcv(orders);
        console.log(ohlcv);
        if(ohlcv) {
            queue.put(ohlcv, market, coin, base);
        }
    });
}
