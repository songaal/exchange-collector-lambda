let queue = require("../queue")
let QUEUE_URL = process.env.QUEUE_URL
let exchange_id = process.env.EXCHANGE
let SINCE_TIME = Number(process.env.SINCE_TIME)

const symbolList="DNT/ETH,OAX/ETH,HSR/BTC,ETH/BTC,EOS/ETH,GAS/BTC,BNT/ETH,WTC/BTC,SNT/ETH,BNB/ETH,BTC/USDT,LRC/BTC,BNB/BTC,ICN/ETH,YOYOW/BTC,ZRX/BTC,OMG/ETH,QTUM/ETH,QTUM/BTC,LRC/ETH,STRAT/ETH,SNM/ETH,ZRX/ETH,NEO/ETH,IOTA/BTC,FUN/ETH,SNGLS/ETH,OMG/BTC,BCH/BTC,BQX/ETH,STRAT/BTC,GRS/BTC,MTL/ETH,MDA/ETH,MDA/BTC,ETC/BTC,LINK/ETH,IOTA/ETH,SUB/ETH,ZEC/BTC,XVG/ETH,BNT/BTC,EOS/BTC,SUB/BTC,ICN/BTC,DASH/BTC,EVX/BTC,SALT/ETH,ENG/ETH,REQ/BTC,HSR/ETH,TRX/BTC,REQ/ETH,AST/ETH,TRX/ETH,BTG/BTC,ENJ/BTC,ARK/BTC,EVX/ETH,XRP/BTC,VIB/BTC,POWR/BTC,NULS/BNB,STORJ/BTC,RDN/ETH,XMR/ETH,BCPT/BTC,BCPT/BNB,QSP/BNB,BTS/BTC,BAT/ETH,CDT/ETH,CDT/BTC,LSK/BNB,BTS/ETH,LSK/BTC,BCD/BTC,FUEL/ETH,TNT/ETH,DGD/ETH,SYS/BNB,ADX/ETH,XLM/BTC,IOTA/BNB,LEND/BTC,DGD/BTC,XLM/ETH,LTC/ETH,CMT/ETH,CMT/BTC,CND/BTC,WAVES/ETH,WABI/ETH,ICX/BTC,TNB/BTC,LTC/USDT,WAVES/BNB,WAVES/BTC,NEBL/BTC,OST/BTC,EDO/BTC,BRD/ETH,TRIG/BTC,EDO/ETH,NAV/BTC,INS/BTC,APPC/BTC,STEEM/ETH,XRB/BNB,STEEM/BTC,PIVX/BNB,STEEM/BNB,AE/BNB,ZIL/BNB,NCASH/BTC,NCASH/ETH,ZIL/ETH,RPX/BTC,RPX/ETH,RPX/BNB,XEM/BNB,ZIL/BTC,ADA/BNB,SYS/ETH,BCN/BTC,CLOAK/BTC,CLOAK/ETH,XRP/USDT"

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

async function run() {

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