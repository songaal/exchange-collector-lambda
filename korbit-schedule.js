var AWS = require('aws-sdk');

const base = "krw";
const coins = [
    'btc', 'bch', 'btg', 'eth', 'etc', 'xrp'
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

        lambda.invoke({
            FunctionName: 'korbit-collector',
            Payload: JSON.stringify(attr)
        }, function(err, data) {
            if (err) console.log("err: ", base, coin, err, data);
        });
        //FOR TEST
        // var index = require("./korbit-index.js");
        // index.handler(attr, context);
    }
}
