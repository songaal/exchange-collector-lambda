let AWS = require('aws-sdk');
let ccxt = require('ccxt');
let lambda = new AWS.Lambda({
    region: 'ap-northeast-2'
});
let S3 = new AWS.S3()
let exchange_ids = process.env.EXCHANGES
let bucket = process.env.BUCKET
let s3_prefix = 'static'
let s3_suffix = '-markets.json'

exports.handler = (event, context, callback) => {
    exchange_ids.split(',').forEach(exchange_id => {
      let objectKey = `${s3_prefix}/${exchange_id}${s3_suffix}`
      let exchange = new (ccxt)[exchange_id]()
      exchange.substituteCommonCurrencyCodes = false
      let promise = exchange.load_markets()
      promise.then(function (markets) {
        console.log('markets', markets)
          //1. 최신 market symbol 들을 s3 정적호스팅에 업데이트 해준다.
          S3.putObject({
              Bucket: bucket,
              Key: objectKey,
              Body: JSON.stringify(markets),
              ContentType: "application/json"
          }, function (resp) {
              console.log(`Successfully uploaded markets. => bucket:${bucket}, objectKey: ${objectKey}`);
          });
      }, function (err) {
          console.log(err);
      });
    })
}
