var httpProxy = require('http-proxy');

var options = {
	router: {
		'someurl.net/public' : '127.0.0.1:8000',
		'someurl.net/node' : '127.0.0.1:3000'
	}
};

var proxyServer = httpProxy.createServer(options);
proxyServer.listen(80);