var redis = require("redis");
var elastic = require("elasticsearch");
var bunyan = require("bunyan");
var runtime = {
    db: {},
    conf: {}
};
/*
    Function to initialize all the database connections
*/
module.exports.init = function(args) {
    var client = redis.createClient({
        host: args.redis,
        port: 6379
    });
    client.get(args.confFile, (err, resp) => {
        if (err) {
            console.log("Error is", err);
        } else {
            resp = JSON.parse(resp);
            if(resp.logger){
                const bun = bunyan.createLogger(resp.logger);
                runtime.log = bun;
            }
            if(resp.redisMaster){
                runtime.db.redisMaster = redis.createClient(resp.redisMaster);
            }
            if(resp.externalApiBaseUrl){
                runtime.conf.externalApiBaseUrl = resp.externalApiBaseUrl;
            }
            if(resp.externalApiExclusionUrl){
                runtime.conf.externalApiExclusionUrl = resp.externalApiExclusionUrl;
            }
            if(resp.appkey){
                runtime.conf.appkey = resp.appkey;
            }
            console.log("Database connections created");
            console.log("Listening on port : ", args.port);
        }
    });
}

module.exports.get = runtime;