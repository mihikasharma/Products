const testWrapper = require("./testWrapper.js");
const async = require("neo-async");
const baseUrl = "http://mihika.example.com/apis/v1/";
/*
	update product details
*/
const jsonUpdateDetails = {
	"data" : {
		"price" : 10
	}

}
const optionsUpdateDetails = {
	method : 'PUT',
	url : baseUrl + "product?id="+1,
	json : jsonUpdateDetails

}
const summaryUpdateDetails = "Testing api that would update product details";

/*
	Get product details
*/
const jsonGetDetails = {
    method: "GET",
    url: baseUrl + "product?id=" + 1
}
let summaryGetDetails = "Testing api that would fetch product details";

/*
	Get product name
*/

const jsonGetName = {
    method: "GET",
    url: baseUrl + "product/name?id=" + 13860428
}
let summaryGetName = "Testing api that would fetch name of the product";

/*
	Execute all the tests in parallel
*/
async.parallel([
		function(callback){
			testWrapper.handleTest(summaryUpdateDetails,optionsUpdateDetails);
			return callback(null);
		
		},function(callback){
			testWrapper.handleTest(summaryGetDetails,jsonGetDetails);
			return callback(null);

		},
		function(callback){
			testWrapper.handleTest(summaryGetDetails,jsonGetName);
			return callback(null);
		}
	],(err,resp)=>{
	})
