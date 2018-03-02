var request = require("request");
var bithumb = require("./exchange/bithumb");
var queue = require("./queue");

var market = "bithumb";
var coins = ["btc","eth","dash","ltc","etc","xrp","bch","xmr","zec","qtum","btg","eos"];
var base = "krw";

var API_URL = "https://api.bithumb.com/public/recent_transactions/%s?count=100";

exports.handler = (event, context, callback) => {
    const f = (coin) => {
        let url = API_URL.replace('%s', coin);
        request(url, function(error, response, body) {
            if (error) throw error;
            let data = body;
            var orders = JSON.parse(data);
            var ohlcv = bithumb.getLatestOhlcv(orders);
            console.log('ohlcv',ohlcv);
            if(ohlcv) {
              //queue.put(ohlcv, market, coin, base);
            }
        });
    }
    for(var i=0; i < coins.length; i++){
        f(coins[i]);
    }
}
