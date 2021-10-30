class MapWin extends eui.UILayer {

	private rect: eui.Rect;
	private ins: MapProxy;
	private sceneMap: SceneMap;

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


		this.sceneMap = new SceneMap();
		this.sceneMap.y = 200;
		this.sceneMap.x = 0;
		this.addChild(this.sceneMap);
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
		this.sceneMap.initMap(this.ins.mapId, data);
		this.sceneMap.updateBmp();
	}

	private onHSliderChange(e: egret.Event): void {
		this.sceneMap.scaleX = this.sceneMap.scaleY = (e.data || 1) / 100;
	}

}