var express = require("express");
var router = express.Router();
const Joi = require("joi");
const requestOne = require("request");
/*
	R would hold all the database connections
    logWrapper contains the function that would dump node logs
    middleWareWrapper contains a common function that is used by two 
    different handlers
*/
const R = require("../../models/dbWrapper.js").get;
const logWrapper = require("../../models/logWrapper.js");
const middleWareWrapper = require("../../models/middleWareWrapper.js");


/*
    Middleware for Get Product details
*/
router.use("", (request, reply, next) => {
        middleWareWrapper.commonMiddleWare(request,reply,next);
});
/*
    Handler for Get Product details
*/
router.get("", (request, reply) => {
    /*
        Data from uri
    */
    const id = request.query.id;
    /*
        Skeleton of sample response
    */
    const acknowledgement = {
        result: {}
    };
    /*
        Skeleton of sample json for calling the logger function
    */
    const json = {
        request,
        reply,
        acknowledgement,
        "statusCode": 200
    }
    /*
        Check if the product id exists in redis
    */
    R.db.redisMaster.get(id, (err, resp) => {
        if (err) {
            acknowledgement.result = err;
            json.statusCode = 400;
            logWrapper.logger(json);
            return reply.status(400).json(acknowledgement);
        } else {
            if (!resp) {
                acknowledgement.result = "No content";
                json.statusCode = 204;
                logWrapper.logger(json);
                return reply.status(204).json(acknowledgement);
            } else {
                acknowledgement.result = JSON.parse(resp);
                json.statusCode = 200;
                logWrapper.logger(json);
                return reply.status(200).json(acknowledgement);
            }
        }
    });

});
/*
    Middleware to Get the name of the product from an external API
*/
router.use("/name", (request, reply, next) => {
    middleWareWrapper.commonMiddleWare(request,reply,next);
    
});
/*
    Handler to Get the name of the product from an external api
*/
router.get("/name", (request, reply) => {
    /*
        Data from uri
    */
    const id = request.query.id;
    /*
        Skeleton of sample response
    */
    const acknowledgement = {
        "result": ""
    };
    /*
        Skeleton of sample json for calling the logger function
    */
    const json = {
        request,
        reply,
        acknowledgement,
        "statusCode": 200
    }
    /*
        json for firing the request to an external api
    */
    const options = {
        method: "GET",
        headers: {
            'user-agent': 'node.js'
        },
        url: R.conf.externalApiBaseUrl + id + R.conf.externalApiExclusionUrl
    }

    requestOne(options, (err, resp, body) => {
        if (err) {
            acknowledgement.result = err;
            json.statusCode = 400;
            logWrapper.logger(json);
            return reply.status(400).send(acknowledgement);
        } else {

            if (resp.statusCode == 200) {
                body = JSON.parse(body);
                acknowledgement.result = {
                    name: Object.keys(body.product)[0]
                }
                json.statusCode = resp.statusCode;
                logWrapper.logger(json);
                return reply.status(resp.statusCode).send(acknowledgement);

            } else {
                acknowledgement.result = resp.statusMessage;
                json.statusCode = resp.statusCode;
                logWrapper.logger(json);
                return reply.status(resp.statusCode).send(acknowledgement);
            }
        }
    })

})
/*
    Middleware for updating the product details 
*/
router.use("/", (request, reply, next) => {
    /*
        Schema for the data from uri
    */
    const schemaParams = Joi.object({
        id: Joi.number().integer().required()
    }).unknown();
    /*
        Schema for the data from body
    */
    const schemaBody = Joi.object({
        data: Joi.object().required()
    }).unknown();
    /*
        Skeleton of sample response
    */
    const acknowledgement = {
        "result": ""
    }

    let result;
    /*
        Validating data from uri against schema
    */
    result = Joi.validate(request.query, schemaParams);

    if (!result.error) {
        /*
            Validating data from body against schema
        */
        result = Joi.validate(request.body, schemaBody);
        if (!result.error) {
            next();
        } else {
            acknowledgement.result = "Parameter missing";
            return reply.status(400).send(acknowledgement);
        }
    } else {
        acknowledgement.result = "Parameter missing";
        return reply.status(400).send(acknowledgement);
    }


});
/*
    Handler for updating the product details
*/
router.put("/", (request, reply) => {
    /*
        Data from body
    */
    const body = request.body;
    /*
        Data from uri
    */
    const id = request.query.id;
    /*
        Skeleton of sample response
    */
    const acknowledgement = {
        result: ""
    };
    /*
        Skeleton of sample json to call the logger function
    */
    const json = {
        request,
        reply,
        acknowledgement,
        "statusCode": 200
    }
    /*
        First check of that particular product Id exists in redis,
        if it exists, then update all the keys that are to be updated,
        else send appropriate message.
    */
    R.db.redisMaster.get(request.query.id, (err, resp) => {
        if (err) {
            acknowledgement.result = err;
            json.statusCode = 400;
            logWrapper.logger(json);
            return reply.status(400).send(acknowledgement);
        } else {
            if (!resp) {
                acknowledgement.result = "No content";
                json.statusCode = 204;
                logWrapper.logger(json);
                return reply.status(204).send(acknowledgement);
            } else {
                resp = JSON.parse(resp);
                const arr = Object.keys(body);
                let i;
                for (i in arr) {
                    resp[arr[i]] = body[arr[i]]
                }
                /*
                    Update the product details, set in redis
                */
                R.db.redisMaster.set(id, JSON.stringify(resp), (errWhileUpdate, respWhileUpdate) => {
                    if (errWhileUpdate) {
                        acknowledgement.result = errWhileUpdate;
                        json.statusCode = 400;
                        logWrapper.logger(json);
                        return reply.status(400).send(acknowledgement);
                    } else {
                        acknowledgement.result = "Updated";
                        json.statusCode = 200;
                        logWrapper.logger(json);
                        return reply.status(200).send(acknowledgement);
                    }
                });
            }
        }
    })
});



module.exports = router;