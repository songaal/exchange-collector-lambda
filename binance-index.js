var request = require("request");
var binance = require("./exchange/binance");
var queue = require("./queue");

var market = "binance";
var API_URL = "https://api.binance.com/api/v1/exchangeInfo";

// 일단 패스...

exports.handler = (event, context, callback) => {
    request(API_URL, function(error, response, body) {
        if (error) throw error;
        var orders = JSON.parse(body);
        var ohlcv = binance.getLatestOhlcv(orders);
        //console.log('ohlcv',ohlcv);
        if(ohlcv) {
            //queue.put(ohlcv, market, coin, base);
        }
    });
}

