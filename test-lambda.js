testCollector = function() {
    var lambda = require('./exchange-scheduler.js');
    event = { base: 'BTC',
      coin: 'ETH',
      symbol: 'ETH/BTC',
      exchange: 'bittrex' }
    lambda.handler({}, null);
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

testCollector()
