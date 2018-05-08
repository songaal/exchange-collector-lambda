const ccxt       = require ('ccxt')
const asciichart = require ('asciichart')
const asTable    = require ('as-table')
const log        = require ('ololog').configure ({ locate: false })
require ('ansicolor').nice
//-----------------------------------------------------------------------------

;
(async function main () {
    const index = 4 // [ timestamp, open, high, low, close, volume ]
    console.log('ccxt', ccxt)
    const ohlcv = await new ccxt['binance'] ().fetchOHLCV ('BTC/USDT', '1m')
    console.log('ohlcv', ohlcv)
    process.exit ()
}) ()
