var request = require("request");
var coinone = require("./exchange/coinone");
var queue = require("./queue");

var market = "coinone";
var coins = ["btc","bch","eth","etc","xrp","qtum","ltc","iota","btg"];
var base = "krw";

var API_URL = "https://api.coinone.co.kr/trades?currency=%s";

exports.handler = (event, context, callback) => {
    const f = (coin) => {
        let url = API_URL.replace('%s', coin);
        request(url, function(error, response, body) {
            if (error) throw error;
            var orders = JSON.parse(body);
            var ohlcv = coinone.getLatestOhlcv(orders);
            //console.log('ohlcv',ohlcv);
            if(ohlcv) {
              queue.put(ohlcv, market, coin, base);
            }
        });
    }
    for(var i=0; i < coins.length; i++){
        f(coins[i]);
    }
}
