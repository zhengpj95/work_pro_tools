let fs = require("fs");
let path = require("path");
let FileUtil = require("./FileUtil");
let outRoot = "./out";
let jsonObj = null;
let yamljs = require("yamljs");

/**
 * @param {string[]} result
 * @returns void
 */
function writeResult(result) {
	let jsonObj = getJsonObj();
	if (!result || !result.length) {
		console.log(`没有超过 ${jsonObj["maxSize"]} kb 的图片资源`);
		return;
	}
	let str = "";
	for (let item of result) {
		str += item + "\n";
	}
	FileUtil.mkdirsSync(outRoot);
	fs.writeFile(path.resolve(outRoot, "result.txt"), str, (err, res) => {
		if (err) {
			console.log(`写入 ${path.resolve(outRoot, "result.txt")} 失败`);
		} else {
			console.log(`写入 ${path.resolve(outRoot, "result.txt")} 成功`);
		}
	});
}

/**
 * @param {string} url
 * @returns boolean
 */
function checkFilter(url) {
	let jsonObj = getJsonObj();
	if (!jsonObj) {
		return false;
	}
	url = path.normalize(url);
	let filterDir = jsonObj["filterDir"] || [];
	for (let item of filterDir) {
		// console.log(url, path.sep + item + path.sep);
		if (url.indexOf(path.sep + item + path.sep) >= 0) {
			return true;
		}
	}
	return false;
}

function start() {
	let jsonObj = getJsonObj();
	if (!jsonObj) {
		return;
	}
	let fileList = FileUtil.walkSync(jsonObj["root"]);
	let result = [];
	for (let img of fileList) {
		let extname = path.extname(img);
		if (extname.indexOf(jsonObj["imgType"]) < 0 || checkFilter(img)) {
			continue;
		}
		let stat = fs.statSync(img);
		let curSize = Math.floor(stat.size / 1024);
		if (curSize >= jsonObj["maxSize"]) {
			result.push(img);
		}
	}
	// console.log(result);
	writeResult(result);
}

/**
 * @returns Object
 */
function getJsonObj() {
	if (jsonObj) {
		return jsonObj;
	}

	// 读取json配置
	// let data = fs.readFileSync("config.json", "utf-8");
	// if (!data) {
	// 	console.log(`没有 config.json 文件, 请检查! 文件配置 imgType, maxSize, root`);
	// 	return;
	// }

	// 读取yaml配置
	jsonObj = yamljs.parse(fs.readFileSync(path.resolve(__dirname, "../config.yml"), "utf8"));
	console.log(jsonObj);
	return jsonObj;
}

console.log(`======== 开始检查资源 ========`);
start();
