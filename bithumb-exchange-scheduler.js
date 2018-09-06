let AWS = require('aws-sdk')
let ccxt = require('ccxt')
let lambda = new AWS.Lambda({region: 'ap-northeast-2'})
let S3 = new AWS.S3()
let exchange_id = 'bithumb'
let bucket = process.env.BUCKET
let functionName = process.env.FUNCTION_NAME
let s3_prefix = 'static'
let s3_suffix = '-markets.json'
let objectKey = `${s3_prefix}/${exchange_id}${s3_suffix}`

/*
빗썸은 캔들데이터 API 지원 안함.
*/

exports.handler = (event, context, callback) => {
  let exchange = new (ccxt)[exchange_id]()
  let promise = exchange.load_markets()
  promise.then(function (markets) {
    //1. 최신 market symbol 들을 s3 정적호스팅에 업데이트 해준다.
    S3.putObject({
      Bucket: bucket,
      Key: objectKey,
      Body: JSON.stringify(markets),
      ContentType: "application/json"
    }, function (resp) {
      console.log(`Successfully uploaded markets. => bucket:${bucket}, objectKey: ${objectKey}`);
    })
    //2.심볼별 collector 호출
    for (let symbol in markets) {
      market = markets[symbol]
      let attr = {
        base: market.quote,
        coin: market.base,
        symbol: market.symbol,
        exchange: exchange_id
      }
      console.log('call lambda function ', functionName, ', attr:', attr)
      if (process.env.DRY_RUN != 'true') {
        lambda.invoke({
          FunctionName: functionName,
          Payload: JSON.stringify(attr)
        }, function (err, data) {
          if (err) console.log(attr.base, attr.coin, err, err.stack);
        })
      }
    }
  })
}
