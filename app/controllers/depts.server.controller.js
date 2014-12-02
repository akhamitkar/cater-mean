'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Dept = mongoose.model('Dept'),
	_ = require('lodash');

/**
 * Create a Dept
 */
exports.create = function(req, res) {
	var dept = new Dept(req.body);
	dept.user = req.user;

	dept.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dept);
		}
	});
};

/**
 * Show the current Dept
 */
exports.read = function(req, res) {
	res.jsonp(req.dept);
};

/**
 * Update a Dept
 */
exports.update = function(req, res) {
	var dept = req.dept ;

	dept = _.extend(dept , req.body);

	dept.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dept);
		}
	});
};

/**
 * Delete an Dept
 */
exports.delete = function(req, res) {
	var dept = req.dept ;

	dept.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dept);
		}
	});
};

/**
 * List of Depts
 */
exports.list = function(req, res) { 
	Dept.find().sort('-created').populate('user', 'displayName').exec(function(err, depts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(depts);
		}
	});
};

/**
 * Dept middleware
 */
exports.deptByID = function(req, res, next, id) { 
	Dept.findById(id).populate('user', 'displayName').exec(function(err, dept) {
		if (err) return next(err);
		if (! dept) return next(new Error('Failed to load Dept ' + id));
		req.dept = dept ;
		next();
	});
};

/**
 * Dept authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.dept.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
