class TopBarView extends BaseView {
	public lbName: eui.Label;
	public BtnSwitch: eui.ToggleSwitch;
	public lbRect: eui.Rect;
	public lbScale: eui.Label;
	public scaleSlider: eui.HSlider;
	public lbSize: eui.Label;
	public sizeSlider: eui.HSlider;
	public btnSave: eui.Button;
	public showMask: eui.CheckBox;
	private ins: MapProxy;

	constructor() {
		super();
		this.skinName = 'skins.TopBarSkin';
		this.percentWidth = 100;
		this.ins = MapProxy.ins();
	}

	open() {
		super.open();
		this.initHSlider();
		this.showMask.selected = true;
		this.BtnSwitch.selected = true;
		this.lbRect.fillColor = 0xff0000;
		this.addEvent(egret.Event.CHANGE, this.scaleSlider, this.onHSliderChange);
		this.addEvent(egret.Event.CHANGE, this.sizeSlider, this.onSizeSliderChange);
		this.addEvent(egret.Event.CHANGE, this.BtnSwitch, this.switchToggle);
		this.addEvent(egret.TouchEvent.TOUCH_TAP, this.btnSave, this.onMapSave);
		this.addEvent(egret.TouchEvent.TOUCH_TAP, this.showMask, this.onClickCheckBox);
	}

	initHSlider() {
		this.scaleSlider.maximum = 100;
		this.scaleSlider.value = 100;
		this.scaleSlider.pendingValue = 100;
		this.lbScale.text = `缩放：${Math.floor(this.scaleSlider.pendingValue)}%`;

		this.sizeSlider.maximum = 4;
		this.sizeSlider.value = 0;
		this.sizeSlider.pendingValue = 0;
		this.lbSize.text = `笔刷：${this.sizeSlider.pendingValue}`;
	}

	switchToggle() {
		let type = this.BtnSwitch.selected;
		this.lbRect.fillColor = type ? 0xff0000 : 0xffffff;
		this.dispatchEventWith('OnSwitchToggle', true, type, true);
	}

	onMapSave() {
		this.dispatchEventWith('OnMapSave', true);
	}

	loadMapSuccess() {
		this.lbName.text = MapProxy.ins().mapData.path;
	}

	onHSliderChange() {
		let val = Math.floor(this.scaleSlider.pendingValue);
		this.lbScale.text = `缩放：${val}%`;
		this.dispatchEventWith('OnHSliderChange', true, val, true);
	}

	private onSizeSliderChange() {
		let val = Math.floor(this.sizeSlider.pendingValue);
		this.lbSize.text = `笔刷：${val}`;
		this.ins.brush = val;
	}

	private onClickCheckBox(): void {
		this.dispatchEventWith('onClickCheckBox', true, this.showMask.selected, true);
	}
}