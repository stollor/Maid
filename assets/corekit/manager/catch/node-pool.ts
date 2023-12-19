import { Component, Node, Prefab, Tween, instantiate, isValid } from 'cc';

export class NodePool {
	private _item: Node | Prefab;
	private _pool: Node[];
	private _max: number;
	constructor(item: Node | Prefab, count: number = 3, max: number = 20) {
		this._pool = [];
		this._max = max;
		if (item instanceof Node) {
			this._unuseNode(item);
		}
		this._item = item;
		for (let i = 0; i < count; i++) {
			this._pool.push(instantiate(this._item) as Node);
		}
	}

	/**
	 * 获取节点
	 * @returns
	 */
	public get(): Node {
		let node = this._pool.pop() || (instantiate(this._item) as Node);
		node.emit('reuse');
		return node;
	}

	/**
	 * 添加节点到池中。
	 * @param node - 要添加到池中的节点。
	 * @returns 池的新大小。
	 */
	public put(node: Node) {
		if (!isValid(node) || this._pool.length >= this._max) {
			node?.destroy();
			return false;
		}
		this._unuseNode(node);
		this._pool.push(node);
		return this._pool.length;
	}

	/**
	 * 获取节点列表
	 * @param number 数量
	 * @returns
	 */
	public getList(number: number) {
		let list: Node[] = [];
		for (let i = 0; i < number; i++) {
			list.push(this.get());
		}
		return list;
	}

	/**
	 * 放入节点列表
	 * @param list
	 * @returns
	 */
	public putList(list: Node[]) {
		for (let i = 0; i < list.length; i++) {
			this.put(list[i]);
		}
		return list.length;
	}

	private _unuseNode(node: Node) {
		Tween.stopAllByTarget(node);
		node.emit('unuse');
		let sp = node.getComponent(Component);
		if (sp) {
			sp.unscheduleAllCallbacks();
		}
	}
}
