const Joi = require("joi");
/*
    Common middleware for handlers
*/
module.exports.commonMiddleWare = function(request,reply,next){
    /*
        Schema for data from uri
    */
    const schema = Joi.object({
        id: Joi.number().integer().required()
    }).unknown();
    /*
        Validate the data from uri against the schema
    */
    const result = Joi.validate(request.query, schema);
    if (!result.error) {
        next();
    } else {
        const acknowledgement = {
            result: "Parameter missing"
        }
        return reply.status(400).send(acknowledgement);
    }
}
