var http = require('http');
// var https = require('https');
var connect = require('connect');
var httpProxy = require('http-proxy');


var selects = [];
var simpleselect = {};

//<img id="logo" src="/images/logo.svg" alt="node.js">
simpleselect.query = 'img';
simpleselect.func = function (node) {

    //Create a read/write stream wit the outer option
    //so we get the full tag and we can replace it
    var stm = node.createStream({ "outer" : true });

    //variable to hold all the info from the data events
    var tag = '';

    //collect all the data in the stream
    stm.on('data', function(data) {
       tag += data;
    });

    //When the read side of the stream has ended..
    stm.on('end', function() {

      //Print out the tag you can also parse it or regex if you want
      process.stdout.write('tag:   ' + tag + '\n');
      process.stdout.write('end:   ' + node.name + '\n');

      //Now on the write side of the stream write some data using .end()
      //N.B. if end isn't called it will just hang.
      stm.end('<img id="logo" src="http://i.imgur.com/LKShxfc.gif" alt="doge">');

    });
}

selects.push(simpleselect);

//
// Basic Connect App
//
var app = connect();

var proxy = httpProxy.createProxyServer({
   target: 'http://www.immoweb.be/',
   agent  : http.globalAgent,
   headers: { host: 'www.immoweb.be' },
})

app.use(require('harmon')([], selects));

app.use(
  function (req, res) {
    proxy.web(req, res);
  }
);

http.createServer(app).listen(80);
