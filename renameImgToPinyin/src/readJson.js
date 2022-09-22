const fs = require("fs");
const path = require("path");
const FileUtil = require("../libs/FileUtil");
const Root = path.join("D:\\project\\p1_client\\trunk\\");
const resPrj = path.join(__dirname, "../sources/default.res.json");

const regExp = /[0-9]*$/;

/**
 * 从 default.res.json 构建所有资源的map
 */
function readResJson() {
	const resMap = {};
	let jsonStr = fs.readFileSync(resPrj, "utf-8");
	let json = JSON.parse(jsonStr);
	let groups = json["groups"];

	for (let gr of groups) {
		let keys = gr["keys"].split(",");
		for (let key of keys) {
			let expAry = key.match(regExp);
			if (expAry && !expAry[0]) {
				let obj = {};
				obj["groupName"] = gr["name"];
				obj["name"] = key;
				obj["cnt"] = 1;
				resMap[key] = obj;
			} else {
				let numEnd = expAry[0];
				let numLen = (numEnd + "").length;
				let name = key.slice(0, key.length - numLen);
				let haveUnderline = name[name.length - 1] == "_"; //最后面有下划线_
				if (haveUnderline) {
					name = name.slice(0, -1);
				}
				let obj = resMap[name];
				if (!obj) {
					obj = {};
					obj["groupName"] = gr["name"];
					obj["name"] = name;
					obj["cnt"] = parseInt(numEnd);
					resMap[name] = obj;
				} else {
					obj["cnt"] = parseInt(Math.max(obj["cnt"], numEnd));
				}
			}
		}
	}
	// console.log(resMap);
	return resMap;
}

function readAssetsJson() {}

module.exports = {
	readResJson,
};
