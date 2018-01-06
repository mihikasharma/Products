var request = require("request");
var assert = require("assert");
/*
    Function to execute the test
*/
module.exports.handleTest = function(summary, json) {
    describe(summary, function() {
        it("", function(done) {
            request(json, (err, resp, body) => {
                if (err) {
                    console.log("Error is", err);
                } else {
                    console.log("Body is", body, resp.statusCode);
                    if (resp.statusCode == 200)
                        assert.equal(200, resp.statusCode);
                    else
                        assert.equal(204, resp.statusCode);

                    done();
                }
            })
        })
    });
}