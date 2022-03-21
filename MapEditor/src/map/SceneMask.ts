class SceneMask extends egret.Sprite {

	constructor() {
		super();
		this.touchEnabled = true;
	}

	updateMask(): void {
		// console.log(`------------------updateMask`);
		let data = MapProxy.ins().mapData;
		if (!data) {
			return;
		}

		this.graphics.clear();

		let rows = Math.floor(data.height / data.cellHeight);
		let cols = Math.floor(data.width / data.cellWidth);

		let initX = 10;
		let initY = 10;

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				let isBlock = this.getCellState(i, j) == 0;
				let color = isBlock ? 0xff0000 : 0xffffff;
				let alpha = isBlock ? 0.5 : 0;
				this.graphics.beginFill(color, alpha);
				this.graphics.drawRect(initX + j * data.cellWidth + 1, initY + i * data.cellHeight + 1, data.cellWidth - 2, data.cellHeight - 2);
			}
		}
	}

	getCellState(row: number, col: number) {
		let blocks = MapProxy.ins().mapData.blocks;
		return blocks[row][col];
	}
}