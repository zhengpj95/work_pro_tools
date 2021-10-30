class SingletonClass {
	public constructor() {

	}

	/**
	 * 获取实例
	 */
	public static ins(...param: any[]): any {
		let Class: any = this;
		if (!Class._instance) {
			Class._instance = new Class(...param);
		}
		return Class._instance;
	}
}