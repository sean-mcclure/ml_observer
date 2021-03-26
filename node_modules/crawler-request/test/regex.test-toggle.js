const assert = require('assert');
const CR = require('../');

describe('should set error', function () {
	this.timeout("60000");

	it('should set error every call', function () {

		return CR("http://www.fizik.itu.edu.tr/physics-10x/doc/FIZ101E_2014-2017.rar").then(function (response) {
				assert.equal(response.error, "unsupported-extension");
				return CR("http://www.fizik.itu.edu.tr/physics-10x/doc/FIZ101E_2014-2017.rar");
			}).then(function (response) {
				assert.equal(response.error, "unsupported-extension");
				return CR("http://www.fizik.itu.edu.tr/physics-10x/doc/FIZ101E_2014-2017.rar");
			})
			.then(function (response) {
				assert.equal(response.error, "unsupported-extension");
				return CR("http://www.fizik.itu.edu.tr/physics-10x/doc/FIZ101E_2014-2017.rar");
			})
			.then(function (response) {
				assert.equal(response.error, "unsupported-extension");
				return CR("http://www.fizik.itu.edu.tr/physics-10x/doc/FIZ101E_2014-2017.rar");
			})
			.then(function (response) {
				assert.equal(response.error, "unsupported-extension");
			})

	});
});
