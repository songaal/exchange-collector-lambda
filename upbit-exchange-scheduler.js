let AWS = require('aws-sdk')
let axios = require('axios')
let lambda = new AWS.Lambda({region: 'ap-northeast-2'})
let S3 = new AWS.S3()
let exchange_id = 'upbit'
let s3_prefix = 'static'
let s3_suffix = '-markets.json'
let objectKey = `${s3_prefix}/${exchange_id}${s3_suffix}`

let bucket = process.env.BUCKET
let functionName = process.env.FUNCTION_NAME
let marketUrl = process.env.MARKET_URL

exports.handler = (event, context, callback) => {
  axios.get(marketUrl).then((response) => {
    let markets = response.data
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
    for (var i = 0; i < markets.length; i++) {
      let market = markets[i]
      let coin = market['market'].split('-')[1]
      let base = market['market'].split('-')[0]
      let attr = {
        base: base,
        coin: coin,
        symbol: `${coin}/${base}`,
        exchange: exchange_id
      }
      console.log('call lambda function ', functionName, ', attr:', attr)
      lambda.invoke({
        FunctionName: functionName,
        Payload: JSON.stringify(attr)
      }, function (err, data) {
        if (err) console.log(attr.base, attr.coin, err, err.stack);
      })
    }
  })
}
