let queue = require("../queue")
let QUEUE_URL = process.env.QUEUE_URL
let exchange_id = process.env.EXCHANGE
let SINCE_TIME = Number(process.env.SINCE_TIME)

// let symbolList="DNT/ETH,OAX/ETH,HSR/BTC,ETH/BTC,EOS/ETH,GAS/BTC,BNT/ETH"
let symbolList

const getContent = function(url) {
    // return new pending promise
    return new Promise((resolve, reject) => {
        // select http or https module, depending on reqested url
        const lib = url.startsWith('https') ? require('https') : require('http');
        const request = lib.get(url, (response) => {
            // handle http errors
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            // temporary data holder
            const body = [];
            // on every content chunk, push it to the data array
            response.on('data', (chunk) => body.push(chunk));
            // we are done, resolve promise with those joined chunks
            response.on('end', () => resolve(body.join('')));
        });
        // handle connection errors of the request
        request.on('error', (err) => reject(err))
    })
};

async function getSymbols() {
    let result = ''
    url = 'https://api.binance.com/api/v1/exchangeInfo'
    await getContent(url)
        .then(function(response) {
                console.log(response)
                let marketInfo = JSON.parse(response)
                let list = marketInfo.symbols
                for(let i=0;i<list.length;i++) {
                    let s = list[i]
                    if(i == 0) {
                        result = s.baseAsset + '/' + s.quoteAsset
                    }else{
                        result = result + ',' + s.baseAsset + '/' + s.quoteAsset
                    }
                }
            }
        )
    return result
}

async function run() {

    if(!symbolList) {
        await getSymbols()
            .then(function(response) {
                symbolList = response
            });
    }

    if(!symbolList) {
        console.log('error fetch symbols list.')
    }

    console.log("### symbolList >>>", symbolList)

    const symbols = symbolList.split(",")
    let total = symbols.length
    for (let i = 1; i <= total; i++) {
        let name = symbols[i-1]
        let tmp = name.split('/')
        let coin = tmp[0]
        let base = tmp[1]
        let symbol = coin + '' + base
        let k = 0

        console.log(new Date(), '['+i+'/'+total+']' ,exchange_id, symbol)

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
            // dataList = await exchange.fetchOHLCV (symbol, '1m', since, limit)

            let dataList
            const url = 'https://bm2281qz41.execute-api.ap-northeast-2.amazonaws.com/v1?symbol='+symbol+'&interval=1m&startTime='+since
            await getContent(url)
                .then((response) => dataList = JSON.parse(response))
                .catch((err) => console.error(err));

            let size = dataList.length
            if (process.env.DRY_RUN != 'true') {
                queue.bulk_put(dataList, exchange_id, coin, base, QUEUE_URL);
            }

            let lastData = dataList[size - 1]
            // 마지막 시간을 확인하고 다음 루프의 since 시간으로 셋팅한다.
            lastSince = since
            since = lastData[0]
            // await new Promise(x => setTimeout(x, 100))
        }
        console.log(new Date(), '--------------------------')
    }
}

run()