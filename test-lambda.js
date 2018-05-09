testScheduler = function () {
    var lambda = require('./exchange-scheduler.js');
    event = {
        base: 'BTC',
        coin: 'ETH',
        symbol: 'ETH/BTC',
        exchange: 'bittrex'
    }
    lambda.handler({}, null);
}


testCollector = function () {
    console.log("testCollector")
    var lambda = require('./exchange-collector.js');
    event = {
        base: 'BNB',
        coin: 'LOOM',
        symbol: 'LOOM/BNB',
        exchange: 'binance'
    }
    lambda.handler(event, null);
}

testCollector()
