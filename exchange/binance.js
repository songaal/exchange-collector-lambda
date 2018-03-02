exports.getLatestOhlcv = function(data) {

    let serverTime = data.serverTime;

    let map = new Map();

    let symbols = data.symbols;
    for(let i=0; i < symbols.length; i++){
        if(symbols[i].status ==  'TRADING'){
            let coin = symbols[i].baseAsset.toLowerCase();
            let base = symbols[i].quoteAsset.toLowerCase();

            //123:456 같은 숫자형 테스트 데이터가 섞여오므로 거른다.
            if( !(isNaN(coin) || isNaN(base)) ){
                console.log('데이터 제거 => coin: ', coin, ', base: ', base);
                continue;
            }

            let ss = map.get(base);

            if(ss === undefined){
                ss = new Map();
                ss.set('base', base);
                ss.set('coins', new Array());
                map.set(base, ss);
            }
            let coins = ss.get('coins');
            coins.push(coin);
            ss.set('coins', coins);
        }
    }

    let market = new Map();
    market.set('list', map);

    console.log('market', market);




    return map;

}
