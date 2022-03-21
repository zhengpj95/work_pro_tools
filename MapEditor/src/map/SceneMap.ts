class SceneMap extends egret.Sprite {

	public bmpMap = {};

	constructor() {
		super();
		this.touchEnabled = true;
	}

	updateBmp(): void {
		let data = MapProxy.ins().mapData;
		if (!data) {
			return;
		}
		let rows = Math.floor(data.height / data.sliceHeight);
		let cols = Math.floor(data.width / data.sliceWidth);

		let initX = 10;
		let initY = 10;

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				let cell = new MapBmp();
				cell.setIdx(i, j, MapProxy.ins().mapId);
				cell.width = data.sliceWidth;
				cell.height = data.sliceHeight;
				cell.x = initX + j * data.sliceHeight;
				cell.y = initY + i * data.sliceWidth;
				cell.name = `${i}_${j}`;
				this.addChild(cell);
			}
		}
	}
}