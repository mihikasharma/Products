/*
    R would hold the database connections and logger client
*/
const R = require("./dbWrapper.js").get;
/*
    Common function that forms and writes logs
*/
module.exports.logger = function(json) {
    const logLine = {
        "appkey": json.request.headers.appkey || R.conf.appkey,
        "originalUrl": json.request.originalUrl,
        "method": json.request.method,
        "headers": json.request.headers,
        "params": json.request.query,
        "response": json.acknowledgement,
        "statusCode": json.statusCode
    }
    R.log.info(logLine);
}