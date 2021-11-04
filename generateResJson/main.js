/**
 * 游戏资源统一处理，一键生成 default.res.json 文件
 * 此工具只处理图片资源
 * 使用此工具，不需要再游戏每次添加资源时都要打开对应的资源管理器，手动拖拽添加资源，一键生成即可
 */

const fs = require('fs');
const path = require('path');
const FileUtils = require('./FileUtils');

// resource 路径
const resourceRoot = path.join(__dirname, '../../', 'resource');
// 需要打包的资源目录
// eui_assets 是引擎默认的，暂时还需要，统一到 preload 组里
const includeDir = ['assets', 'eui_assets'];

function start() {
	let resMap = {};
	let groupMap = {};
	for (let dir of includeDir) {
		if (dir === 'eui_assets') {
			dealEuiAssets(path.join(resourceRoot, dir), groupMap, resMap, 'preload');
			continue;
		}
		let uiRoot = path.join(resourceRoot, dir);
		let dirList = FileUtils.readDirSync(uiRoot);
		for (let dir of dirList) {
			groupMap[path.basename(dir)] = [];
		}

		let fileList = FileUtils.walkSync(uiRoot);
		for (let file of fileList) {
			let extname = path.extname(file);
			let dirname = path.dirname(file);
			let basename = path.basename(file);
			let groupName = path.basename(dirname);

			let key = basename.replace(extname, '');
			let keyUrl = file.replace(resourceRoot + path.sep, '').replace(/\\/g, '/');
			if (resMap[key]) {
				console.log(`重复文件名：${key}, ${keyUrl}`);
				return;
			}
			// console.log(extname, dirname, basename, groupName, key);
			groupMap[groupName].push(key);
			resMap[key] = keyUrl;
		}
	}
	buildResJson(groupMap, resMap);
}

/**
 * @param {string} euiRoot
 * @param {Object} groupMap
 * @param {Object} resMap
 * @param {string} groupName
 */
function dealEuiAssets(euiRoot, groupMap, resMap, groupName = 'preload') {
	if (!groupMap[groupName]) {
		groupMap[groupName] = [];
	}
	let fileList = FileUtils.walkSync(euiRoot);
	for (let file of fileList) {
		let basename = path.basename(file);
		let key = basename.replace('.', '_');
		let keyUrl = file.replace(resourceRoot + path.sep, '').replace(/\\/g, '/');
		if (resMap[key]) {
			console.log(`重复文件名：${key}, ${keyUrl}`);
			return;
		}
		// console.log(key, keyUrl);
		groupMap[groupName].push(key);
		resMap[key] = keyUrl;
	}
}

/**
 * @param {Object} groupMap
 * @param {Object} resMap
 */
function buildResJson(groupMap, resMap) {
	let obj = { groups: [], resources: [] };
	let groupList = Object.keys(groupMap).sort();
	for (let group of groupList) {
		let list = groupMap[group];
		list.sort();
		obj.groups.push({ name: group, keys: list.join() });
	}

	let resList = Object.keys(resMap).sort();
	for (let res of resList) {
		obj.resources.push({ url: resMap[res], type: 'image', name: res });
	}
	let str = JSON.stringify(obj, null, '\t');
	fs.writeFileSync(path.join(resourceRoot, 'default.res.json'), str, 'utf-8');
}

start();
