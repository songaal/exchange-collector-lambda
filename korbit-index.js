var request = require("request");
var korbit = require("./exchange/korbit");
var queue = require("./queue");

var market = "korbit";
var API_URL = "https://api.korbit.co.kr/v1/transactions";

exports.handler = (event, context, callback) => {
    var coin = event.coin;
    var base = event.base;
    var options = {
          url: API_URL,
          qs: { 'currency_pair': (coin+ '_' +base) },
          headers: { 'cache-control': 'no-cache' }
    };
    request(options, function(error, response, body) {
        if (error) throw error;
        var data = body;
        var orders = JSON.parse(data);
        var ohlcv = korbit.getLatestOhlcv(orders);

        if (process.env.NODE_ENV == 'dev') {
            console.log(market, coin, base, ohlcv);
        }
        if(ohlcv) {
            queue.put(ohlcv.ohlcv, ohlcv.ts, market, coin, base);
        }
    });
}
