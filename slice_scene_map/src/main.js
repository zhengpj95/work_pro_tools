const fs = require("fs");
const path = require("path");
const images = require("images");

let mapId = 1001; //地图id
let eachWidth = 256;
let eachHeight = 256;
let cellWidth = 32;
let cellHeight = 32;

let imgData = null; // 原图images
let outputRoot = ""; // 地图切块后保存路径
let obj = {};

function init() {
	let sourceRoot = path.join(__dirname, "..", "resource", `${mapId}.jpg`);
	imgData = images(sourceRoot);
	if (!imgData) {
		console.log(`错误：没有此地图 ${sourceRoot}`);
		return;
	}
	outputRoot = path.join(__dirname, "..", "output", `${mapId}`);

	if (!fs.existsSync(outputRoot)) {
		fs.mkdirSync(outputRoot);
	}

	obj.path = path.normalize(path.join("resource", "map", `${mapId}`));
	obj.width = imgData.width();
	obj.height = imgData.height();
	obj.sliceWidth = eachWidth;
	obj.sliceHeight = eachHeight;
	obj.cellWidth = cellWidth;
	obj.cellHeight = cellHeight;
	obj.blocks = [];

	for (let i = 0; i < Math.floor(obj.height / obj.cellHeight); i++) {
		let cols = Math.floor(obj.width / obj.cellWidth);
		let row = new Array(cols).fill(0);
		obj.blocks.push(row);
	}
}

// 地图切片
function sliceMap() {
	let cols = Math.floor(imgData.width() / eachHeight);
	let rows = Math.floor(imgData.height() / eachHeight);
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let x = j * eachWidth;
			let y = i * eachHeight;
			let img = images(eachWidth, eachHeight).copyFromImage(imgData, x, y, eachWidth, eachHeight);
			img.saveAsync(path.join(outputRoot, `${i}_${j}.jpg`), "jpg", (err) => {
				if (err) {
					console.log(`创建 ${i}_${j}.jpg 失败`);
				}
			});
		}
	}
}

// 小地图
function saveMiniImg() {
	imgData.resize(eachWidth, eachHeight);
	imgData.saveAsync(path.join(outputRoot, "mini.jpg"), "jpg", (err) => {
		if (err) {
			console.log(`创建 mini.jpg 失败`);
		} else {
			console.log(`创建 mini.jpg 成功`);
		}
	});
}

// 地图信息文件
function saveInfoJson() {
	fs.writeFile(path.join(outputRoot, "info.json"), JSON.stringify(obj), (err) => {
		if (err) {
			console.log(`创建 info.json 失败`);
		} else {
			console.log(`创建 info.json 成功`);
		}
	});
}

function main() {
	console.log(`\n=============== 开始切图 ${mapId} ===============\n`);

	init();
	sliceMap();
	saveMiniImg();
	saveInfoJson();
}

if (process.argv.length > 2) {
	let argv = process.argv.splice(2);
	let imgSource = argv[0];
	let imgBasename = path.basename(imgSource);
	fs.copyFile(imgSource, path.join(__dirname, '../resource', imgBasename), (err) => {
		if (err) {
			console.log(`复制图片 ${path.join('../resource', imgBasename)} 错误`);
			return;
		}
		console.log(`复制图片 ${path.join('../resource', imgBasename)} 成功`);
		mapId = imgBasename.replace(path.extname(imgSource), '');
		main();
	});
} else {
	mapId = 1001;
	main();
}
