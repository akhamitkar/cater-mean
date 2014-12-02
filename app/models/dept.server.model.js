'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Dept Schema
 */
var DeptSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Dept name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Dept', DeptSchema);