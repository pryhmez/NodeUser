var { createServer, METHODS } = require('http');
var { parse } = require('url');
var stringDecoder = require('string_decoder').StringDecoder;
var config = require('./lib/config');
var helper = require('./lib/helper');
var datahelp = require('./lib/data');
var User = require("./lib/model")
//Startup the httpsserver
let date = function now() {
    return new Date('December 25, 1995 23:15:30').getDate();
};
var httpServer = createServer(function (req, res) {

    let user;


    //Get the url and parse it 
    var parsedurl = parse(req.url, true);
    var pathname = parsedurl.pathname;
    //trim the parsed url
    var trimedPath = pathname.replace(/^\/+|\/+$/g, "");
    //get the query string from the url
    var queryString = parsedurl.query;
    console.log('this is the query string', trimedPath)
    //get headers from request
    var headers = req.headers;
    //get http methods
    var method = req.method.toLowerCase();
 
    console.log(method)

    if(method == 'post') {
        var decoder = new stringDecoder('utf-8');
        var buffer = "";
        req.on('data', function (datachunk) {
            buffer += decoder.write(datachunk);
        }).on('end', function () {
            decoder.end();
            var data = {
                trimedPath: trimedPath,
                query: queryString,
                method: method,
                headers: headers,
                payload: JSON.parse(buffer)
            };
            let obj = JSON.parse(buffer);
            console.log('this is the date', date)
            user = new User({ id: 0, name: obj.name, sex: obj.sex, age: obj.age, accountNo: obj.accountNo, datecreated: date })
            console.log(user)
            // var data = {
            //     trimedPath: trimedPath,
            //     query: queryString,
            //     method: method,
            //     headers: headers,
            //     payload: JSON.parse(buffer)
            // };


            datahelp.create('users', "users", user, function (err) {

                if (err) {
                    console.log('going to log')

                }
                console.log("file creation", err);
            });




            console.log("trimed path", trimedPath);
            var chosenhandler = typeof (router[trimedPath]) !== 'undefined' ? router[trimedPath] :
                handler.notFound;

            chosenhandler(data, function (statuscode, payload) {
                var payloadString = JSON.stringify(payload);
                statuscode = typeof (statuscode) == 'number' ? statuscode : 200;
                res.setHeader("Content-Type", "application/json");
                res.writeHead(statuscode)
                res.end(payloadString);
                console.log("end response" + " trimed path " + statuscode, payload);

            })
        })
    }

    if (method == 'get') {
        // ([0-9]+)
    
        let id = trimedPath.match(/([0-9]+)/gi);
        console.log(String(id))
        datahelp.read('users', "users", String(id), ans =>  req.end(res.end(ans)))

    }

})



var handler = {};

handler.ping = (data, callback) => {
    callback(200, { success: true });
}

handler.notFound = (data, callback) => {
    callback(404, { success: false, message: "Not found" });
}



var router = {
    'ping': handler.ping
};


httpServer.listen(config.port, function () {
    console.log(`server is running on port ${config.port}`);
})

