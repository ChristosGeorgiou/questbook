const dotenv = require("dotenv")
const http = require('http');
const uuidv1 = require('uuid/v1');

dotenv.config();

exports.handler = function (event, context, callback) {

    // event
    // {
    //     "path": "Path parameter",
    //     "httpMethod": "Incoming request's method name"
    //     "headers": {Incoming request headers}
    //     "queryStringParameters": {query string parameters }
    //     "body": "A JSON string of the request payload."
    //     "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
    // }

    if (event.httpMethod === 'OPTIONS') {
        callback(null, {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "content-type"
            },
        });
        return;
    }

    const campaign = uuidv1();

    const options = {
        hostname: process.env.DB_HOST,
        auth: `${process.env.DB_USER}:${process.env.DB_PASS}`,
        port: 5984,
        path: `/${campaign}`,
        method: 'PUT',
    }

    const req = http.request(options, (res) => {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                id: campaign
            })
        })
    })

    req.on('error', (error) => {
        console.log("Error: " + error.message);
        callback(error.message);
        return
    })

    req.end()

};