import { Button, find, instantiate, Node } from 'cc';
import { Utils } from '../../utils';
import { Singleton } from '../base/singleton';
import { UIBase } from '../base/ui-base';
import { NodePoolManager } from './catch/node-pool-manager';

export interface UIStyle {
	/**是否遮罩 */
	mask?: boolean;
	/**是否可以点击关闭 */
	close?: boolean;
	/**页面层级 */
	level: number;
	/**父节点 */
	parent?: Node;
	/**是否缓存 */
	cache?: boolean;
}

export class UIManager extends Singleton {
	private _pool: NodePoolManager;
	private _nodeBlackLayer: Node;
	private _openList: UIBase[] = [];

	constructor() {
		super();
		this._pool = new NodePoolManager();
		this._nodeBlackLayer = this._getBlackLayer();
	}

	getLevel(level: number) {
		let canve = find('UI');
		let layer = canve?.getChildByName(`layer${level}`);
		if (!layer) {
			layer = maid.util.node.getLayerNode(`layer${level}`);
			canve?.addChild(layer);
			layer.zIndex = level;
		}
		return layer;
	}

	async open(url: string, data: any, param: UIStyle) {
		let page: Node | undefined = this._pool.get(url);
		if (!page) {
			let prefab = await maid.asset.load(url);
			if (!prefab) return undefined;
			page = instantiate(prefab) as unknown as Node;
		}
		let sp = page.getExtendComponent(UIBase);
		if (!sp) {
			console.error('UIManager: 没有找到UIBase组件', url);
			return undefined;
		}
		sp.uistyle = param || sp.uistyle;
		sp.data = data;
		sp.path = url;
		this._applayStyle(sp);
		this._openList.push(sp);
		return page;
	}

	private _applayStyle(sp: UIBase) {
		let parent: Node = sp.uistyle.parent || this.getLevel(sp.uistyle.level);
		let lastIndex = 0;
		if (parent.children.length > 0) {
			lastIndex = parent?.children[parent.children.length - 1].zIndex;
		}
		sp.node.parent = parent;
		sp.node.zIndex = lastIndex + 10;
		if (sp.uistyle.mask) {
			this._nodeBlackLayer.parent = parent;
			this._nodeBlackLayer.zIndex = sp.node.zIndex - 1;
			this._nodeBlackLayer.active = true;
			this._nodeBlackLayer.off('click');
			if (sp.uistyle.close) {
				this._nodeBlackLayer.on(
					'click',
					() => {
						sp.onClose();
					},
					this
				);
			}
		}
	}

	public close(sp: UIBase) {
		//在this._openList中移除
		let index = this._openList.indexOf(sp);
		if (index >= 0) {
			this._openList.splice(index, 1);
		}
		//从父节点中移除
		sp.node.parent = null;
		//销毁或缓存
		if (sp.uistyle.cache) {
			this._pool.put(sp.path, sp.node);
		} else {
			sp.node.destroy();
		}
		//转移遮罩
		if (sp.uistyle.mask) {
			this._nodeBlackLayer.active = false;
			for (let i = this._openList.length - 1; i >= 0; i--) {
				if (this._openList[i].uistyle.mask) {
					this._nodeBlackLayer.parent = this._openList[i].node.parent;
					this._nodeBlackLayer.zIndex = this._openList[i].node.zIndex - 1;
				}
			}
		}
	}

	private _getBlackLayer() {
		let node = Utils.getInstance().node.getLayerNode('_blackMask');
		node.oparity = 125;
		node.addComponent(Button);
		maid.util.node.addSpriteColor(node, `#000000`);
		return node;
	}
}
