/**
 * 基础页面类
 */
class BaseView extends eui.Component implements eui.UIComponent {
	public events: any[] = [];

	public constructor() {
		super();
		// this.once(eui.UIEvent.COMPLETE, this.initUI, this);
		this.addEventListener(eui.UIEvent.ADDED_TO_STAGE, this.initUI, this);
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.open, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.close, this);
	}

	/**
	 * 初始化
	 */
	public initUI(): void {
		DEBUG && console.log(`执行initUi --- 成功初始${egret.getQualifiedClassName(this)}`);
	}

	/**
	 * 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
	 */
	public open(): void {
		DEBUG && console.log(`执行open --- 成功打开${egret.getQualifiedClassName(this)}`);
	}

	/**
	 * 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。
	 */
	public close(): void {
		DEBUG && console.log(`执行close --- 成功关闭${egret.getQualifiedClassName(this)}`);
		this.removeAllEvents();
	}

	/**
	 * 添加监听事件
	 * @param eventType 事件类型
	 * @param obj 事件对象
	 * @param func 事件方法
	 */
	public addEvent(eventType: string, obj: any, func: Function): void {
		let hasEventListener: boolean = true;

		for (let item of this.events) {
			if (eventType == item[0] && func == item[1] && obj == item[2]) {
				hasEventListener = false;
				break;
			}
		}

		if (hasEventListener) {
			obj.addEventListener(eventType, func, this);
			this.events.push([eventType, func, obj]);
		}
	}

	/**
	 * 移除事件
	 * @param eventType 事件类型
	 * @param obj 事件对象
	 * @param func 事件方法
	 */
	public removeEvent(eventType: string, obj: any, func: Function): void {
		for (let i = 0; i < this.events.length; i++) {
			let event = this.events[i];
			if (eventType == event[0] && func == event[1] && obj == event[2]) {
				obj.removeEventListener(eventType, func, this);
				this.events.splice(i, 1);
				break;
			}
		}
	}

	/**
	 * 移除全部事件
	 */
	public removeAllEvents(): void {
		for (let event of this.events) {
			event[2].removeEventListener(event[0], event[1], this);
		}
		this.events.length = 0;
	}

	public setSkinPart(partName: string, instance: any, otherProps?: string[]): void {
		super.setSkinPart(partName, instance);

		if (!instance || !this.skin[partName] || this.skin[partName] == instance) {
			return;
		}
		let parent = this.skin[partName].parent;
		let keys = BaseView.replaceKeys;
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			instance[key] = this.skin[partName][key];
		}

		if (otherProps && otherProps.length > 0) {
			for (let i = 0; i < otherProps.length; i++) {
				let key = otherProps[i];
				instance[key] = this.skin[partName][key];
			}
		}
		if (parent) {
			let pIndex = parent.getChildIndex(this.skin[partName]);
			DisplayUtils.removeFromParent(this.skin[partName]);
			parent.addChildAt(instance, pIndex);
		}
		this.skin[partName] = instance;
	}

	public static replaceKeys: string[] = ['x', 'y', 'width', 'height', 'alpha', 'anchorOffsetX', 'anchorOffsetY',
		'bottom', 'top', 'left', 'right', 'scaleX', 'scaleY', 'verticalCenter', 'horizontalCenter', 'rotation',
		'skinName', 'visible', 'touchChildren', 'touchEnabled'];
}
