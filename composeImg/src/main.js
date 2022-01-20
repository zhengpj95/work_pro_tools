const images = require("images");
const path = require("path");

function main() {
	let mapHeight = 256 * 9;
	let mapWidth = 256 * 12;
	let img = images(mapWidth, mapHeight);
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 12; col++) {
			let sourceImg = images(path.join(__dirname, `../source/1193/${row}_${col}.jpg`));
			if (!sourceImg) {
				continue;
			}
			img.draw(images(sourceImg, 0, 0, 256, 256), col * 256, row * 256);
		}
	}
	img.save(path.join(__dirname, "map.jpg"));
}

main();
