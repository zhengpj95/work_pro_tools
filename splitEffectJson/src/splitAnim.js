/**
 * 把特效合图切分
 *
 * 两种格式：
 * 一种是数组格式，[[x,y,w,h,offX,offY,sourceW,sourceH,duration], ...]
 * 一种是egret的默认Sprite Sheet格式, {"frames": {"1": {x,y,w,w,h,offX,offY,sourceW,sourceH}, "2":{},...}}
 */
const path = require("path");
const fs = require("fs");
const FileUtil = require("./FileUtil");
const images = require("images");

let source = "";
let output = "";

const filter = (jsonFile) => {
	return true;
	// return path.basename(path.dirname(jsonFile)) === "展示";
};

function convert(jsonFile) {
	if (!jsonFile) {
		return;
	}

	// output
	let destDir = jsonFile.replace(source, output).replace(path.extname(jsonFile), "");
	FileUtil.mkdirsSync(destDir);

	let png = jsonFile.replace(".json", ".png");
	if (!fs.existsSync(png)) {
		console.log(`Error: 没有对应的png --- ${jsonFile}`);
		return;
	}

	let json = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
	let imgSource = images(png);
	console.log(`开始拆图 --- `, destDir);

	// 数组格式的
	if (Array.isArray(json)) {
		let i = 0;
		for (let item of json) {
			let basename = path.basename(jsonFile, ".json");
			let [x, y, w, h, offX, offY, sourceW, sourceH] = item;
			images(sourceW, sourceH)
				.draw(images(imgSource, x, y, w, h), offX, offY)
				.save(path.join(destDir, `${basename}_${i}.png`));
			i++;
		}
	} else {
		let jsonKeys = Object.keys(json.frames);

		function getVal(frame, key) {
			let frameObj = json.frames[frame];
			if (frameObj) {
				return frameObj[key];
			}
			return 0;
		}

		for (let frame of jsonKeys) {
			let x = getVal(frame, "x");
			let y = getVal(frame, "y");
			let w = getVal(frame, "w");
			let h = getVal(frame, "h");
			let offX = getVal(frame, "offX");
			let offY = getVal(frame, "offY");
			let sourceW = getVal(frame, "sourceW");
			let sourceH = getVal(frame, "sourceH");
			images(sourceW, sourceH)
				.draw(images(imgSource, x, y, w, h), offX, offY)
				.save(path.join(destDir, frame + ".png"));
		}
	}
}

function main() {
	if (!source) return;

	let stat = fs.statSync(source);
	if (stat.isDirectory()) {
		let files = FileUtil.walkSync(source, null, ".json").filter(filter);
		for (let jsonFile of files) {
			convert(jsonFile);
		}
	} else {
		convert(source);
	}
}

if (process.argv.length > 2) {
	let len = process.argv.length;
	let argv = process.argv.splice(2);
	if (len == 4) {
		source = path.normalize(argv[0]);
		output = path.normalize(argv[1]);
	} else if (len == 5) {
		source = path.normalize(argv[0]);
		output = path.normalize(argv[2]);
	}

	console.log(`------开始拆图 ${source}------`);
	main();
}
