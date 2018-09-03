const axios = require('axios')
const endpoint = 'http://13.125.196.188:8086/query?'
const config = { auth: { username: 'joonwoo', password: 'joonwoo1' } }
const fs = require('fs')

const exchangeId = 'binance'
const interval = '1m'
const startTime = new Date('2018-04-01 00:00').getTime()
const endTime = new Date('2018-05-01 24:00').getTime()
const coin = 'ETH'
const base = 'BTC'

const sleep = (delay) => {
   var start = new Date().getTime()
   while (new Date().getTime() < start + delay);
}
const delay = () => {
  return new Promise(resolve => setTimeout(resolve, 300))
}

const getMeasurementsList = () => {
  const url = endpoint + encodeURI(`q=SHOW MEASUREMENTS ON coin_v2`)
  return axios.get(url, config).then((response) => {
    let result = response.data['results'][0]
    let measurements = result['series'][0]['values'].filter((o, i) => {
      return o[0].startsWith(exchangeId)
    })
    return measurements
    // return [['binance_xrp_btc']]
  })
}

const getStartTime = (measurement) => {
  const url = endpoint + encodeURI(`q=SELECT volume FROM "coin_v2"."autogen"."${measurement}" WHERE time > 0 limit 1`)
  return axios.get(url, config).then((response) => {
    let measurements = response.data['results'][0]
    return measurements['series'][0]['values'][0]
  })
}

const getDaily = (measurement, startTime) => {
  const url = endpoint + encodeURI(`q=SELECT mean("close") AS "mean_close", mean("high") AS "mean_high", mean("low") AS "mean_low", mean("open") AS "mean_open", mean("volume") AS "mean_volume" FROM "coin_v2"."autogen"."${measurement}"GROUP BY time(1d) FILL(null)`)
  return axios.get(url, config).then((response) => {
    let measurements = response.data['results'][0]
    return measurements['series'][0]['values']
  })
}

const getBlankDate = (dataList) => {
  let blankDateList = []
  dataList.forEach((data, index) => {
    let time = data[0]
    let open = data[1]
    let high = data[2]
    let low = data[3]
    let close = data[4]
    let volume = data[5]
    // console.log(time, open, high, low, close, volume)
    if (open == null || high == null || low == null || close == null || volume == null) {
      let blankDate = new Date(time)
      blankDateList.push({
        timestamp: blankDate.getTime(),
        date: blankDate
      })
    }
  })
  return blankDateList
}


getMeasurementsList()
  .then((measurements) => {
    let target = []
    measurements.forEach((measurementArr, index) => {
      let measurement = measurementArr[0]
      console.log('measurement:', measurement)

      getStartTime(measurement).then((startTimeArr) => {
        let startTime = startTimeArr[0]
        console.log('startTime:', startTime)
        return {
          measurement: measurement,
          startTime: new Date(startTime).getTime()
        }
      }).then((data) => {

        let measurement = data['measurement']
        let startTime = data['startTime']
        getDaily(measurement, startTime).then((dataList) => {
          let blankDateList = getBlankDate(dataList)
          if (blankDateList.length > 0) {
            fs.writeFile(`blank/${measurement}.txt`, JSON.stringify(blankDateList), 'utf8', (error) => {
              console.log('write end. measurement: ', measurement, 'startTime:', startTime,' data size:', dataList.length, 'blank size:', blankDateList.length)
            })
          }

        }).catch((e) => {
          console.log('[fail] select data. measurement:', mesurment, 'startTime:', startTime)
        })
      }).catch((e) => {
        console.log('[fail] select startTime. measurement:', mesurment)
      })

      // sleep(5000)
    })
  })
  .catch((e) => {
    console.log('[fail] select measurement', e)
  })
