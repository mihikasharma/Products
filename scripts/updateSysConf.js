var redis = require("redis");
const commandLineArgs = require("command-line-args");
const sysConf = require("./sysConf.js").sysConf;
/*
    alias, type and default values for commmand line args
*/
const optionDefinitions = [{
    name: 'redis',
    alias: 'r',
    type: String,
    defaultValue: "127.0.0.1"
}, {
    name: 'redisPort',
    alias: 'p',
    type: String,
    defaultValue: 6379
}];
const args = commandLineArgs(optionDefinitions);

/*
    Redis client
*/

const client = redis.createClient({
    host: args.redis,
    port: args.redisPort
});
/*
    Setting the system configuration key in redis
*/
client.set("6d7952657461696c_sysConf", JSON.stringify(sysConf), (err, resp) => {
    if (err) {
        console.log("Error while setting sysConf key in redis", err);
        process.exit(0);
    } else {
        console.log("Response while setting sysConf key in redis", resp);
        process.exit(0);
    }
})