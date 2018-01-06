Step 1 : 
task : start the redis server
command : ./redis-server ../redis.conf

task : start elasticsearch
command : ./bin/elasticsearch -d

task : start openresty
command : sudo /usr/local/openresty/nginx/sbin/nginx -c /usr/local/openresty/nginx/conf/nginx.conf


Step 2 : 
task : run the script (scripts/updateSysConf.js)
command : node scripts/updateSysConf.js -r {serverIp of the redis server} -p {serverPort of the redis server}
example : node cripts/updateSysConf.js -r 127.0.0.1 -p 6379
description : This would add/update the sysConf file for this application

Step 3 : 
task : Start the server 
command : node index.js -r {serverIp of the redis server} -p {port on which the application would be hosted} -c {name of the sysConf file}
example : node index.js -r 127.0.0.1 -p 3000 -c 6d7952657461696c_sysConf
description : This would initialize the service

Step 4 : Run the following command to run the mocha script
command : npm test

Step 5 : Use the postman collection to verify that the services are up and running


