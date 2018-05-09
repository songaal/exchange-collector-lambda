var AWS = require('aws-sdk');
var request = require('request');
var S3 = new AWS.S3();
var lambda = new AWS.Lambda({
    region: 'ap-northeast-2'
});
var s3 = new AWS.S3();

const exchangeName = "binance"
const url = 'https://api.binance.com/api/v1/exchangeInfo'

exports.handler = (event, context, callback) => {
    request(url, function(error, response, body) {
        if (error) throw error;

        // put json to s3 file
        var base64data = new Buffer(body, 'binary');
        s3.client.putObject({
            Bucket: 'coinview.gncloud.io',
            Key: 'static/binance-markets.json',
            Body: base64data,
            ACL: 'public-read'
          },function (resp) {
            console.log(arguments);
            console.log('Successfully uploaded package.');
        });


        let marketInfo = JSON.parse(body);
        if (marketInfo.symbols) {
          console.log('symbol size:', marketInfo.symbols.length)
            for (let market of marketInfo.symbols) {
                let attr = {
                    base: market.quoteAsset,
                    coin: market.baseAsset,
                    symbol: market.symbol
                };

                if (process.env.NODE_ENV == 'dev') {
                    console.log(attr);
                }
                if (process.env.MODE != 'local') {
                    lambda.invoke({
                        FunctionName: exchangeName + '-collector',
                        Payload: JSON.stringify(attr)
                    }, function(err, data) {
                        if (err) console.log("err: ", attr.base, attr.coin, err, data);
                    });
                } else {
                    //FOR TEST
                    var index = require("./" + exchangeName + "-collector.js");
                    index.handler(attr, context);
                }
            }

            let bucketName = process.env.BUCKET_NAME
            let key = 'static/' + exchangeName + '-markets.json'
            let body = JSON.stringify(marketInfo)
            S3.putObject({
              Bucket: bucketName,
              Key: key,
              ContentType: 'text/plain',
              Body: body,
            }, (err, data)=> {
              if (err)
                console.log('save error', err)
              console.log('save success')
            });
        } else {
            throw new Error(marketInfo.message);
        }
    });
}
