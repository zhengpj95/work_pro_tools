class BaseSocket extends SingletonClass {

	public ws: egret.WebSocket;
	public static Host = "127.0.0.1";
	public static Port = 8081;

	constructor() {
		super();
	}

	public static ins: () => BaseSocket;

	public connect(): void {
		this.ws = new egret.WebSocket();
		this.ws.type = egret.WebSocket.TYPE_STRING;
		this.ws.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocektReceive, this);
		this.ws.addEventListener(egret.Event.CONNECT, this.onSocketConnect, this);
		this.ws.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
		this.ws.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
		this.ws.connect(BaseSocket.Host, BaseSocket.Port);
		console.log(`Websocket: ${BaseSocket.Host}:${BaseSocket.Port}`);
	}

	public onSocektReceive(): void {
		console.log(`socket 接受数据 --- `, JSON.parse(this.ws.readUTF()));
	}

	public onSocketConnect(): void {
		console.log(`socket 连接成功`);
		let obj = {
			name: 'zpj',
			age: 22
		};
		this.send(obj);
	}

	public onSocketClose(): void {
		console.error(`socket 连接关闭`);
	}

	public onSocketError(): void {
		console.error(`socket 连接错误`);
	}

	public send(data: any): void {
		console.log('send data : ', typeof data);

		this.ws.writeUTF(JSON.stringify(data));
	}

}