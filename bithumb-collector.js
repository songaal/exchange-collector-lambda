var request = require("request");
var bithumb = require("./exchange/bithumb");
var queue = require("./queue");

var market = "bithumb";
var API_URL = "https://api.bithumb.com/public/recent_transactions/%s?count=100";

exports.handler = (event, context, callback) => {
    var coin = event.coin;
    var base = event.base;
    var url = API_URL.replace('%s', coin);
    request(url, function(error, response, body) {
        if (error) throw error;
        var orders = JSON.parse(body);
        var ohlcv = bithumb.getLatestOhlcv(orders);
        if (process.env.NODE_ENV == 'dev') {
            console.log(market, coin, base, data);
        }
        if (data) {
            queue.put(data.ohlcv, data.ts, market, coin, base);
        }
    });
}
