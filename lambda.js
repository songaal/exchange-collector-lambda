var lambda = require('./bulk-scheduler.js');
event = {
        "exchange": "binance",
        "key2": "value2",
        "key3": "value3",
        "key4": "value4"
    }
lambda.handler(event, null);
