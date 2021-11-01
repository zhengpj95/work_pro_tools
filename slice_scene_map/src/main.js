const fs = require('fs');
const path = require('path');
const images = require('images');

let mapId = 10020; // todo
let eachWidth = 256;
let eachHeight = 256;
let cellWidth = 32;
let cellHeight = 32;

let imgData = images(path.join(__dirname, '..', 'resource', `${mapId}.jpg`));
let outputRoot = path.join(__dirname, '..', 'output', `${mapId}`);

if (!fs.existsSync(outputRoot)) {
	fs.mkdirSync(outputRoot);
}

let obj = {};
obj.path = path.normalize(path.join('resource', 'map', `${mapId}`));
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

// 地图切片
let cols = Math.floor(imgData.width() / eachHeight);
let rows = Math.floor(imgData.height() / eachHeight);
for (let i = 0; i < rows; i++) {
	for (let j = 0; j < cols; j++) {
		let x = j * eachWidth;
		let y = i * eachHeight;
		let img = images(eachWidth, eachHeight).copyFromImage(imgData, x, y, eachWidth, eachHeight);
		img.saveAsync(path.join(outputRoot, `${i}_${j}.jpg`), 'jpg', (err) => {
			if (err) {
				console.log(`创建 ${i}_${j}.jpg 失败`);
			}
		});
	}
}

// 小地图
imgData.resize(eachWidth, eachHeight);
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
