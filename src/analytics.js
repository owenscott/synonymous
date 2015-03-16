
var _ = require('underscore'),
		MongoClient = require('mongodb').MongoClient,
		fs = require('fs');

var CONF = JSON.parse(fs.readFileSync('./conf.json').toString());


exports.synFeedback = function(payload) {

	MongoClient.connect('mongodb://' + CONF.mongoUrl + ':' + CONF.mongoPort + '/' + CONF.dbName, function(err, db) {
		
		if (err) {
			console.log('Mongo Error', err);
		}

		payload.eventType = 'synonym'

		db.collection(CONF.analyticsCollection).insert(payload, function(err, success) {
			console.log('Submitted analytics for a synonym', payload);
			db.close();
		})

	})

}

exports.appFeedback = function(payload) {

	MongoClient.connect('mongodb://' + CONF.mongoUrl + ':' + CONF.mongoPort + '/' + CONF.dbName, function(err, db) {
		
		if (err) {
			console.log('Mongo Error', err);
		}

		payload.eventType = 'feedback'

		db.collection(CONF.feedbackCollection).insert(payload, function(err, success) {
			console.log('User feedback :).', payload);
			db.close();
		})

	})

}

exports.transaction = function(transactionSummary) {

	MongoClient.connect('mongodb://' + CONF.mongoUrl + ':' + CONF.mongoPort + '/' + CONF.dbName, function(err, db) {
		
		transactionSummary.eventType = 'transaction';

		if (err) {
			console.log('Mongo Error', err);
		}

		db.collection(CONF.analyticsCollection).insert(transactionSummary, function(err, success) {
			console.log('Submitted analytics for a transaction.', transactionSummary);
			db.close();
		})

	})

}