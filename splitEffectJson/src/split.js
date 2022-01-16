/**
 * 把图集分解
 * 注意：是根据 labels 子项，得到对应的 frames 的子项，再从 res 中切割图片出来
 */
const path = require('path');
const fs = require('fs');
const images = require('images');

let mcName = 'scenePlayer_0';

let jsonData = fs.readFileSync(path.join(__dirname, `../effect_source/${mcName}.json`), 'utf-8');
jsonData = JSON.parse(jsonData);
let pngSource = images(path.join(__dirname, `../effect_source/${mcName}.png`));

function dealLabels() {
	let labels = jsonData['mc'][mcName]['labels'];
	if (!labels || !labels.length) {
		console.log(`没有 labels 字段`);
		return;
	}

	for (let lb of labels) {
		dealFrames(lb);
	}
}

function dealFrames(lb) {
	if (!lb) {
		return;
	}
	let frames = jsonData['mc'][mcName]['frames'];
	if (!frames || !frames.length) {
		console.log(`没有 frames 字段`);
		return;
	}
	let startFrame = lb['frame'];
	let endFrame = lb['end'];
	for (let i = startFrame, j = 0; i <= endFrame; i++) {
		dealRes(lb['name'], j++, frames[i - 1]);
	}
}

function dealRes(name, idx, frame) {
	if (!frame) {
		return;
	}
	let output = path.join(__dirname, '../output/', mcName);
	if (!fs.existsSync(output)) {
		fs.mkdirSync(output);
	}
	output = path.join(output, name);
	if (!fs.existsSync(output)) {
		fs.mkdirSync(output);
	}

	let res = jsonData['res'][`${frame['res']}`];
	if (!res) {
		console.log(`没有 res 字段`);
		return;
	}

	// console.log(idx, frame, res);
	images(res.w, res.h)
		.draw(images(pngSource, res.x, res.y, res.w, res.h), 0, 0)
		.save(path.join(output, `${name}_${idx}_.png`));
}

dealLabels();
