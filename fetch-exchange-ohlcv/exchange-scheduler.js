var AWS = require('aws-sdk');
var ccxt = require('ccxt');

var lambda = new AWS.Lambda({
    region: 'ap-northeast-2'
});

exports.handler = (event, context, callback) => {
  (async () => {
      let exchange_id = process.env.EXCHANGE
      let exchange = new (ccxt)[exchange_id] ()
      let markets = await exchange.load_markets ()
      // 거래소의 하나의 심볼을 추출하여 1분봉 조회 테스트
      checkSymbol = Object.keys(markets)[0]
      console.log('exchange check 1m >> exchange: ', exchange_id, ', symbol: ', checkSymbol)
      exchange.fetchOHLCV (checkSymbol, '1m')
      
      for (var key in markets) {
          market = markets[key]
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
}
