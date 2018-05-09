testCollector = function() {
    var lambda = require('./exchange-collector.js');
    event = { base: 'BTC',
      coin: 'ETH',
      symbol: 'ETH/BTC',
      exchange: 'binance' }
    lambda.handler(event, null);
}


testBinance = function() {
    console.log("testBinance")
    var lambda = require('./binance-collector.js');
    event = {
            "coin": "ETH",
            "base": "BTC",
            "symbol": "ETHBTC"
        }
    lambda.handler(event, null);
}

testScduler = function() {
    "cmd: EXCHANGE=bithumb node lambda.js "
    console.log("testScduler")
    var lambda = require('./exchange-scheduler.js');
    event = {}
    lambda.handler({}, null);
}

testScduler()
