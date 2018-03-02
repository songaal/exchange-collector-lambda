//var request = require("request");
//var korbit = require("./exchange/korbit");
//
//var API_URL = "https://bittrex.com/api/v1.1/public/getmarkets";
//
//exports.handler = (event, context, callback) => {
//    var options = {
//          url: API_URL,
//          qs: {  },
//          headers: { 'cache-control': 'no-cache' }
//    };
//    request(options, function(error, response, body) {
//        if (error) throw error;
//
//        var data = JSON.parse(body).result;
//        var baseList = '';
//        for(var i = 0; i < data.length; i++){
//            //ETHBTC
//            var base = data[i].MarketCurrency;
//            var coin = data[i].BaseCurrency;
//            var ss = data[i].MarketName;
//
//            baseList += ',"' + ss + '"';
//
//        }
//        console.log(baseList);
//    });
//}

exports.handler = (event, context, callback) => {
    var index = require("./binance-schedule.js");
    index.handler({}, context);

//    var index = require("./bithumb-schedule.js");
//    index.handler({}, context);
//
//    var index = require("./bittrex-schedule.js");
//    index.handler({}, context);
//
//    var index = require("./coinone-schedule.js");
//    index.handler({}, context);
//
//    var index = require("./korbit-schedule.js");
//    index.handler({}, context);
}
