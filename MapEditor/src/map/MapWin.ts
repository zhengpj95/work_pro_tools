class MapWin extends eui.UILayer {

	private rect: eui.Rect;
	private ins: MapProxy;
	private sceneMap: SceneMap;
	private sceneMask: SceneMask;
	private toggleStatu = false;//true表示障碍

	constructor() {
		super();
		this.name = 'map_win';
		let rect = new eui.Rect();
		rect.fillColor = 0x009900;
		rect.alpha = 0.5;
		rect.percentHeight = 100;
		rect.percentWidth = 100;
		rect.visible = true;
		this.rect = rect;
		this.addChild(rect);
		this.addChild(new TopBarView());

		this.ins = MapProxy.ins();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.startToLoadMap, this);
		this.addEventListener('OnHSliderChange', this.onHSliderChange, this);
		this.addEventListener('OnSwitchToggle', this.onSwitchToggle, this);
		// this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickCell, this);


		this.sceneMap = new SceneMap();
		this.sceneMap.y = 200;
		this.sceneMap.x = 0;
		this.addChild(this.sceneMap);

		this.sceneMask = new SceneMask();
		this.sceneMask.y = 200;
		this.sceneMask.x = 0;
		this.addChild(this.sceneMask);
	}

	/* 加载地图 */
	private startToLoadMap(): void {
		console.log(`start to load map......`);

		let mapId = this.ins.mapId;
		let mapUrl = `resource/map/${mapId}/`;
		let infoJsonUrl = mapUrl + 'info.json';

		let l = RES.getVirtualUrl(infoJsonUrl);
		RES.getResByUrl(l, (data, url) => {
			this.loadMapSuccess(data, url);
		}, this, 'json');
	}


	/* 加载地图成功 */
	private loadMapSuccess(data: IMapData, url: string): void {
		this.ins.mapData = data;
		this.ins.mapUrl = url;
		console.log(data, url);

		// 展示地图
		this.sceneMap.updateBmp();

		this.sceneMask.updateMask();
	}

	private onHSliderChange(e: egret.Event): void {
		let scale = (e.data || 1) / 100;
		this.sceneMap.scaleX = this.sceneMap.scaleY = scale;
		this.sceneMask.scaleX = this.sceneMask.scaleY = scale;
		// console.log(this.sceneMap.width * scale, this.sceneMap.height * scale, this.sceneMask.width, this.sceneMask.height);
	}

	private onSwitchToggle(e: egret.Event): void {
		this.toggleStatu = !!e.data;
	}

	private onClickCell(e: egret.TouchEvent): void {
		if (!this.checkPointInMap(e.stageX, e.stageY)) {
			console.log(`点击处不在地图范围内`);
			return;
		}
		let realPoint = this.getRealPoint(e.stageX, e.stageY);
		let mapData = this.ins.mapData;
		let row = Math.floor(realPoint.x / (mapData.cellHeight * this.sceneMask.getSceenScaleX()));
		let col = Math.floor(realPoint.y / (mapData.cellWidth * this.sceneMask.getSceenScaleY()));

		this.ins.mapData.blocks[row][col] = this.toggleStatu ? 1 : 0;
		this.sceneMask.updateMask();
	}


	/* 点击处是否在 map 范围内 */
	checkPointInMap(pointX: number, pointY: number): boolean {
		let map = this.sceneMap;
		let startX = map.x;
		let startY = map.y;
		let scale = map.scaleX;
		let width = map.width * scale;
		let height = map.height * scale;
		return startX <= pointX && pointX <= startX + width && startY <= pointY && pointY <= startY + height;
	}

	getRealPoint(stageX: number, stageY: number): egret.Point {
		let point = new egret.Point();
		point.x = stageX - 10;
		point.y = stageY - 110;
		return point;
	}

}