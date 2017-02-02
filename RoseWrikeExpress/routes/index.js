var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var https = require('https');
var http = require('http');
var oRequest = require('request');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('login.html');
});

router.get('/index', function (req, res) {
    //http://localhost:3000/index?code=ssyg8wmURYPIZB846KrL8MoGENGBhZCpVZG4gxGEuroka6ofK6Ik5QJk0zZbKg9d-N
    var authorization_code = req.param('code');
    var oRes = res;
    var oReq = req;
    console.log('#########################');
    console.log(authorization_code);
    console.log('#########################');
    
    //now that we have the code we need to get the access token
    var postData = querystring.stringify({
        client_id: "YBdUueJr",
        client_secret: "uxwxruAr7C4NJD9Pxfy65KqKLqy1UYw8R55T9lazzumsuwDRkj75WEUGI08petGp",
        grant_type: 'authorization_code',
        code: authorization_code
    });

    // request option
    var options = {
        host: 'www.wrike.com',
        port: 443,
        path: '/oauth2/token?' + postData,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    // request object    
    var pReq = https.request(options, function (pRes) {
        var result = '';
        pRes.on('data', function (chunk) {
            result += chunk;
        });
        pRes.on('end', function () {
            var oData = JSON.parse(result);
            req.session['access_token'] = oData.access_token;
            req.session['token_type'] = oData.token_type;
            req.session['refresh_token'] = oData.refresh_token;

            console.dir(req.session);
            oRes.render('index.html');
        });
        pRes.on('error', function (err) {
            console.log(err);
        });
    });

    // req error
    pReq.on('error', function (err) {
        console.log(err);
    });

    //send request witht the postData form
    pReq.write(postData);
    pReq.end();
   
});

router.get('/Logout', function (req, res) {
    req.session.destroy();
    res.render('login.html');
});

router.get('/getFolderTree', function (req, res) {
    //var oData;
    //var oReq = voReq;
    //var oRes = voRes;
    //var access_token = JSON.stringify(oReq.session['access_token']);
    //var bearer = JSON.stringify(oReq.session['token_type']);
    //var token = 'bearer ' + access_token;

    //// request option
    //var options = {
    //    host: 'www.wrike.com',
    //    port: 443,
    //    path: '/api/v3/folders',
    //    method: 'GET',
    //    headers: {
    //        'Authorization': token
    //    }
    //};

    //// request object// request object    
    //var pReq = https.request(options, function (pRes) {
    //    pRes.pipe(oRes);
    //}).on('error', function (err) {
    //    console.log(err);
    //}).end();

    ////send request with the postData form
    //pReq.write();
    //pReq.end();

    //var options = {
    //    host: 'www.wrike.com',
    //    port: 443,
    //    path: '/api/v3/folders',
    //    method: 'GET',
    //    headers: {
    //        'Content-Type': 'application/json',
    //        'Authorization': 'bearer ' + JSON.stringify(oReq.session['access_token'])
    //    }
    //};

    //https.request(options, function (response) {
    //    response.pipe(res);
    //}).on('error', function (e) {
    //    res.sendStatus(500);
    //}).end();

    var options = {
        url: 'https://www.wrike.com/api/v3/folders',
        headers: {
            'Authorization': 'bearer ' + JSON.stringify(oReq.session['access_token'])
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            console.log(info);
            res.end(info);
        }
    }

    request(options, callback);

});

module.exports = router;