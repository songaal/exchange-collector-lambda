var request = require("request");
var bittrex = require("./exchange/bittrex");
var queue = require("./queue");

var market = "bittrex";
var API_URL = "https://bittrex.com/api/v1.1/public/getmarkethistory";
var QUEUE_URL = process.env.QUEUE_URL;

exports.handler = (event, context, callback) => {
    var coin = event.coin;
    var base = event.base;
    var symbol = event.symbol;

    var options = {
        url: API_URL,
        qs: {
            'market': symbol
        }
    };

    request(options, function(error, response, body) {
        if (error) throw error;
        var orders = JSON.parse(body);
        console.log("orders > ", orders)
        var data = bittrex.getLatestOhlcv(orders);
        console.log("data > ", data)
        if (process.env.NODE_ENV == 'dev') {
            console.log(market, coin, base, data);
        }
        if (data) {
            queue.put(data.ohlcv, data.ts, market, coin, base, QUEUE_URL);
        }
    });
}
