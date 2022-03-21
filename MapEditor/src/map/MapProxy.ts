class MapProxy extends BaseProxy {
	public mapId: number = 10020;
	public mapData: IMapData = null;
	public mapUrl: string = '';
	public brush: number = 0;//笔刷

	public static ins: () => MapProxy;

	public saveBlocksData(): void {
		this.send(this.mapData);
	}
}

class MapData {
	public width = 0;
	public heigh = 0;
	public cellWidth = 0;
	public cellHeigh = 0;
	public sliceWidth = 0;
	public sliceHeigh = 0;
	public blocks: number[] = [];
	public path: string = '';

	public rows: number = 0;
	public cols: number = 0;

	// public getRows(): number {
	// 	return Math.ceil(this.heigh / this.sliceHeigh);
	// }

	// public getCols(): number {
	// 	return Math.ceil(this.width / this.sliceWidth);
	// }
}

interface IMapData {
	blocks: number[];
	cellHeight: number;
	cellWidth: number;
	height: number;
	width: number;
	sliceWidth: number;
	sliceHeight: number;
	path: string;
}