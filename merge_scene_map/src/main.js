const images = require("images");
const path = require("path");
const fs = require("fs");

/**切块方式 1表示横切，2表示竖切*/
const SLICETYPE = {
	ROW: 1,
	COL: 2
}

/** 地图id */
const mapId = "1193";
/** 切块方式： 1表示横切，2表示竖切 */
const sliceType = SLICETYPE.ROW;

/**
 * 读取目录下所有的资源
 * @param {string} dir
 * @param {string[]} [res]
 * @param {string|string[]} [ext]
 * @return {string[]}
 */
function walkSync(dir, res, ext) {
	res = res || [];
	let files = fs.readdirSync(dir);
	for (let f of files) {
		if (f.charAt(0) === ".") {
			continue;
		}
		let p = path.join(dir, f);
		let stat = fs.lstatSync(p);
		if (stat.isDirectory()) {
			walkSync(p, res, ext);
		} else if (stat.isFile()) {
			let extF = path.extname(f);
			if (typeof ext === "string") {
				if (extF !== ext) {
					continue;
				}
			} else if (Array.isArray(ext)) {
				if (ext.indexOf(extF) < 0) {
					continue;
				}
			}
			res.push(p);
		}
	}
	return res;
}

/**
 * 获取地图切块最大的行数和列数 todo
 * @returns number[]
 */
function getMaxRowAndCol() {
	let mapRoot = path.join(__dirname, "../source", mapId);
	let list = walkSync(mapRoot, null, ".jpg");
	let rst = [0, 0];
	let haveZero1 = false;
	let haveZero2 = false;
	for (let item of list) {
		let basename = path.basename(item).replace(".jpg", "");
		let [num1, num2] = basename.split("_");
		if (num1 == 0 && !haveZero1) {
			haveZero1 = true;
		}
		if (num2 == 0 && !haveZero2) {
			haveZero2 = true;
		}
		if (num1 > rst[0]) {
			rst[0] = +num1;
		}
		if (num2 > rst[1]) {
			rst[1] = +num2;
		}
	}
	if (haveZero1) {
		rst[0] += 1;
	}
	if (haveZero2) {
		rst[1] += 1;
	}
	return rst;
}

function main() {
	let [num1, num2] = getMaxRowAndCol();

	let totalRow = (totalCol = 0);
	if (sliceType == SLICETYPE.ROW) {
		totalRow = num1;
		totalCol = num2;
	} else {
		totalRow = num2;
		totalCol = num1;
	}
	console.log(`row: ${totalRow}, col: ${totalCol}`);

	let mapHeight = 256 * totalRow;
	let mapWidth = 256 * totalCol;
	let img = images(mapWidth, mapHeight);
	for (let row = 0; row < totalRow; row++) {
		for (let col = 0; col < totalCol; col++) {
			let sliceImg = sliceType == SLICETYPE.ROW ? `${row}_${col}` : `${col}_${row}`;
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
	let imgPath = path.join(outputRoot, `map_${mapId}.jpg`);
	img.saveAsync(imgPath, (err) => {
		if (!err) {
			console.log(`写入 ${imgPath} 成功`);
		}
	});
}

main();
