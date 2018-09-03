const ccxt = require('ccxt')
const axios = require('axios')
const endpoint = 'http://13.125.196.188:8086/query'
const apiConfig = { auth: { username: 'joonwoo', password: 'joonwoo1' } }
// ==========================================================
// 파라미터.
// 시작 : 00:00 부터
// 마지막: 최대 24:00 까지.
const exchange_id = 'binance'
const interval = '1m'
const startTime = new Date('2018-04-01 00:00').getTime()
const endTime = new Date('2018-05-01 24:00').getTime()
const coin = 'ETH'
const base = 'BTC'
// ==========================================================
const maxCount = ((endTime - startTime) / 60) / 1000

const getQuery = (startTime, endTime) => {
  return encodeURI(`SELECT count(*) FROM coin_v2.autogen.${exchange_id}_${coin}_${base} WHERE time >= ${startTime} AND time <= ${endTime}`)
}

const url = `${endpoint}?q=${getQuery(startTime, endTime)}`
axios.get(url, apiConfig).then((response) => {
  // 해당 기간에 데이터 조회하여 완전한 데이터 갯수가 있는지 확인한다.
  let mesurement = response.data.results[0]
  let result = {
    isFull: false,
    size: 0
  }
  if (mesurement.series !== undefined) {
    result['size'] = mesurement.series[0].values[0][1]
    result['isFull'] = maxCount === result['size']
  }
  console.log('목표 데이터 수: ', maxCount)
  console.log('보유 데이터 수: ', result['size'])
  return result
}).then((result) => {
  let blankDateList = []
  if (result['isFull']) {
    return blankDateList
  } else {
    let cur = new Date(startTime)
    while (cur.getTime() <= endTime) {
      console.log(cur)
      cur.setMinutes(cur.getMinutes() + 1)
    }
  }
  return blankDateList

}).then((blankTimeList) => {
  console.log(blankTimeList)
})
// cur.setDate(cur.getDate() + 1)
//

// let cur = new Date(startTime)
// const limit = ((endTime - startTime) / 60) / 1000
// const exchange = new ccxt[exchange_id]()
// let promise = exchange.fetchOHLCV(`${coin}/${base}`, interval, cur.getTime(), limit)
// promise.then((data) => {
//   console.log(data.length)
// })
