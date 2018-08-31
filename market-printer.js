const axios = require('axios')
const fs = require('fs')
const upbitMarketUrl = 'https://api.upbit.com/v1/market/all'
const exchange = 'upbit'
// mesurement 데이터 삭제 쿼리 생성기.
axios.get(upbitMarketUrl).then((response) => {
  let markets = response.data
  markets.forEach((market) => {
    let coin = market.market.split('-')[1]
    let base = market.market.split('-')[0]
    let q = 'curl http://13.125.196.188:8086/query -u joonwoo:joonwoo1'
    q += ` -d q='DROP MEASUREMENT ${exchange}_${coin.toLowerCase()}_${base.toLowerCase()}'`
    q += ' -d db=coin_v2'
    //curl http://13.125.196.188:8086/query -u joonwoo:joonwoo1 -d q='DROP MEASUREMENT upbit_btc_krw' -d db=coin_v2
    console.log(q)
  })
})
