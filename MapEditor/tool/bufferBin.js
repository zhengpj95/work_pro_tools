let fs = require("fs");
let buf = Buffer.alloc(12);
console.log(buf.length);
buf.writeInt16LE(1011);
buf.writeInt16LE(256, 2);
buf.writeInt32LE(10, 4);
buf.writeInt32LE(1024, 8);
console.log(buf);
fs.writeFile("../resource/config/buf.bin", buf, (err) => {
	console.log(err);
});

// fs.readFile("../resource/config/buf.bin", (err, data) => {
// 	if (err) console.log(err);
// 	console.log(data.byteLength);
// 	console.log(data.readInt32BE());
// 	console.log(data.readInt32BE(4));
// });
