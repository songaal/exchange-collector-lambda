var AWS = require('aws-sdk');
var ccxt = require('ccxt');
var lambda = new AWS.Lambda({
    region: 'ap-northeast-2'
});
var S3 = new AWS.S3()
var excnhage = process.env.EXCHANGE.toLowerCase()
var bucket = process.env.BUCKET
var s3_prefix = 'static'
var s3_suffix = '-markets.json'

exports.handler = (event, context, callback) => {
  var exchange;
  var markets;
  (async () => {
      console.log('run exchange-scheduler. exchange:', excnhage)
      exchange = new (ccxt)[excnhage] ()
      markets = await exchange.load_markets ()
  })()
  if (exchange.has.fetchOHLCV == true){
    let objectKey = `${s3_prefix}/${excnhage}${s3_suffix}`
    S3.putObject({
        Bucket: bucket,
        Key: objectKey,
        Body: JSON.stringify(markets),
        ContentType: "application/json"
      },function (resp) {
        console.log(`Successfully uploaded markets. => bucket:${bucket}, objectKey: ${objectKey}`);
    });

    for (var key in markets) {
        market = markets[key]
        let attr = {
            base: market.info.quoteAsset,
            coin: market.info.baseAsset,
            symbol: market.info.symbol,
            exchange: exchange
        };
        let functionName = `${excnhage}-collector`
        console.log('excute lambda function ', functionName, ', attr:', attr)
        lambda.invoke({
            FunctionName: functionName,
            Payload: JSON.stringify(attr)
        }, function(err, data) {
            if (err) console.log("err: ", attr.base, attr.coin, err, data);
        });
    }
  }else {
    console.log('Unsupported exchange OHLCV')
  }
}
