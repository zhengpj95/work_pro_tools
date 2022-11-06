/**
 * 剪裁图片，从一张大图中剪裁
 * json格式
 * {
 *   "frames": {
 *     "oneFrame0": {x:0, y:0, w:100, h:100, offX:0, offY:0, sourceW:910, sourceH:910 },
 *     "oneFrame1": {x:0, y:0, w:100, h:100, offX:0, offY:0, sourceW:910, sourceH:910 },
 *     ......
 *   }
 * }
 *
 * 从一张合图中裁剪出每一帧图片，每一帧图片就是w*h
 */

const path = require("path");
const fs = require("fs");
const images = require("images");

//需要剪裁的图片 todo
let source = "../effect_source/stand_3";
let output = path.join(__dirname, "../output");

/**
 * 读取json里面的图片资源信息数组
 */
function readJson() {
	let infoMap = {};
	let jsonStr = fs.readFileSync(source + ".json", "utf-8");
	let jsonObj = JSON.parse(jsonStr)["frames"];
	for (let key in jsonObj) {
		infoMap[key] = jsonObj[key];
	}
	return infoMap;
}

/**
 * 处理一帧的图片资源，并保存
 */
function dealSingleImg(pngSource, imgInfo, name) {
	if (!fs.existsSync(output)) {
		fs.mkdirSync(output);
	}

	images(imgInfo.w, imgInfo.h)
		.copyFromImage(pngSource, imgInfo.x, imgInfo.y, imgInfo.w, imgInfo.h)
		.save(path.join(output, `${name}.png`));
	console.log(`......${name}.png`);
}

function main() {
	console.log(`============= 剪裁图集开启 =============`);
	let infoMap = readJson();
	let pngSource = images(source + ".png");
	for (let frame in infoMap) {
		dealSingleImg(pngSource, infoMap[frame], frame);
	}
	console.log(`============= 剪裁图集完成 =============`);
}

if (process.argv.length > 2) {
	let argv = process.argv.splice(2);
	source = argv[0].replace(path.extname(argv[0]), "");
	output = path.join(output, path.basename(source));
	// console.log(argv, source, output);
	main();
} else {
	source = "../effect_source/stand_3";
	output = path.join(output, "stand_3");
	main();
}
