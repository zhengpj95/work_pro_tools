class TopBarView extends BaseView {
	public lbName: eui.Label;
	public BtnSwitch: eui.ToggleSwitch;
	public lbRect: eui.Rect;
	public hSlider: eui.HSlider;
	public lbHSlider: eui.Label;

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


	onHSliderChange() {
		let val = Math.floor(this.hSlider.pendingValue);
		this.lbHSlider.text = `缩放：${val}%`;
		this.dispatchEventWith('OnHSliderChange', true, val, true);
	}
}