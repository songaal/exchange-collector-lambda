const AWS = require('aws-sdk')
const lambda = new AWS.Lambda({
    region: 'ap-northeast-2'
});

/*
* 이 worker는 1. 람다를 호출하고 2. 리턴받은 timestamp로 다시 그 다음 람다를 호출하고 3. timestamp 가 null 일때 까지 호출해준다.
* */
function Worker(id, functionName, exchange_id) {
    this.id = id
    this.functionName = functionName
    this.exchange_id = exchange_id
}

Worker.prototype.callQueue = async function (symbolQueue, since, limit) {
    let k = 1
    while (true) {
        symbol = symbolQueue.shift()
        if (!symbol) {
            console.log('Worker-' + this.id + ' done!')
            break;
        }

        console.log('Worker-' + this.id, k++, symbol)
        const tmp = symbol.split("/")
        const coin = tmp[0]
        const base = tmp[1]
        if (process.env.DRY_RUN != 'true') {
            await this.call(symbol, coin, base, since, limit)
        } else {
            await new Promise(x => setTimeout(x, 1000))
        }
    }
}

Worker.prototype.call = async function (symbol, coin, base, since, limit) {
    let k = 0
    console.log(new Date(), this.exchange_id, symbol)
    let lastSince = 0
    while (true) {
        k++
        if (since == lastSince || isNaN(since)) {
            //더이상 최신데이터가 없다면 종료한다.
            console.log(new Date(), symbol, k, 'No more new data since ', new Date(since).toLocaleString(), since, limit)
            break;
        }
        let attr = {
            exchange: this.exchange_id,
            coin: coin,
            base: base,
            symbol: symbol,
            since: since,
            limit: limit
        }
        console.log(new Date(), symbol, k, new Date(since).toLocaleString(), since, limit);
        let retSince = null
        if (process.env.DRY_RUN != 'true') {
            let failed = false
            await lambda.invoke({
                FunctionName: this.functionName,
                Payload: JSON.stringify(attr)
            }).promise().then(function (data) {
                if (data.StatusCode == 200) {
                    if (data.Payload == 'null') {
                        console.log(new Date(), 'Api error!', new Date(since).toLocaleString(), since, limit)
                    }
                    retSince = Number(data.Payload)
                    console.log(new Date(), symbol, k, 'Next > ', retSince, data.Payload);
                }
            }, function (err) {
                console.log(attr.base, attr.coin, err, err.stack);
            }).catch(function(reason) {
                // 거부
                console.log('Worker-' + this.id + 'error', reason);
                failed = true
            });

            if(failed) {
                console.log('Worker-' + this.id + ' retry.. wait..')
                await new Promise(x => setTimeout(x, 60000));
                continue
                k--
            }
            await new Promise(x => setTimeout(x, 1000));
        }

        // 마지막 시간을 확인하고 다음 루프의 since 시간으로 셋팅한다.
        lastSince = since
        since = retSince
    }
    console.log(new Date(), '--------------------------')
}

module.exports = Worker