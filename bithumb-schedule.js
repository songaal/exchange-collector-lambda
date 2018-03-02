var AWS = require('aws-sdk');

let base = "krw";
let coins = ["BTC", "ETH", "DASH", "LTC", "ETC", "XRP", "BCH", "XMR", "ZEC", "QTUM", "BTG", "EOS"];

var lambda = new AWS.Lambda({
  region: 'ap-northeast-2'
});

exports.handler = (event, context, callback) => {
    for (let coin of coins) {
        console.log(coin);
        let attr = {
            base: base,
            coin: coin
        };

        lambda.invoke({
            FunctionName: 'bithumb-collector',
            Payload: JSON.stringify(attr, null, 0) // pass params
        }, function(err, data){
            if(err) console.log("err: ", base, coin, err, data);
        });
        //FOR TEST
//         var index = require("./bithumb-index.js");
//         index.handler(attr, context);
    }
}
