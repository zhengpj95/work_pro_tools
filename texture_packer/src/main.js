/**
 * 图集打包工具
 * 存放资源的第一个父级文件夹就是一个图集，所以不要存在同名。把这个文件夹下的全部图片资源都打包成一个图集，和对应每张图片的资源信息的json。
 * 这样的一个文件夹下的图片资源后缀都应该统一。比如全是存放png
 */
const fs = require("fs");
const path = require("path");
const images = require("images");
const FileUtil = require("./FileUtil");

let source = "../../splitEffectJson/output/stand_3"; //要打包的资源目录

/**
 * 寻找目录下的所有图片资源，并存储对应的信息到一个map中
 * {
 * 	 "文件夹名":{
 * 			"单张图片名称":{
 * 					root: 图片路径,
 * 					width,
 * 					height,
 * 					name: 单张图片名称
 * 				},
 * 			......
 * 		}
 * }
 */
function findAllImgs() {
	let dirRoot = path.join(__dirname, source);
	let imgList = FileUtil.walkSync(dirRoot);

	let map = {};
	for (let imgPath of imgList) {
		let img = images(imgPath);
		let pathList = imgPath.split(path.sep);
		let key = pathList[pathList.length - 2]; //资源的第一个父级文件夹名作为第一层key，这一个文件夹就是一个图集
		let name = path.parse(imgPath).name; //对应的资源名作作为第二层key
		let item = {
			root: imgPath,
			width: img.width(),
			height: img.height(),
			name: name,
		};
		if (!map[key]) {
			map[key] = {};
		}
		map[key][name] = item;
	}

	// console.log(map);
	return map;
}

/**
 * 每一个文件夹对应一个图集
 * 图集处理和json生成
 */
function packer() {}
