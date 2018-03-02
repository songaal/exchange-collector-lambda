var AWS = require('aws-sdk');
var request = require('request');

var lambda = new AWS.Lambda({
    region: 'ap-northeast-2'
});

const url = 'https://api.binance.com/api/v1/exchangeInfo'

exports.handler = (event, context, callback) => {
    request(url, function(error, response, body) {
        if (error) throw error;
        let marketInfo = JSON.parse(body);
        if (marketInfo.symbols) {
            for (let market of marketInfo.symbols) {
                let attr = {
                    base: market.quoteAsset,
                    coin: market.baseAsset,
                    symbol: market.symbol
                };

                if (process.env.MODE != 'local') {
                    lambda.invoke({
                        FunctionName: 'binance-collector',
                        Payload: JSON.stringify(attr)
                    }, function(err, data) {
                        if (err) console.log("err: ", attr.base, attr.coin, err, data);
                    });
                } else {
                    //FOR TEST
                    var index = require("./binance-collector.js");
                    index.handler(attr, context);
                }
            }
        } else {
            throw new Error(marketInfo.message);
        }
    });
}
