var AWS = require('aws-sdk');
var request = require('request');

var lambda = new AWS.Lambda({
  region: 'ap-northeast-2'
});

const url = 'https://bittrex.com/api/v1.1/public/getmarkets';

exports.handler = (event, context, callback) => {
    request(url, function(error, response, body) {
        if (error) throw error;
        let marketInfo = JSON.parse(body);
        if(marketInfo.success) {
            for( let market of marketInfo.result) {
                let attr = {
                    base: market.BaseCurrency,
                    coin: market.MarketCurrency,
                    symbol: market.MarketName
                };
                lambda.invoke({
                    FunctionName: 'bittrex-collector',
                    Payload: JSON.stringify(attr)
                }, function(err, data){
                    if(err) console.log("err: ", base, coin, err, data);
                });
                //FOR TEST
                // var index = require("./bittrex-index.js");
                // index.handler(attr, context);

            }
        } else {
            throw new Error(marketInfo.message);
        }
    });
}
