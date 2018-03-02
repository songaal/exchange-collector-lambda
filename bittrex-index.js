var request = require("request");
var bittrex = require("./exchange/bittrex");
var queue = require("./queue");

var market = "bittrex";
var API_URL = "https://bittrex.com/api/v1.1/public/getmarkethistory?market=";

exports.handler = (event, context, callback) => {

    var coin = event.coin.toUpperCase();
    var base = event.base.toUpperCase();
    var url = API_URL + coin + '-' + base;
    request(url, function(error, response, body) {
        if (error) throw error;
        var data   = body;
        var orders = JSON.parse(data);
        var ohlcv  = bittrex.getLatestOhlcv(orders);
        if (process.env.NODE_ENV == 'dev') {
            console.log(market, coin, base, ohlcv);
        }
        if(ohlcv) {
            queue.put(ohlcv, market, coin, base);
        }
    });
}
