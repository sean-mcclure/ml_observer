const Axios = require('axios');
const FileType = require('file-type');
const ContentType = require('content-type');
const IconvLite = require('iconv-lite');
const HtmlToText = require('html-to-text');
const PdfParse = require('pdf-parse');


const html_to_text_options = {
	tables: true,
	wordwrap: false,
	ignoreImage: true,
	preserveNewlines: false,
	uppercaseHeadings: false,
	hideLinkHrefIfSameAsText: true,
	baseElement: ['html'],
	ignoreHref: true,
	//wordwrap:150,
	noLinkBrackets: true
};

const MIME_REGEX = /.*\.(jpg|png|gif|dotx|doc|webp|flif|cr2|tif|bmp|jxr|psd|rar|zip|tar|rar|js|gz|bz2|7z|dmg|mp4|m4v|mid|mkv|webm|mov|avi|wmv|mpg|mp3|m4a|ogg|opus|flac|wav|amr|epub|exe|swf|rtf|woff|woff2|eot|ttf|otf|ico|flv|ps|xz|sqlite|nes|crx|xpi|cab|dep|ar|rpm|z|lz|msi|mxf|mts|wasm|blend|bpg|docx|pptx|xlsx|3gp|css|xlam|xla|xls|xps|exe)$/i;

function _crawler_request(current_url) {
	let instance = Axios.create();

	let request_config = {
		url: current_url,
		method: 'get',
		baseURL: '',

		transformResponse: [function (data, headers) {

			let ret = {
				url: current_url,
				type: "none",
				html: null,
				text: null,
				status: null,
				error: null
			};

			let type_str = headers['content-type'];

			if (type_str) {

				if (type_str.match(/\/(x-)?pdf/ig)) {
					ret.type = "pdf";
				} else if (type_str.match(/\/html/ig) || type_str.match(/\/json/ig)) {

					let charset = 'none';
					let type_obj = ContentType.parse(type_str);

					if (typeof type_obj.parameters['charset'] !== 'undefined') {
						charset = type_obj.parameters['charset'].toLowerCase();
					}

					if (charset == 'utf-8' || charset == 'ascii' || charset == 'none' || !IconvLite.encodingExists(charset)) {
						ret.html = data.toString();
						ret.type = "html";
					} else {
						ret.html = IconvLite.decode(data, charset);
						ret.type = "html";
					}
				} else {
					ret.type = "none";
				}
			}

			let mimeType = FileType(data);

			if (mimeType == null) {
				ret.html = data.toString();
				ret.type = "html";
			} else if (mimeType.ext == 'pdf') {
				ret.type = "pdf";
			} else if (mimeType.mime != null && mimeType.mime.match(/\/(x-)?pdf/ig)) {
				ret.type = "pdf";
			} else {
				//not supported mime-type
				ret.type = "none";

			}

			//at this point file type is dedected.



			if (ret.type == "html") {
				ret.text = HtmlToText.fromString(ret.html, html_to_text_options);
				return ret;
			} else if (ret.type == "pdf") {
				return PdfParse(data)
					.then(res => {
						if (res) {
							ret.text = res.text
						}

						ret.type = "pdf";
						return ret;
					})
					.catch(err => {
						ret.status = -222;
						ret.error = err.toString();
						return ret;
					});
			} else {
				return ret;
			}
		}],

		headers: {
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
		},

		timeout: 40000,
		withCredentials: false,
		responseType: 'arraybuffer', //'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
		maxContentLength: 20000000,
		validateStatus: function (status) {
			return status >= 200 && status < 300;
		},
		maxRedirects: 5,
	};

	let current_status = -100;

	if (MIME_REGEX.test(current_url)) {
		return Promise.resolve({
			url: current_url,
			type: "none",
			html: null,
			text: null,
			status: -100,
			error: "unsupported-extension"
		});
	}

	return instance.request(request_config)
		.then(function (res) {
			current_status = res.status;
			return res.data;
		})
		.then(function (res) {
			res.status = res.status == -222 ? -222 : current_status;
			return res;
		})
		.catch(function (err) {
			return {
				url: current_url,
				type: "none",
				html: null,
				text: null, //err.response.status
				status: err.response && err.response.status ? err.response.status : -111,
				error: err.toString()
			};
		});
}


function crawler_request_wrapper(current_url, callbackArr) {
	if (typeof current_url != "string" && !Array.isArray(current_url)) throw "first parameter must be a string or an array.";
	if (typeof callbackArr != "undefined" && typeof callbackArr != "function" && !(callbackArr instanceof Array)) throw "second parameter must be a array or callback.";
	if (typeof callbackArr == "undefined") callbackArr = [];
	if (!Array.isArray(callbackArr)) callbackArr = [callbackArr];


	if (Array.isArray(current_url)) {
		let promiseArr = [];

		for (let url of current_url) {
			let crawler_promise = _crawler_request(url);

			for (let callback of callbackArr) {
				crawler_promise = crawler_promise.then(function (result) {
					return callback(result);
				});
			}
			promiseArr.push(crawler_promise);
		}

		return Promise.all(promiseArr);
	} else {

		let crawler_promise = _crawler_request(current_url);

		for (let callback of callbackArr) {
			crawler_promise = crawler_promise.then(function (result) {
				return callback(result);
			});
		}

		return crawler_promise;
	}
}

module.exports = crawler_request_wrapper;

//for testing purpose
if (!module.parent) {
	let Cheerio = require('cheerio');
	let Fs = require("fs");
	let Url = require('url');
	let callbackArr = [];

	function test1(result) {
		result["test1"] = "test1";
		return result;
	}

	function test2(result) {
		result["test2"] = "test2";
		return result;
	}

	function text_size(result) {
		result["text_size"] = result.text == null ? 0 : result.text.length;
		return result;
	}

	callbackArr.push(test1);
	callbackArr.push(test2);
	callbackArr.push(text_size);

	var urlArr = [];
	urlArr.push("http://www.mu.edu.tr/tr/personel/osaygin");
	urlArr.push("http://www.saglikbilimleri.mu.edu.tr/tr/beden-egitimi-ve-spor-anabilim-dali-akademik-kurulu-uyeleri-5461");
	urlArr.push("https://www.j-humansciences.com/ojs/index.php/IJHS/article/viewFile/2010/815");
	urlArr.push("https://www.j-humansciences.com/ojs/index.php/IJHS/article/viewFile/843/406");
	urlArr.push("http://dergipark.gov.tr/inubesyo/board");
	urlArr.push("http://journals.tubitak.gov.tr/medical/issues/sag-09-39-3/sag-39-3-4-0902-21.pdf");
	urlArr.push("http://www.acarindex.com/dosyalar/makale/acarindex-1423936666.pdf");
	urlArr.push("https://www.cabdirect.org/cabdirect/abstract/20093291780?start=2050");
	urlArr.push("http://journals.tubitak.gov.tr/medical/issues/sag-09-39-3/sag-39-3-4-0902-21.pdf");
	urlArr.push("http://www.eng.utah.edu/~lzang/images/Lecture_10_AFM.pdf");
	urlArr.push("http://www.groupes.polymtl.ca/jnmes/archives/article_in_press/JNMES-1029.pdf");
	urlArr.push("https://www.researchgate.net/publication/315951188_Atomic_force_microscopy_investigation_of_step_generation_and_bunching_on_100_facet_of_CH_3_NH_3_PbI_3_crystal_grown_from_g-Butyrolactone_Atomic_force_microscopy_investigation_of_step_generation_and_bu");
	urlArr.push("http://ezfind.technion.ac.il/vufind/EDS/Search?lookfor=SINGLE+crystals&type=SU");
	urlArr.push("http://onlinelibrary.wiley.com/doi/10.1002/crat.201700021/abstract");


	async function testing_purpose() {

		//let result_01 = await crawler_request_wrapper("https://stackoverflow.com/questions/42772401/parallel-operations-with-promise-all");
		//debugger;

		//let result_02 = await crawler_request_wrapper("https://stackoverflow.com/questions/42772401/parallel-operations-with-promise-all",callbackArr);
		//debugger;

		//let result_03 = await crawler_request_wrapper("http://journals.tubitak.gov.tr/medical/issues/sag-09-39-3/sag-39-3-4-0902-21.pdf");
		//debugger;

		//let result_04 = await crawler_request_wrapper("http://journals.tubitak.gov.tr/medical/issues/sag-09-39-3/sag-39-3-4-0902-21.pdf", callbackArr);
		//debugger;

		//let result_05 = await crawler_request_wrapper("http://daytam.atauni.edu.tr/uploads/AFM.docx", callbackArr);
		//debugger;

		//let result_06 = await crawler_request_wrapper("aaabbbccc");
		//debugger;

		//let result_07 = await crawler_request_wrapper("aaabbbccc", callbackArr);
		//debugger;

		//let result_08 = await crawler_request_wrapper(urlArr, callbackArr);
		//debugger;


		//while (true) {
		//	let result_10 = await crawler_request_wrapper("http://www.fizik.itu.edu.tr/physics-10x/doc/FIZ101E_2014-2017.rar");
		//	if (result_10.error != "unsupported-extension") debugger;
		//}


		//let result_11 = await crawler_request_wrapper("https://www.nanomagnetics-inst.com/usrfiles/files/Articles/RT-SHPM/RT-SHPM-1.pdf");
		//debugger;

		let result_12 = await crawler_request_wrapper("https://www.nanomagnetics-inst.com/usrfiles/files/Flyers/N_Akin_makale-2015.pdf");
		debugger;




		//process.exit();

	};

	testing_purpose();
}
