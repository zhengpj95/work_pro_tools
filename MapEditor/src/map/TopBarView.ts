class TopBarView extends BaseView {
	public lbName: eui.Label;
	public BtnSwitch: eui.ToggleSwitch;
	public lbRect: eui.Rect;
	public hSlider: eui.HSlider;
	public lbHSlider: eui.Label;
	public btnSave: eui.Button;

	constructor() {
		super();
		this.skinName = 'skins.TopBarSkin';
		this.percentWidth = 100;
	}

	open() {
		super.open();
		this.initHSlider();
		this.BtnSwitch.selected = true;
		this.lbRect.fillColor = 0xff0000;
		this.addEvent(egret.Event.CHANGE, this.hSlider, this.onHSliderChange);
		this.addEvent(egret.Event.CHANGE, this.BtnSwitch, this.switchToggle);
		this.addEvent(egret.TouchEvent.TOUCH_TAP, this.btnSave, this.onMapSave);
	}

	initHSlider() {
		this.hSlider.maximum = 100;
		this.hSlider.value = 100;
		this.hSlider.pendingValue = 100;
		this.lbHSlider.text = `缩放：${Math.floor(this.hSlider.pendingValue)}%`;
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
		let val = Math.floor(this.hSlider.pendingValue);
		this.lbHSlider.text = `缩放：${val}%`;
		this.dispatchEventWith('OnHSliderChange', true, val, true);
	}
}