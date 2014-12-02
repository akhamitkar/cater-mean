'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Confroom = mongoose.model('Confroom'),
	_ = require('lodash');

/**
 * Create a Confroom
 */
exports.create = function(req, res) {
	var confroom = new Confroom(req.body);
	confroom.user = req.user;

	confroom.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(confroom);
		}
	});
};

/**
 * Show the current Confroom
 */
exports.read = function(req, res) {
	res.jsonp(req.confroom);
};

/**
 * Update a Confroom
 */
exports.update = function(req, res) {
	var confroom = req.confroom ;

	confroom = _.extend(confroom , req.body);

	confroom.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(confroom);
		}
	});
};

/**
 * Delete an Confroom
 */
exports.delete = function(req, res) {
	var confroom = req.confroom ;

	confroom.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(confroom);
		}
	});
};

/**
 * List of Confrooms
 */
exports.list = function(req, res) { 
	Confroom.find().sort('-created').populate('user', 'displayName').exec(function(err, confrooms) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(confrooms);
		}
	});
};

/**
 * Confroom middleware
 */
exports.confroomByID = function(req, res, next, id) { 
	Confroom.findById(id).populate('user', 'displayName').exec(function(err, confroom) {
		if (err) return next(err);
		if (! confroom) return next(new Error('Failed to load Confroom ' + id));
		req.confroom = confroom ;
		next();
	});
};

/**
 * Confroom authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.confroom.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
