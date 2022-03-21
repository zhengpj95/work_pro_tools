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
	public sliceHeight = 0;
	public blocks: number[] = [];
	public path: string = '';

	public rows: number = 0;
	public cols: number = 0;
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