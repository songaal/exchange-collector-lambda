const AWS = require('aws-sdk')
const worker = require('./bulk-worker')
const lambda = new AWS.Lambda({
    region: 'ap-northeast-2'
});
let limit = Number(process.env.LIMIT)
let SINCE_TIME = Number(process.env.SINCE_TIME)
let RESUME_SYMBOL = process.env.RESUME_SYMBOL

async function run() {
    let resume = true

    if(RESUME_SYMBOL != undefined) {
        resume = false
        console.log(new Date(), 'RESUME_SYMBOL=' + RESUME_SYMBOL)
    }

    let exchange = new (ccxt)[exchange_id] ()
    let markets = await exchange.loadMarkets ()
    let i = 0
    let total = 0
    for (let symbol in markets) {
        total++
    }
    for (let symbol in markets) {
        i++
        market = markets[symbol]
        let base = market.info.quoteAsset
        let coin = market.info.baseAsset
        let k = 0
        console.log(new Date(), '['+i+'/'+total+']' ,exchange_id, symbol)
        if(!resume) {
            if(symbol != RESUME_SYMBOL) {
                continue
            } else {
                resume = true
                console.log(new Date(), 'Now continue at ' + symbol + '...')
            }
        }
        let since = SINCE_TIME
        let lastSince = 0
        while(true) {
            k++
            if(since == lastSince) {
                //더이상 최신데이터가 없다면 종료한다.
                console.log(new Date(), 'No more new data since ', new Date(since).toLocaleString(), since)
                break;
            }
            console.log(new Date(), k, new Date(since).toLocaleString(), symbol, since);
            console.log('call lambda function ', functionName, ', attr:', attr)
            if (process.env.DRY_RUN != 'true') {
                lambda.invoke({
                    FunctionName: functionName,
                    Payload: JSON.stringify(attr)
                }, function (err, data) {
                    if (err) console.log(attr.base, attr.coin, err, err.stack);
                    else console.log(data)
                });
            }

            size = dataList.length
            if (process.env.DRY_RUN != 'true') {
                queue.bulk_put(dataList, exchange_id, coin, base, QUEUE_URL);
            }

            lastData = dataList[size - 1]
            // 마지막 시간을 확인하고 다음 루프의 since 시간으로 셋팅한다.
            lastSince = since
            since = lastData[0]
            await new Promise(x => setTimeout(x, 1000))
        }
        console.log(new Date(), '--------------------------')
    }
}

run()