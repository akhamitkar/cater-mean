'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Confroom Schema
 */
var ConfroomSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Confroom name',
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

mongoose.model('Confroom', ConfroomSchema);