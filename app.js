var Hapi = require('hapi'),
		_ = require('underscore'),
		findSuggestions = require('./src/findSynonyms.js');

var randomString = require('randomstring');

var fs = require('fs');

var conf = JSON.parse(fs.readFileSync('./conf.json').toString());

var analytics = require('./src/analytics.js')

var server = new Hapi.Server({
});

server.connection({port: conf.port, address: conf.url})

server.route({
	method: 'POST',
	path: '/syns',
	handler: function(request, reply) {

		var transactionId = randomString.generate(10)

		if (!request.payload.resumeText || !request.payload.refText) {
			var err = new Error('Request received which was missing resumeText or refText as payload keys\n');
			reply (err);
			throw err;
		}
		else {
			findSuggestions({transactionId: transactionId, resumeText: request.payload.resumeText, refText: request.payload.refText}, function(err, suggestions) {
				reply({
					suggestions: suggestions,
					transaction: transactionId
				});
			});
		}
	}
})

server.route({
	method: 'GET',
	path: '/assets/{fileName}',
	handler: {
		directory: {
			path: './static/assets'
		}
	}
})

server.route({
	method: 'GET',
	path: '/assets/img/{filename}',
	handler: {
		directory: {
			path: './static/assets/img'
		}
	}
})

server.route({
	method: 'GET',
	path: '/',
	handler: {
		file: {
			path: './static/index.html'
		}
	}
})

server.route({
	method: 'POST',
	path: '/analytics',
	handler: function(request, reply) {

		
		process.nextTick(function() {
			analytics.synFeedback(request.payload);
		})

		reply('Woot');


	}
})

server.start(function() {
	console.log('server listening on', server.info.uri)
});

