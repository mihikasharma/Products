/*
    sysConf is the variable that holds all the system related configuration
*/
const sysConf = {
    "appkey": "6d7952657461696c",
    "redisMaster": {
        "host": "127.0.0.1",
        "port": 6379
    },
    "logger": {
        "name": "Retail Service",
        "src": true,
        "streams": [{
            "path": "/opt/log/retailService/retailService",
            "level": "trace"
        }]
    },
    "externalApiBaseUrl": "http://redsky.target.com/v2/pdp/tcin/",
    "externalApiExclusionUrl": "?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics"
}

module.exports.sysConf = sysConf;