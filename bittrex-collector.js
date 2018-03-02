var request = require("request");
var bittrex = require("./exchange/bittrex");
var queue = require("./queue");

var market = "bittrex";
var API_URL = "https://bittrex.com/api/v1.1/public/getmarkethistory?market=";
var QUEUE_URL = process.env.QUEUE_URL;

exports.handler = (event, context, callback) => {
    var coin = event.coin.toUpperCase();
    var base = event.base.toUpperCase();
    var url = API_URL + coin + '-' + base;
    request(url, function(error, response, body) {
        if (error) throw error;
        var orders = JSON.parse(body);
        var data = bittrex.getLatestOhlcv(orders);
        if (process.env.NODE_ENV == 'dev') {
            console.log(market, coin, base, data);
        }
        if (data) {
            queue.put(data.ohlcv, data.ts, market, coin, base, QUEUE_URL);
        }
    });
}
