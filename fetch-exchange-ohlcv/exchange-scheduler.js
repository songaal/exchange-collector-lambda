var AWS = require('aws-sdk');
var ccxt = require('ccxt');

var lambda = new AWS.Lambda({
    region: 'ap-northeast-2'
});

exports.handler = (event, context, callback) => {

  ccxt.exchanges.forEach (id => {
    // console.log('exchange id:', id)
    (async () => {
        let exchange_id = id
        let exchange = new (ccxt)[exchange_id] ()
        let markets = await exchange.load_markets ()
        for (var key in markets) {
            market = markets[key]
            // console.log(market)
            // console.log('-------------------')
            let attr = {
                base: market.info.quoteAsset,
                coin: market.info.baseAsset,
                symbol: market.symbol,
                exchange: exchange_id
            };

            lambda.invoke({
                FunctionName: 'exchange-collector',
                Payload: JSON.stringify(attr)
            }, function(err, data) {
                if (err) console.log("err: ", attr.base, attr.coin, err, data);
            });
        }
    })()
  })
}
