class MapWin extends eui.UILayer {

	private rect: eui.Rect;
	private ins: MapProxy;
	private sceneMap: SceneMap;
	private sceneMask: SceneMask;
	private toggleState = true;//true表示障碍
	private topBarView: TopBarView;

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
		this.topBarView = new TopBarView();
		this.addChild(this.topBarView);

		this.ins = MapProxy.ins();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.startToLoadMap, this);
		this.addEventListener('OnHSliderChange', this.onHSliderChange, this);
		this.addEventListener('OnSwitchToggle', this.onSwitchToggle, this);
		this.addEventListener('OnMapSave', this.onMapSave, this);

		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);


		this.sceneMap = new SceneMap();
		this.sceneMap.y = 140;
		this.sceneMap.x = 0;
		this.addChild(this.sceneMap);

		this.sceneMask = new SceneMask();
		this.sceneMask.y = 140;
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

		this.topBarView.loadMapSuccess();
	}

	private onHSliderChange(e: egret.Event): void {
		let scale = (e.data || 1) / 100;
		this.sceneMap.scaleX = this.sceneMap.scaleY = scale;
		this.sceneMask.scaleX = this.sceneMask.scaleY = scale;
		// console.log(this.sceneMap.width * scale, this.sceneMap.height * scale, this.sceneMask.width, this.sceneMask.height);
	}

	private onSwitchToggle(e: egret.Event): void {
		this.toggleState = !!e.data;
	}

	private onMapSave(): void {
		this.ins.saveBlocksData();
	}

	private updateCellStatue(stageX: number, stageY: number): void {
		if (!this.checkPointInMap(stageX, stageY)) {
			console.log(`点击处不在地图范围内`);
			return;
		}

		let realPoint = this.getRealPoint(stageX, stageY);
		let mapData = this.ins.mapData;
		let row = Math.floor(realPoint.y / (mapData.cellHeight * this.sceneMask.scaleY));
		let col = Math.floor(realPoint.x / (mapData.cellWidth * this.sceneMask.scaleX));

		let brush = this.ins.brush;//笔刷
		let cellState = this.toggleState ? 0 : 1;
		let blocks = this.ins.mapData.blocks;

		for (let i = row - brush; i <= row + brush; i++) {
			for (let j = col - brush; j <= col + brush; j++) {
				if (blocks[i] == null || blocks[i][j] == null || blocks[i][j] == cellState) {
					continue;
				}
				blocks[i][j] = cellState;
				this.sceneMask.updateMask();
			}
		}
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
		point.y = stageY - 150;
		return point;
	}

	onTouchBegin(e: egret.TouchEvent): void {
		if (!this.checkPointInMap(e.stageX, e.stageY)) {
			return;
		}
		console.log(`---onTouchBegin---`);
		this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
	}

	onTouchMove(e: egret.TouchEvent): void {
		console.log(`onTouchMove --- ${e.stageX} - ${e.stageY}`);
		this.updateCellStatue(e.stageX, e.stageY);
	}

	onTouchEnd(e: egret.TouchEvent): void {
		console.log(`---onTouchEnd---`);
		this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
	}

}