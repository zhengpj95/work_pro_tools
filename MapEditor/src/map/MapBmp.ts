class MapBmp extends egret.Bitmap {
	public cellUrl: string = '';

	public setIdx(row: number, col: number, mapid: number) {
		let url = `/resource/map/${mapid}/${row}_${col}.jpg`;
		if (this.cellUrl == url) {
			return;
		}
		this.cellUrl = url;

		let loader = new egret.ImageLoader();
		loader.crossOrigin = 'anonymous';
		loader.addEventListener(egret.Event.COMPLETE, (e: egret.Event) => {
			let loader = <egret.ImageLoader>e.currentTarget;
			let data = loader.data;
			// console.log(`loader.data -- `, data);
			let texture = new egret.Texture();
			texture._setBitmapData(data);
			this.onLoaded(texture, url);
		}, this);
		loader.load(url);
	}

	private onLoaded(data: egret.Texture, url: string) {
		if (this.cellUrl != url) {
			return;
		}
		this.texture = data;
	}
}