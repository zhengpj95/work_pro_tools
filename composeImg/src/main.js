const images = require("images");
const path = require("path");
const fs = require("fs");

const mapId = "10001";
/* 切块方式： 1表示横切，2表示竖切 */
const sliceType = 2;
const totalRow = 12; //行数
const totalCol = 12; //列数

function main() {
	let mapHeight = 256 * totalRow;
	let mapWidth = 256 * totalCol;
	let img = images(mapWidth, mapHeight);
	for (let row = 0; row < totalRow; row++) {
		for (let col = 0; col < totalCol; col++) {
			let sliceImg = sliceType == 1 ? `${row}_${col}` : `${col}_${row}`;
			let sourceImg = images(path.join(__dirname, `../source/${mapId}/${sliceImg}.jpg`));
			if (!sourceImg) {
				continue;
			}
			img.draw(images(sourceImg, 0, 0, 256, 256), col * 256, row * 256);
		}
	}
	let outputRoot = path.join(__dirname, "../output");
	if (!fs.existsSync(outputRoot)) {
		fs.mkdirSync(outputRoot);
	}
	img.save(path.join(outputRoot, `map_${mapId}.jpg`));
}

main();
