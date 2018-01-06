Technologies and databases used are as follows : 
1. Node.js
	version : 7.2.0
2.Redis
	version : 4.0.1
3.Openresty
	version : 1.11.2.4

NodeJs:
Backend is implemeted using Nodejs .The process of starting a nodejs server can be decided on runtime . All the values can be provided using command line arguments. Also node logs are captured .
Node logs would contain the following information : 
1. Appkey
2. Original Url
3. Method(GET/PUT/POST)
4. Headers
5. Request uri
6. Response
7. Status Code

Sample node logs are as follows : 
{"name":"Retail Service","hostname":"mihika-HP-ProBook-440-G3","pid":17359,"level":30,"appkey":"6d7952657461696c","originalUrl":"/apis/v1/product?id=1","method":"GET","headers":{"host":"localhost:3000","connection":"keep-alive","postman-token":"e738eb0f-ddc7-d040-1a37-1bbb59c49882","cache-control":"no-cache","user-agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36","content-type":"application/json","accept":"*/*","accept-encoding":"gzip, deflate, sdch","accept-language":"en-GB,en-US;q=0.8,en;q=0.6"},"params":{"id":"1"},"response":{"result":{"name":"Red label1","price":1000,"id":1,"data":{"price":10}}},"statusCode":200,"msg":"","time":"2017-10-07T04:03:49.581Z","src":{"file":"/home/mihika/Products/models/logWrapper.js","line":14,"func":"module.exports.logger"},"v":0}



Also all database connections are handled by a seprate model(models/dbWrapper.js)


Redis : 
Used to store the product details. It is in memory data store. Used due to its speed.

Openresty : 
Nginx acts as a load balancer that would distribute the load on multiple servers based on round robin algorithm . Also it will act as a proxy server and route the load to respective node process.

It is also used as a caching server that would cache data based on request uri. Cached data is stored in /dev/shm for faster retrieval.
Sample cached data is as follows :
KEY: /apis/v1/product?id=1
HTTP/1.1 200 OK^M
X-Powered-By: Express^M
Content-Type: application/json; charset=utf-8^M
Content-Length: 72^M
ETag: W/"48-oKD0xV0Lv8wwbEFsmDU/VVE4HAo"^M
Date: Sat, 07 Oct 2017 13:41:28 GMT^M
Connection: close^M
^M
{"result":{"name":"Red label1","price":1000,"id":1,"data":{"price":10}}}


Also the requests are logged as follows :
The logs would contain the following information : 
1. Domain Name
2. Date and time
3. Cache status (HIT,MISS,EXPIRED)
4. Request
5. status(200,204,400,502)
6. Body bytes sent
7. Request time
8. Upstream response time

Sample nginx logs are as follows:

127.0.0.1 - mihika.example.com [07/Oct/2017:18:22:30 +0530] EXPIRED "GET /apis/v1/product?id=1 HTTP/1.1" 200 72 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36" 0.017 0.017 .


127.0.0.1 - mihika.example.com [07/Oct/2017:18:22:40 +0530] HIT "GET /apis/v1/product?id=1 HTTP/1.1" 200 72 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36" 0.000 - .
