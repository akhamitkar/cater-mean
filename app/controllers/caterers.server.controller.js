'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Caterer = mongoose.model('Caterer'),
	_ = require('lodash');

/**
 * Create a Caterer
 */
exports.create = function(req, res) {
	var caterer = new Caterer(req.body);
	caterer.user = req.user;

	caterer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(caterer);
		}
	});
};

/**
 * Show the current Caterer
 */
exports.read = function(req, res) {
	res.jsonp(req.caterer);
};

/**
 * Update a Caterer
 */
exports.update = function(req, res) {
	var caterer = req.caterer ;

	caterer = _.extend(caterer , req.body);

	caterer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(caterer);
		}
	});
};

/**
 * Delete an Caterer
 */
exports.delete = function(req, res) {
	var caterer = req.caterer ;

	caterer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(caterer);
		}
	});
};

/**
 * List of Caterers
 */
exports.list = function(req, res) { 
	Caterer.find().sort('-created').populate('user', 'displayName').exec(function(err, caterers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(caterers);
		}
	});
};

/**
 * Caterer middleware
 */
exports.catererByID = function(req, res, next, id) { 
	Caterer.findById(id).populate('user', 'displayName').exec(function(err, caterer) {
		if (err) return next(err);
		if (! caterer) return next(new Error('Failed to load Caterer ' + id));
		req.caterer = caterer ;
		next();
	});
};

/**
 * Caterer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.caterer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
