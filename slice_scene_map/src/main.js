const fs = require('fs');
const path = require('path');
const images = require('images');

let mapId = 9002; // todo
let eachWidth = 256;
let eachHeigh = 256;
let cellHeigh = 32;
let cellWidth = 32;

let imgData = images(path.join(__dirname, '..', 'resources', `${mapId}.jpg`));
let outputRoot = path.join(__dirname, '..', 'output', `${mapId}`);

if (!fs.existsSync(outputRoot)) {
	fs.mkdirSync(outputRoot);
}

let obj = {};
obj.path = path.normalize(path.join('resources', `${mapId}`));
obj.width = imgData.width();
obj.height = imgData.height();
obj.sliceWidth = eachWidth;
obj.sliceHeigh = eachHeigh;
obj.cellHeigh = cellHeigh;
obj.cellWidth = cellWidth;
obj.blocks = [];

for (let i = 0; i < Math.floor(obj.height / obj.cellHeigh); i++) {
	let cols = Math.floor(obj.width / obj.cellWidth);
	let row = new Array(cols).fill(0);
	obj.blocks.push(row);
}

// 地图切片
let cols = Math.floor(imgData.width() / eachHeigh);
let rows = Math.floor(imgData.height() / eachHeigh);
for (let i = 0; i < rows; i++) {
	for (let j = 0; j < cols; j++) {
		let x = j * eachWidth;
		let y = i * eachHeigh;
		let img = images(eachWidth, eachHeigh).copyFromImage(imgData, x, y, eachWidth, eachHeigh);
		img.saveAsync(path.join(outputRoot, `${i}_${j}.jpg`), 'jpg', (err) => {
			if (err) {
				console.log(`创建 ${i}_${j}.jpg 失败`);
			}
		});
	}
}

// 小地图
imgData.resize(eachWidth, eachHeigh);
imgData.saveAsync(path.join(outputRoot, 'mini.jpg'), 'jpg', (err) => {
	if (err) {
		console.log(`创建 mini.jpg 失败`);
	} else {
		console.log(`创建 mini.jpg 成功`);
	}
});

// 地图信息文件
fs.writeFile(path.join(outputRoot, 'info.json'), JSON.stringify(obj), (err) => {
	if (err) {
		console.log(`创建 info.json 失败`);
	} else {
		console.log(`创建 info.json 成功`);
	}
});
