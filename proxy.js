var http = require('http');
var connect = require('connect');
var httpProxy = require('http-proxy');

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
    proxy.web(req, res);
  }
);

http.createServer(app).listen(80);
