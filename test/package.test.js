/* global describe, it, expect */
var expect = require('expect.js');

const strategy = require('../dist');

describe('passport-heroku', function () {

	// it('should export Strategy constructor directly from package', function () {
	// 	expect(strategy).to.be.a('function');
	// 	expect(Object.keys(strategy)).to.equal(Object.keys(strategy.Strategy));
	// });

	it('should export Strategy constructor', function () {
		expect(strategy.Strategy).to.be.a('function');
	});
});
