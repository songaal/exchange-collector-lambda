const axios = require('axios')
const ccxt = require('ccxt')

const exchangeId = 'bithumb'

if (exchangeId === 'upbit') {
  const upbitMarketUrl = 'https://api.upbit.com/v1/market/all'
  // mesurement 데이터 삭제 쿼리 생성기.
  axios.get(upbitMarketUrl).then((response) => {
    let markets = response.data
    markets.forEach((market) => {
      let coin = market.market.split('-')[1]
      let base = market.market.split('-')[0]
      let q = 'curl http://13.125.196.188:8086/query -u joonwoo:joonwoo1'
      q += ` -d q='DROP MEASUREMENT ${exchangeId}_${coin.toLowerCase()}_${base.toLowerCase()}'`
      q += ' -d db=coin_v2'
      //curl http://13.125.196.188:8086/query -u joonwoo:joonwoo1 -d q='DROP MEASUREMENT upbit_btc_krw' -d db=coin_v2
      console.log(q)
    })
  })
} else if (exchangeId === 'bithumb') {
  let exchange = new ccxt[exchangeId]()
  exchange.substituteCommonCurrencyCodes = false
  let promise = exchange.load_markets()
  promise.then(function (markets) {
    Object.keys(markets).forEach((symbolKey) => {
      let coin = symbolKey.split('/')[0]
      let base = symbolKey.split('/')[1]
      let q = 'curl http://13.125.196.188:8086/query -u joonwoo:joonwoo1'
      q += ` -d q='DROP MEASUREMENT ${exchangeId}_${coin.toLowerCase()}_${base.toLowerCase()}'`
      q += ' -d db=coin_v2'
      //curl http://13.125.196.188:8086/query -u joonwoo:joonwoo1 -d q='DROP MEASUREMENT upbit_btc_krw' -d db=coin_v2
      console.log(q)
    })
  })
}
