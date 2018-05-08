// var lambda = require('./exchange-scheduler.js');
//
// event = {
//         "exchange": "binance",
//         "key2": "value2",
//         "key3": "value3",
//         "key4": "value4"
//     }

var lambda = require('./exchange-collector.js');
event = { base: 'BTC',
  coin: 'ETH',
  symbol: 'ETH/BTC',
  exchange: 'binance' }
lambda.handler(event, null);
