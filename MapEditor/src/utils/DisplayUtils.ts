class DisplayUtils {

	/**
	 * 从父级移除child
	 * @param child 
	 */
	public static removeFromParent(child: egret.DisplayObject): void {
		if (!child || child.parent == null) {
			return;
		}
		child.parent.removeChild(child);
	}
}