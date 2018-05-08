testCollector = function() {
    var lambda = require('./bulk-collector.js');
    event = {
        "exchange": "binance",
        "key2": "value2",
        "key3": "value3",
        "key4": "value4"
    }
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

testCollector()
