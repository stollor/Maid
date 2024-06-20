/**
 * 八个方向
 */
export enum Direction {
	Up = 1 << 0,
	Down = 1 << 1,
	Left = 1 << 2,
	Right = 1 << 3,
	UpLeft = (1 << 0) | (1 << 2),
	UpRight = (1 << 0) | (1 << 3),
	DownLeft = (1 << 1) | (1 << 2),
	DownRight = (1 << 1) | (1 << 3),
}

/**
 * 页面状态
 */
export enum UIState {
	/**
	 * 页面创建完成后触发
	 * 仅在首次Create时触发,复用不会触发
	 */
	Create = 'Create',
	/**
	 * 执行页面PreShow后触发
	 */
	PreShow = 'PreShow',
	/**
	 * 页面打开后触发
	 * 状态:active=true,parent!=null
	 */
	Show = 'Show',
	/**
	 * 可选项:页面准备完毕后触发
	 * 手动触发
	 */
	AllReady = 'AllReady',
	/**
	 * 页面关闭后触发
	 */
	Hide = 'Hide',
	/**
	 * 页面销毁后触发
	 */
	Destroy = 'Destroy',
}
