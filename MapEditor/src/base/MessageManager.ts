/**
 * 事件监听管理器
 */
class MessageManager extends SingletonClass {

	public events: any = {};

	public constructor() {
		super();
	}

	public static ins: () => MessageManager;

	public addEventListener(key: string, func: Function, thisObj: any): void {
		if (!this.events[key]) {
			this.events[key] = [];
		}
		let funcList = this.events[key];
		for (let item of funcList) {
			if (item[0] == func && item[1] == thisObj) {
				return;
			}
		}
		this.events[key].push([func, thisObj]);
	}

	public removeEventListener(key: string, func: Function, thisObj: any): void {
		let funcList = this.events[key];
		if (!funcList || !funcList.length) {
			return;
		}
		for (let i = 0; i < funcList.length; i++) {
			let item = funcList[i];
			if (item[0] == func && item[1] == thisObj) {
				funcList[i] = null;
				break;
			}
		}
	}

	public triggerEventListener(key: string, ...params: any[]): void {
		let funcList = this.events[key];
		if (!funcList || !funcList.length) {
			return;
		}
		for (let i = 0; i < funcList.length; i++) {
			let item = funcList[i];
			if (!item) {
				funcList.splice(i, 1);
				i--;
				continue;
			}
			item[0].apply(item[1], params);
		}
	}

	public removeEventListeners(key: string): void {
		let funcList = this.events[key];
		if (!funcList || !funcList.length) {
			return;
		}
		for (let fun of funcList) {
			this.removeEventListener(key, fun[0], fun[1]);
		}
		delete this.events[key];
	}

	public removeAllEventListener(): void {
		let keys = Object.keys(this.events) || [];
		for (let key of keys) {
			this.removeEventListeners(key);
			delete this.events[key];
		}
		this.events = {};
	}

	/**
	 * =====================================================================================
	 * 下面方法，重写监听的方法体，定义唯一key
	 * 监听的方法需加上【函数修饰器@post()】
	 * 直接运行监听方法，就会在其内部抛出监听事件，然后待执行的方法就会被运行
	 * =====================================================================================
	 */

	/**
	 * @param func 监听的方法
	 * @param myFunc 待执行的方法
	 * @param thisObj
	 */
	public observe(func: Function, myFunc: Function, thisObj: any): void {
		if (typeof func != 'function') {
			console.log(`observe 第一个参数不是 Function。`);
			return;
		}
		let funCallName = func['funCallName'];
		if (!funCallName) {
			console.error(`方法中无 funCallName 属性！${thisObj}`);
			return;
		}
		this.addEventListener(funCallName, myFunc, thisObj);
	}

	/**
	 * @param func 监听的方法
	 * @param myFunc 待执行的方法
	 * @param thisObj
	 */
	public offObserve(func: Function, myFunc: Function, thisObj: any): void {
		let funCallName = func['funCallName'];
		if (!funCallName) {
			console.error(`方法中无 funCallName 属性！${thisObj}`);
			return;
		}
		this.removeEventListener(funCallName, myFunc, thisObj);
	}

	// /**
	//  * 监听的方法运行就会在方法体内部抛出事件，不需要显示调用此方法运行
	//  * @param func 执行监听的方法
	//  * @param params
	//  */
	// public trigger(func: Function, ...params: any[]): void {
	// 	if (typeof func != 'function') {
	// 		console.log(`trigger 参数不是 Function。`);
	// 		return;
	// 	}
	// 	let funCallName = func['funCallName'];
	// 	if (!funCallName) {
	// 		console.error(`方法中无 funCallName 属性！${func}`);
	// 		return;
	// 	}
	// 	this.triggerEventListener(funCallName, ...params);
	// }

	/**
	 * @param func 监听的方法
	 * @param thisObj
	 * @param params 监听的方法数组
	 */
	public associate(func: Function, thisObj: any, ...params: Function[]): void {
		for (let i = 0; i < params.length; i++) {
			this.observe(func, params[i], thisObj);
		}
	}
}