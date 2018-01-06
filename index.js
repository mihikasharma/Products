var express = require("express");
var bodyParser = require("body-parser");
var app = express();

const commandLineArgs = require('command-line-args')

const optionDefinitions = [{
        name: 'redis',
        alias: 'r',
        type: String,
        defaultValue: "127.0.0.1"
    }, {
        name: 'port',
        alias: 'p',
        type: Number,
        defaultValue: 3000
    }, {
        name: 'confFile',
        alias: 'c',
        type: String,
        defaultValue: "6d7952657461696c_sysConf"
    }

]
const args = commandLineArgs(optionDefinitions);


/*
	This would initialize all the database connections
*/
require("./models/dbWrapper.js").init(args);


app.use(bodyParser.json()); //supports json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); //supports json bodies


/*
	Require the apis for which routes would be created
*/
const product = require("./apis/v1/product.js");


/*
	Create routes
*/
app.use("/apis/v1/product", product);

app.listen(args.port);