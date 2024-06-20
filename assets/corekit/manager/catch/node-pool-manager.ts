import { Node, Prefab } from 'cc';

import { Singleton } from '../../decorater/function';
import { NodePool } from './node-pool';

@Singleton
export class NodePoolManager {
	static getInstance: () => NodePoolManager;
	//节点池
	private _nodePool: Map<string, NodePool>;
	private _defineCount: number;
	private _defineMax: number;

	/**
	 * 默认值
	 * @param count 节点的默认缓存值
	 * @param max 节点的默认最大缓存值
	 */
	constructor(count: number = 1, max: number = 10) {
		this._nodePool = new Map<string, NodePool>();
		this._defineCount = count;
		this._defineMax = max;
	}

	//初始化对应的节点池
	public initNodePool(nodePoolName: string, item: Node | Prefab, count: number = this._defineCount, max: number = this._defineMax): void {
		this._nodePool.set(nodePoolName, new NodePool(item, count, max));
	}

	//获取对应的节点池
	public getNodePool(nodePoolName: string): NodePool | undefined {
		return this._nodePool.get(nodePoolName);
	}

	//删除对应的节点池
	public removeNodePool(nodePoolName: string): void {
		this._nodePool.delete(nodePoolName);
	}

	public get(nodePoolName: string): Node | undefined {
		return this._nodePool.get(nodePoolName)?.get();
	}

	public put(nodePoolName: string, node: Node) {
		let pool = this._nodePool.get(nodePoolName);
		if (!pool) {
			this.initNodePool(nodePoolName, node);
		} else {
			pool.put(node);
		}
	}
}
