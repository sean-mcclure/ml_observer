const assert = require('assert');
const CR = require('../');

describe('must crawl google', function () {
	this.timeout("1200000");
	it('should set error when url is invalid', function () {
		let url = "aaabbbccc";
		return CR(url).then(function (res) {
			assert.equal(res.url, url);
			assert.equal(res.type, "none");
			assert.equal(res.status, -111);
			assert.notEqual(res.error, null);
		});
	});

	it('should set error when url has invalid extension', function () {
		let url = "https://stackoverflow.com/logo.png";
		return CR(url).then(function (res) {
			assert.equal(res.url, url);
			assert.equal(res.type, "none");
			assert.equal(res.status, -100);
			assert.notEqual(res.error, null);
			assert.equal(res.error, "unsupported-extension");
		})
	});


	it('should return response when url has http protocol-1', function () {
		let url = "http://stackoverflow.com";
		return CR(url).then(function (res) {
			assert.equal(res.url, url);
			assert.equal(res.type, "html");
			assert.equal(res.status, 200);
			assert.equal(res.error, null);
			assert.notEqual(res.text, null);
			assert.notEqual(res.text.length, 0);
		})
	});

	it('should return response when url has http protocol-2', function () {
		let url = "http://stackoverflow.com/";
		return CR(url).then(function (res) {
			assert.equal(res.url, url);
			assert.equal(res.type, "html");
			assert.equal(res.status, 200);
			assert.equal(res.error, null);
			assert.notEqual(res.text, null);
			assert.notEqual(res.text.length, 0);
		})
	});

	it('should return response when url has https protocol-1', function () {
		let url = "https://stackoverflow.com";
		return CR(url).then(function (res) {
			assert.equal(res.url, url);
			assert.equal(res.type, "html");
			assert.equal(res.status, 200);
			assert.equal(res.error, null);
			assert.notEqual(res.text, null);
			assert.notEqual(res.text.length, 0);
		})
	});

	it('should return response when url has https protocol-2', function () {
		let url = "https://stackoverflow.com/";
		return CR(url).then(function (res) {
			assert.equal(res.url, url);
			assert.equal(res.type, "html");
			assert.equal(res.status, 200);
			assert.equal(res.error, null);
			assert.notEqual(res.text, null);
			assert.notEqual(res.text.length, 0);
		})
	});

});
