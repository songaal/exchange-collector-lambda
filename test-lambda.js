const AWS = require('aws-sdk')
const lambda = new AWS.Lambda({
    region: 'ap-northeast-2'
});

testScheduler = function () {
    var module = require('./exchange-scheduler.js');
    event = {
        base: 'BTC',
        coin: 'ETH',
        symbol: 'ETH/BTC',
        exchange: 'bittrex'
    }
    module.handler({}, null);
}


testCollector = function () {
    console.log("testCollector")
    var module = require('./exchange-collector.js');
    event = {
        base: 'BNB',
        coin: 'LOOM',
        symbol: 'LOOM/BNB',
        exchange: 'binance'
    }
    module.handler(event, null);
}

testBulkLambda = function () {
    let functionName = 'exchange-bulk-collector'
    let attr = {
        exchange: 'binance',
        coin: 'BNB',
        base: 'BTC',
        symbol: 'BNB/BTC',
        since: 1491004800000,
        limit: 500
    }
    ret = lambda.invoke({
        FunctionName: functionName,
        Payload: JSON.stringify(attr)
    }, function (err, data) {
        if (err) console.log(attr.base, attr.coin, err, err.stack);
        else console.log(data)
    });

    console.log(ret)
}

testBulkLambda()
