class ListView extends BaseView {
	public scroller: eui.Scroller;
	public mapList: eui.List;

	public ins: MapProxy;
	public mapData: eui.ArrayCollection;

	public constructor() {
		super();
		this.skinName = `skins.ListViewSkin`;
	}

	public initUI(): void {
		this.ins = MapProxy.ins();
		this.scroller.maxHeight = 300;
		this.mapList.dataProvider = this.mapData = new eui.ArrayCollection();
	}

	public open(): void {
		this.x = 36;
		this.y = 58;
		this.mapData.replaceAll(this.ins.mapList);

		this.mapList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapList, this);
		this.mapList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickList, this);
	}

	private onTapList(e: egret.TouchEvent): void {
		e.stopImmediatePropagation();
	}

	private onClickList(e: eui.ItemTapEvent): void {
		if (this.ins.mapId == +e.item) {
			this.close();
			return;
		}
		this.ins.mapId = +e.item;
		MessageManager.ins().triggerEventListener('postMapList', e.item);
		DisplayUtils.removeFromParent(this);
	}

	public close(): void {
		DisplayUtils.removeFromParent(this);
		this.removeAllEvents();
	}
}