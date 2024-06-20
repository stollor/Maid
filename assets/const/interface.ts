import { Node } from 'cc';

/**
 * 页面风格参数
 */
export interface PageStyleData {
	/**是否遮罩 */
	mask?: boolean;
	/**是否可以点击关闭 */
	close?: boolean;
	/**页面层级 */
	level?: string;
	/**父节点 */
	parent?: Node;
	/**是否缓存 */
	cache?: boolean;
}
