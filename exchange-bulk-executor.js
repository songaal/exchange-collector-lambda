let AWS = require('aws-sdk')
let lambda = new AWS.Lambda({region: 'ap-northeast-2'})
const axios = require('axios')
const endpoint = 'http://13.125.196.188:8086/query?'
const config = { auth: { username: 'joonwoo', password: 'joonwoo1' } }
const fs = require('fs')
const collector = require('./exchange-bulk-collector')

// const exchangeId = process.env.EXCHANGE
// const addMinute = process.env.ADD_MINUTE
// const functionName = process.env.FUNCTION_NAME
//'exchange-bulk-collector'

const exchangeId = 'binance' //거래소
const addMinute = 5      // 공백 앞뒤로 추가 캔들(분단위)
const functionName = 'exchange-bulk-collector'
const isFileWrite = true
const fileName = `blank/symbols.txt`
const isDryRun = false
const symbolsFile = 'binance-symbols.json'
let totalBlankDateList = []
exports.handler = (event, context, callback) => {

  if (isFileWrite !== undefined && isFileWrite == true) {
    fs.exists(fileName, (exists) => {
      if (exists) {
        fs.unlink(fileName)
        console.log('remove file:' + fileName)
      }
    })
  }

  getMeasurementsList()
    .then((measurements) => {
      let target = []

      let symbols = JSON.parse(fs.readFileSync(symbolsFile, 'utf8'))
      let tmpMeasurements = []
      measurements.forEach((measurementArr, index) => {

        let measurement = measurementArr[0]
        let target = measurement.split('_')[1].toUpperCase() + '/' + measurement.split('_')[2].toUpperCase()

        Object.keys(symbols).forEach((symbol, index) => {
          if (symbols[symbol]['active'] == true && target == symbol) {
            tmpMeasurements.push(measurementArr)
          }
        })
      })

      tmpMeasurements.forEach((measurementArr, index) => {
        let measurement = measurementArr[0]

        getStartTime(measurement).then((startTimeArr) => {
          let startTime = startTimeArr[0]
          console.log('measurement: ', measurement, ', startTime:', startTime)
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
              if (isFileWrite !== undefined && isFileWrite == true) {
                let writeData = {
                  measurement: measurement,
                  dateList: blankDateList
                }
                totalBlankDateList.push(writeData)
                fs.writeFile(fileName, JSON.stringify(totalBlankDateList), 'utf8', (error) => {
                  console.log('write end. measurement: ', measurement, 'data size:', dataList.length, 'blank size:', blankDateList.length)
                })
              }

              blankDateList.forEach((blankDate) => {
                runCollector(measurement, blankDate)
              })
            }
          }).catch((e) => {
            console.log('[fail] select data. measurement:', measurement, 'startTime:', startTime)
          })
        }).catch((e) => {
          console.log('[fail] select startTime. measurement:', mesurment)
        })
      })
    })
    .catch((e) => {
      console.log('[fail] select measurement', e)
    })
}
const sleep = (delay) => {
   var start = new Date().getTime()
   while (new Date().getTime() < start + delay);
}

const getMeasurementsList = () => {
  const url = endpoint + encodeURI(`q=SHOW MEASUREMENTS ON coin_v2`)
  return axios.get(url, config).then((response) => {
    let result = response.data['results'][0]
    let measurements = result['series'][0]['values'].filter((o, i) => {
      return o[0].startsWith(exchangeId)
    })
    // return [['binance_xrp_btc']]
    return measurements
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

const getTotalCount = (from, to) => {
  let current = new Date(from)
  let last = new Date(to)
  let count = 0
  while (current.getTime() <= last.getTime()) {
    current.setMinutes(current.getMinutes() + 1)
    count += 1
  }
  return count
}

const dateSplit = (from, to, limit) => {
  let current = new Date(from)
  let last = new Date(to)
  let totalCount = 0
  let count = 0
  let dateList = []
  let tmpStartTime = null

  while (current.getTime() <= last.getTime()) {
    if (tmpStartTime == null) {
      tmpStartTime = new Date(current.getTime())
      tmpStartTime.setMinutes(tmpStartTime.getMinutes() - addMinute)
      tmpStartTime = tmpStartTime.getTime()
    }
    if ((count + addMinute) % limit == 0) {
      dateList.push({
        since: tmpStartTime,
        limit: (count + addMinute)
      })
      count = 0
      tmpStartTime = null
    }
    current.setMinutes(current.getMinutes() + 1)
    count += 1
    totalCount += 1
  }
  if (count > 0) {
    dateList.push({
      since: tmpStartTime,
      limit: (count + addMinute)
    })
  }
  return dateList
}
var t = 0
const runCollector = (measurement, blankDate) => {
  let exchange = measurement.split('_')[0].toLowerCase()
  let coin = measurement.split('_')[1].toUpperCase()
  let base = measurement.split('_')[2].toUpperCase()
  let from = blankDate['from']
  let to = blankDate['to']

  let totalCount = getTotalCount(from, to)
  t += totalCount
  dateList = dateSplit(from, to, 1000)
  dateList.forEach((date) => {
    let attr = {
      exchange: exchange,
      coin: coin,
      base: base,
      symbol: `${coin}/${base}`,
      since: date['since'],
      limit: date['limit'],
      totalCount: totalCount
    }
    if (isDryRun != true) {
      if (functionName !== undefined && functionName !== null) {
        console.log('call lambda function ', functionName, ', attr:', attr)
        lambda.invoke({
          FunctionName: functionName,
          Payload: JSON.stringify(attr)
        }, function (err, data) {
          if (err) console.log(attr.base, attr.coin, err, err.stack);
        })
      } else {
        console.log('call local mode, attr:', attr)
        collector.handler(attr)
      }
    }
    // sleep(500)
  })
  console.log('총 입력해야될 데이터 수:', t)
}

const getBlankDate = (dataList) => {
  let blankDateList = []
  let from = null
  let to = null
  dataList.forEach((data, index) => {
    let time = data[0]
    let open = data[1]
    let high = data[2]
    let low = data[3]
    let close = data[4]
    let volume = data[5]
    if (open == null || high == null || low == null || close == null || volume == null ||
      open == 0 || high == 0 || low == 0 || close == 0 || volume == 0) {
      let dt = new Date(time)
      if (from == null) {
        from = dt
      } else {
        to = dt
      }
    } else {
      if (from != null && to != null) {
        blankDateList.push({
          fromDate: from,
          toDate: to,
          from: from.getTime(),
          to: to.getTime()
        })
        from = null
        to = null
      }
    }
  })
  if (from != null) {
    // 혹시라도 현재까지 공백이 생기고 있다면.. 다시 시도 해본다..
    let now = new Date()
    now.setMinutes(now.getMinutes() - 2)
    blankDateList.push({
      fromDate: from,
      toDate: now,
      from: from.getTime(),
      to: now.getTime()
    })
  }
  return blankDateList
}


exports.handler()
