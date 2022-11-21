const webSocket = require("ws");
const Host = "127.0.0.1";
const Port = 8082;
const wss = new webSocket.Server({ host: Host, port: Port });
const fs = require("fs");
const path = require("path");

wss.on("connection", (ws) => {
	ws.send(JSON.stringify({ name: "serverI", data: "nihao 客户端" }));

	ws.on("message", (message) => {
		let data = JSON.parse(message.toString());
		if (!data) {
			return;
		}

		if (data && data["path"]) {
			console.log(data["path"]);
			writeMapJson(data);

			// 二进制写入文件测试 todo
			// let mapId = +data.path.replace("resource\\map\\", "");
			// let buffer = Buffer.alloc(32);
			// buffer.writeInt32LE(mapId);
			// buffer.writeInt32LE(data.width, 4);
			// buffer.writeInt32LE(data.height, 8);
			// buffer.writeInt32LE(data.sliceWidth, 12);
			// buffer.writeInt32LE(data.sliceHeight, 16);
			// buffer.writeInt32LE(data.cellWidth, 20);
			// buffer.writeInt32LE(data.cellHeight, 24);
			// fs.writeFile("../resource/config/" + mapId + ".bin", buffer, (err) => {
			// 	console.log(err);
			// });
		}

		if (data && data["msgId"] && data["msgId"] == 1001) {
			let list = getMapList();
			let _d = {
				msgId: 1001,
				data: list,
			};
			// console.log(_d);
			ws.send(JSON.stringify(_d));
		}
	});
});

function writeMapJson(data) {
	if (!data || !data["path"]) {
		return;
	}
	let jsonUrl = path.join("..", data["path"], "info.json");
	if (!fs.existsSync(jsonUrl)) {
		console.log(`${jsonUrl} 不存在`);
		return;
	}
	// console.log(data);
	fs.writeFile(jsonUrl, JSON.stringify(data), (err) => {
		if (err) {
			console.log(`写入错误`);
		} else {
			console.log(`写入成功`);
		}
	});
}

function getMapList() {
	let url = path.join("../resource/map");
	let result = fs.readdirSync(url) || [];
	return result;
}
