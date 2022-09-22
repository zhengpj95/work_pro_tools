const fs = require("fs");
const path = require("path");
const readJson = require("./readJson");
const FileUtil = require("../libs/FileUtil");
const pinyin = require("pinyin");
const images = require("images");

let specialDirName = "renameoutput";
let UIRoot = path.join(__dirname, "../sources/A-共用");
let resMap = readJson.readResJson();

// 文件原名路径: 文件拼音命名路径
let newMap = {};

/**
 * 获取图片资源，并做相应的过滤
 * @returns string[]
 */
function getImgs() {
	let fileList = FileUtil.walkSync(UIRoot);

	// console.log(fileList);
	for (let i = 0; i < fileList.length; i++) {
		let file = fileList[i];
		let extname = path.extname(file);
		if (extname != ".png" && extname != ".jpg") {
			fileList.splice(i, 1);
			i--;
			continue;
		}
		let img = images(file);
		if (img && (img.width() >= 720 || img.height() >= 1280)) {
			fileList.splice(i, 1);
			i--;
		}
	}
	return fileList;
}

/**
 * 获取输出路径
 * @returns string
 */
function getOutPath(filePath, dirPath) {
	filePath = path.dirname(filePath);
	let lastPath = filePath.replace(dirPath, "");
	let outPath = path.join(dirPath, specialDirName, lastPath);
	return outPath;
}

/** 把中文改成拼音 */
function renameToPinYin() {
	let fileList = getImgs();
	for (let name of fileList) {
		// name = name.replace(path.join(__dirname, "../sources"), "").replace(/\\/gi, "/"); //去除路径
		let extname = path.extname(name);
		let realName = path.basename(name).replace(extname, "");
		let pinyinName = pinyin(realName, { style: 0 }).join("");
		let newName = pinyinName;
		// console.log(realName, pinyinName);
		if (resMap[pinyinName]) {
			let haveUnderLine = pinyinName[pinyinName.length - 1] == "_"; //末尾是否有下划线
			if (haveUnderLine) {
				newName = pinyinName + (parseInt(resMap[pinyinName]["cnt"]) + 1);
			} else {
				newName = pinyinName + "_" + (resMap[pinyinName]["cnt"] + 1);
			}
		}
		let outPath = getOutPath(name, UIRoot);
		newMap[name] = path.join(outPath, newName + extname);
		// console.log(realName, pinyinName, newName);
	}
	// console.log(newMap);
}

function writeJsonFile(data, filePath) {
	fs.writeFile(filePath, JSON.stringify(data), "utf-8", (err) => {
		if (err) {
			console.log(`写入 ${filePath} 失败`);
		} else {
			console.log(`写入 ${filePath} 成功`);
		}
	});
}

/**
 * 移动重命名后的资源
 */
function moveImgs() {
	for (let key in newMap) {
		let root = path.dirname(newMap[key]);
		// console.log(root);
		FileUtil.mkdirsSync(root);
		fs.copyFile(key, newMap[key], (err) => {
			if (err) {
				console.log(`移动 ${key} 错误`, err);
			} else {
				console.log(`移动 ${key} 成功`);
			}
		});
	}
}

if (process.argv.length > 2) {
	let argv = process.argv.splice(2);
	UIRoot = argv[0];
	let basename = path.basename(UIRoot);
	FileUtil.cleanDirSync(path.join(UIRoot, specialDirName)); //清除上一次重命名导出的文件夹内容
	renameToPinYin();
	writeJsonFile(newMap, path.join(__dirname, "../out/" + basename + "renameRes.json"));
	moveImgs();
} else {
	console.log(`请拖入对应要重命名的文件夹`);
}
