exports.getLatestOhlcv = function(data) {
    var endTime = new Date();
    endTime.setSeconds(0);
    endTime.setMilliseconds(0);
    endTime.setMinutes(endTime.getMinutes());
    var startTime = new Date(endTime.getTime());
    startTime.setMinutes(startTime.getMinutes() - 9);
    var startTimestamp = startTime.getTime();
    var endTimestamp = endTime.getTime();

    var open;
    var high;
    var low;
    var close;
    var volume = 0.0;
    var trades = 0;

    for (var k = 0; k < data.result.length; k++) {
        var o = data.result[k];
        var ts = new Date(o.TimeStamp);
        ts.setMilliseconds(0);
        ts = ts.getTime();

        var price = o.Price.toFixed(10);

        if (ts >= startTimestamp && ts < endTimestamp) {
            if(open == undefined) open = price;
            if(high == undefined || price > high) high = price;
            if(low == undefined || price < low) low = price;
            close = price;
            volume += parseFloat(o.Quantity);
            trades++;
        }
    }
    if(trades > 0) {
        return { "ts":startTimestamp, "o": open, "h": high, "l": low, "c": close, "v": volume, "t": trades };
    }else {
        return false;
    }
}
