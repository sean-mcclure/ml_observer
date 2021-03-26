const assert = require('assert');
const CR = require('../');

describe('should set err', function () {
	this.timeout("60000");

	it('should set err 404 01', function () {

		function response_text_size(response) {
			response["size"] = 0;
			return response;
		}

		return CR("http://www.fizik.itu.edu.tr/tr/fac_seminar.php", response_text_size).then(function (response) {
			//handle response
			assert.equal(response.size, 0);
			assert.equal(response.status, 404);
			assert.equal(response.type, "none");
			assert.equal(response.text, null);
			assert.equal(response.html, null);
			assert.notEqual(response.error, "");
		});

	});

	it('should set err 404 02', function () {

		function response_text_size(response) {
			response["size"] = 0;
			return response;
		}

		return CR("http://www.fizik.itu.edu.tr/tr/fac_seminar.pdf", response_text_size).then(function (response) {
			//handle response
			assert.equal(response.size, 0);
			assert.equal(response.status, 404);
			assert.equal(response.type, "none");
			assert.equal(response.text, null);
			assert.equal(response.html, null);
			assert.notEqual(response.error, "");
		});

	});


});
