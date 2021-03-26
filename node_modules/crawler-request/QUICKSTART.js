//const crawler = require('crawler-request');
const crawler = require('./');
const co = require('co');
const callbackArr = [];

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


// test code starts here
let testing_purpose = co.wrap(function* () {

	let response_01 = yield crawler("https://stackoverflow.com/questions/42772401/parallel-operations-with-promise-all");
	debugger;

	let response_02 = yield crawler("https://stackoverflow.com/questions/42772401/parallel-operations-with-promise-all", callbackArr);
	debugger;

	let response_03 = yield crawler("http://journals.tubitak.gov.tr/medical/issues/sag-09-39-3/sag-39-3-4-0902-21.pdf");
	debugger;

	let response_04 = yield crawler("http://journals.tubitak.gov.tr/medical/issues/sag-09-39-3/sag-39-3-4-0902-21.pdf", callbackArr);
	debugger;

	let response_05 = yield crawler("http://daytam.atauni.edu.tr/uploads/AFM.docx", callbackArr);
	debugger;

	let response_06 = yield crawler("aaabbbccc");
	debugger;

	let response_07 = yield crawler("aaabbbccc", callbackArr);
	debugger;

	let response_08 = yield crawler(urlArr, callbackArr);
	debugger;
});

testing_purpose();
