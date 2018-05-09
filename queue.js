var AWS = require('aws-sdk');

exports.put = function (data, exchange, coin, base, queueUrl) {
    candle = {
        't': data[0],
        'o': data[1],
        'h': data[2],
        'l': data[3],
        'c': data[4],
        'v': data[5],
    }
    var messageBody = JSON.stringify(candle);
    // Set the region
    AWS.config.update({
        region: 'ap-northeast-2'
    });
    var sqs = new AWS.SQS({
        apiVersion: '2012-11-05'
    });

    var params = {
        MessageAttributes: {
            "exchange": {
                DataType: "String",
                StringValue: exchange
            },
            "coin": {
                DataType: "String",
                StringValue: coin
            },
            "base": {
                DataType: "String",
                StringValue: base
            }
        },
        MessageBody: messageBody,
        QueueUrl: queueUrl
    };

    sqs.sendMessage(params, function (err, data) {
        if (err) {
            console.log("Error", err);
            // } else {
            //   console.log("Success", data.MessageId);
        }
    });
}

exports.bulk_put = function (dataList, exchange, coin, base, queueUrl) {

    // Set the region
    AWS.config.update({
        region: 'ap-northeast-2'
    });
    var sqs = new AWS.SQS({
        apiVersion: '2012-11-05'
    });

    entries = []

    for (let i = 0; i < dataList.length; i++) {
        data = dataList[i]
        candle = {
            't': data[0],
            'o': data[1],
            'h': data[2],
            'l': data[3],
            'c': data[4],
            'v': data[5],
        }
        let messageBody = JSON.stringify(candle);
        let entry = {
            Id: i.toString(),
            MessageAttributes: {
                "exchange": {
                    DataType: "String",
                    StringValue: exchange
                },
                "coin": {
                    DataType: "String",
                    StringValue: coin
                },
                "base": {
                    DataType: "String",
                    StringValue: base
                }
            },
            MessageBody: messageBody
        };
        entries.push(entry)
    }

    var params = {
        Entries: entries,
        QueueUrl: queueUrl
    };

    sqs.sendMessageBatch(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        //else console.log(data);           // successful response
    });
}
