const fs = require("fs");
const path = require("path");
const FileUtil = require("./libs/FileUtil");

// 需要检查的属性，source检查引用外部路径则去掉(出现 / 或 \ )；其他检查去掉小数点
let checkAttrs = ["width", "height", "x", "y", "left", "right", "top", "bottom", "horizontalCenter", "verticalCenter", "source"];
// source路径含有错误标识的
let sourceFilter = ["/", "//", "\\", "\\\\"];

function start(root) {
	console.log(`\n=========== 开始处理皮肤 ===========\n`);
	let textRoot = path.join(root);
	let list = FileUtil.walkSync(textRoot, null, ".exml");
	if (list && list.length) {
		list.forEach((item) => check(item));
	}
}

/**
 * 检查皮肤source路径是否合理
 * @param {string} source
 * @returns boolean
 */
function checkSourceError(source) {
	for (let f of sourceFilter) {
		if (source.indexOf(f) > -1) {
			return true;
		}
	}
	return false;
}

/**
 * 处理皮肤
 * @param {string} fileUrl
 * @returns
 */
function check(fileUrl) {
	let fileData = fs.readFileSync(fileUrl, "utf-8");
	if (!fileData) {
		return;
	}

	let newFileData = ""; //新的exml数据，拼接组成

	let spaceIdx = fileData.indexOf(" "); //找出空格
	let leftQuoIdx = 0; //左引号
	let rightQuoIdx = 0; //右引号
	let lastRightQuoIdx = 0; //上一轮的右引号
	let replaceCount = 0; //替换次数

	while (spaceIdx > -1) {
		let equalIdx = fileData.indexOf("=", spaceIdx + 1); //找出右边紧挨空格的等号
		if (equalIdx < 0) {
			//空格右边没有等号了
			break;
		}
		let attrStr = (fileData.slice(spaceIdx + 1, equalIdx) || "").trim(); //找出这个属性名称
		let canFixed = false;

		// 需要处理的属性
		if (attrStr && checkAttrs.indexOf(attrStr) > -1) {
			canFixed = true;
			leftQuoIdx = fileData.indexOf('"', equalIdx + 1);
			rightQuoIdx = fileData.indexOf('"', leftQuoIdx + 1);
			let attrValue = fileData.slice(leftQuoIdx + 1, rightQuoIdx).trim(); //属性对应的值

			let haveReplaced = false;
			let newAttrValue = "";
			if (attrValue) {
				if (attrStr == "source") {
					// source路径有问题的
					if (checkSourceError(attrValue)) {
						newAttrValue = "";
						haveReplaced = true;
						replaceCount++;
					}
				} else {
					// 数值含有小数的
					if (!isNaN(attrValue) && attrValue.indexOf(".") > -1) {
						newAttrValue = parseInt(attrValue);
						haveReplaced = true;
						replaceCount++;
					}
				}
			}
			if (haveReplaced) {
				newFileData = newFileData + fileData.slice(lastRightQuoIdx, leftQuoIdx + 1) + newAttrValue;
				lastRightQuoIdx = rightQuoIdx;
			}
		}

		//下一轮处理的空格
		spaceIdx = fileData.indexOf(" ", (canFixed ? rightQuoIdx : equalIdx) + 1);
	}

	// 无修改
	if (replaceCount == 0) {
		return;
	}
	newFileData += fileData.slice(lastRightQuoIdx);
	fs.writeFile(fileUrl, newFileData, (err) => {
		if (err) {
			console.log(`fail    --- ${fileUrl}`);
		} else {
			console.log(`success --- ${fileUrl}`);
		}
	});
}

if (process.argv.length > 2) {
	let argv = process.argv.splice(2);
	let sourceRoot = argv[0];
	start(sourceRoot);
} else {
	let sourceRoot = "D:\\project\\y3\\eui_prj\\resource\\eui_skins"; //绝对路径
	start(sourceRoot);
}
