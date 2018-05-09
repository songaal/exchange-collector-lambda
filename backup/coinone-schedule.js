var AWS = require('aws-sdk');

const base = "krw";
const coins = [
    "btc",
    "bch",
    "eth",
    "etc",
    "xrp",
    "qtum",
    "ltc",
    "iota",
    "btg"
];

var lambda = new AWS.Lambda({
  region: 'ap-northeast-2'
});

exports.handler = (event, context, callback) => {
    for (let coin of coins) {
        let attr = {
            base: base,
            coin: coin
        };

        if (process.env.MODE != 'local') {
            lambda.invoke({
                FunctionName: 'coinone-collector',
                Payload: JSON.stringify(attr) // pass params
            }, function(err, data){
                if(err) console.log("err: ", base, coin, err, data);
            });
        } else {
            //FOR TEST
            var index = require("./coinone-collector.js");
            index.handler(attr, context);
        }
    }
}
