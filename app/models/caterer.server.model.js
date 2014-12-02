'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Caterer Schema
 */
var CatererSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Caterer name',
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

mongoose.model('Caterer', CatererSchema);