const fs = require('fs');
const path = require('path');

/**
 * @param {string} dir
 * @returns {string[]}
 */
function readDirSync(dir) {
	if (!dir) {
		return [];
	}
	let result = [];
	let files = fs.readdirSync(dir);
	for (let f of files) {
		if (f.charAt(0) === '.') {
			continue;
		}
		let p = path.join(dir, f);
		let stat = fs.lstatSync(p);
		if (stat && stat.isDirectory()) {
			result.push(p);
		}
	}
	return result;
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
function readFileListSync(dir) {
	if (!dir) {
		return [];
	}
	let result = [];
	let files = fs.readdirSync(dir);
	for (let f of files) {
		if (f.charAt(0) === '.') {
			continue;
		}
		let p = path.join(dir, f);
		let stat = fs.lstatSync(p);
		if (stat && stat.isFile()) {
			result.push(p);
		}
	}
	return result;
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
function walkSync(dir) {
	let result = [];
	let files = fs.readdirSync(dir);
	for (let f of files) {
		if (f.charAt(0) === '.') {
			continue;
		}
		let p = path.join(dir, f);
		let stat = fs.lstatSync(p);
		if (!stat) {
			continue;
		}
		if (stat.isDirectory()) {
			result.push(...walkSync(p));
		} else if (stat.isFile()) {
			result.push(p);
		}
	}
	return result;
}

module.exports = {
	readDirSync,
	readFileListSync,
	walkSync,
};
