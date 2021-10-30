class SceneMap extends egret.Sprite {

	public mapId = 0;
	public mapData: IMapData = null;
	public bmpMap = {};

	constructor() {
		super();
		this.touchEnabled = true;
	}

	initMap(id: number, data: IMapData): void {
		this.mapId = id;
		this.mapData = data;
	}

	updateBmp(): void {
		let data = this.mapData;
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
				cell.setIdx(i, j, this.mapId);
				cell.width = data.sliceWidth * this.getSceenScaleX();
				cell.height = data.sliceHeight * this.getSceenScaleY();
				cell.x = initX + j * (data.sliceHeight * this.getSceenScaleX());
				cell.y = initY + i * (data.sliceWidth * this.getSceenScaleY());
				cell.name = `${i}_${j}`;
				this.addChild(cell);
			}
		}
	}

	private getMapWidth() {
		return this.mapData.width;
	}

	private getMapHeigh() {
		return this.mapData.height;
	}

	private getStageWidth() {
		return this.stage.stageWidth;
	}

	private getStageHeigh() {
		return this.stage.stageHeight;
	}


	public getSceenScaleX(): number {
		return this.getStageWidth() / this.getMapWidth();
	}

	public getSceenScaleY(): number {
		return this.getStageHeigh() / this.getMapHeigh();
	}
}