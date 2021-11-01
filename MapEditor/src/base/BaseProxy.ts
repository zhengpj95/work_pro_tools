class BaseProxy extends BaseSocket {

	constructor() {
		super();
	}

	public send(data: any): void {
		BaseSocket.ins().send(data);
	}
}