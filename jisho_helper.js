const http = require('http');
const https = require('https');
const url = require('url');
const fetch = require('node-fetch');
//const Bluebird = require('bluebird');

//fetch.Promise = Bluebird;

http.createServer(function (req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*'
	}); 
	
	console.log("request received");

	const queryObj = url.parse(req.url,true).query;

	var jishoUrl = 'http://beta.jisho.org/api/v1/search/words?keyword=' + queryObj['keyword'];
	var jishoUrl = encodeURI(jishoUrl);

	console.log(jishoUrl);

	try{
		fetch(jishoUrl)
		.then((res) => {
			console.log("received result");
			return res.json()
		})
		.then((json) => {
			console.log(json);
			res.write(JSON.stringify(json));
			res.end();
		});

	}
	catch(err) {
		res.write({'error':'error'});
		res.end();
	}
 
	
}).listen(8080);
