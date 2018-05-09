let AWS = require('aws-sdk');
let ccxt = require('ccxt');
let lambda = new AWS.Lambda({
    region: 'ap-northeast-2'
});
let S3 = new AWS.S3()
let exchange_id = process.env.EXCHANGE.toLowerCase()
let bucket = process.env.BUCKET
let s3_prefix = 'static'
let s3_suffix = '-markets.json'
let objectKey = `${s3_prefix}/${exchange_id}${s3_suffix}`

exports.handler = (event, context, callback) => {
    var exchange;
    var markets;
    (async () => {
        console.log('run exchange-scheduler. exchange:', exchange_id)
        exchange = new (ccxt)[exchange_id]()
        markets = await exchange.load_markets()
    })()

    //1. 최신 market symbol 들을 s3 정적호스팅에 업데이트 해준다.
    S3.putObject({
        Bucket: bucket,
        Key: objectKey,
        Body: JSON.stringify(markets),
        ContentType: "application/json"
    }, function (resp) {
        console.log(`Successfully uploaded markets. => bucket:${bucket}, objectKey: ${objectKey}`);
    });

    //2. 캔들정보 함수가 있다면
    if (exchange.has.fetchOHLCV == true) {
        for (let symbol in markets) {
            market = markets[symbol]
            let attr = {
                base: market.info.quoteAsset,
                coin: market.info.baseAsset,
                symbol: market.symbol,
                exchange: exchange_id
            };
            let functionName = `exchange-collector`
            console.log('call lambda function ', functionName, ', attr:', attr)
            lambda.invoke({
                FunctionName: functionName,
                Payload: JSON.stringify(attr)
            }, function (err, data) {
                if (err) console.log(attr.base, attr.coin, err, err.stack);
            });
        }
    } else {
        console.log(exchange_id, 'exchange not support candle api.')
    }
}
