'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Order name',
		trim: true
	},
	department: {
		type: String,
		default: '',
		trim: true
    },
    datetimeofdelivery: {
		type: Date,
		default: '',
		trim: true
	},
	confroom: {
		type: Number,
		default: '',
		trim: true
	},
	noofpeople: {
		type: Number,
		default: '',
		trim: true
	},
	caterers: {
		type: String,
		default: '',
		trim: true
	},
	foodallergies: {
		type: String,
		default: '',
		trim: true
	},
	specialrequests: {
		type: String,
		default: '',
		trim: true
	},
	creditcard: {
		type: Number,
		default: '',
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

mongoose.model('Order', OrderSchema);