import { Button, director, find, instantiate, Node, Prefab, ResolutionPolicy, view, Widget } from 'cc';
import { UIState } from '../../const/enum';
import { PageStyleData } from '../../const/interface';
import { Utils } from '../../utils';
import { UIBase } from '../base/ui-base';
import { Singleton } from '../decorater/function';
import { NodePoolManager } from './catch/node-pool-manager';

@Singleton
export class UIManager {
	static getInstance: () => UIManager;

	private _pool: NodePoolManager;
	private _nodeBlackLayer: Node;
	private _openList: UIBase[] = [];

	constructor() {
		this._pool = new NodePoolManager();
		this._nodeBlackLayer = this._getBlackLayer();
	}

	getLevel(name: string, zIndex?: number) {
		let canve = find('Canvas');
		let layer = canve?.getChildByName(`layer${name}`);
		if (!layer) {
			layer = maid.util.node.getLayerNode(`layer${name}`);
			canve?.addChild(layer);
			if (zIndex !== undefined) layer.zIndex = zIndex;
		}
		return layer;
	}

	/**
	 * 打开一个ui界面(继承UIBase的节点)
	 * @param url 预制体路径
	 * @param data 参数
	 * @param param
	 * @returns
	 */
	async open(url: string, data?: any, param?: PageStyleData) {
		let page: Node | undefined = this._pool.get(url);
		if (!page) {
			let prefab = await maid.asset.load(url, Prefab);
			if (!prefab) return undefined;
			page = instantiate(prefab) as unknown as Node;
			page.emit(UIState.Create, page);
			page.on('close', this.close, this);
		}
		let sp = page.getExtendComponent(UIBase);
		if (!sp) {
			sp = page.addComponent(UIBase);
			//console.error('UIManager: 没有找到UIBase组件', url);
			//return undefined;
		}
		sp.uistyle = param || sp.uistyle;
		sp.data = data;
		sp.path = url;

		let result = await sp.preShow(param);
		page.emit(UIState.PreShow, page);
		if (!result) return maid.debug.error('UIManager: 页面预加载失败', url);

		this._applayStyle(sp);
		sp.node.active = true;
		page.emit(UIState.Show, page);
		this._openList.push(sp);
		return page;
	}

	private _applayStyle(sp: UIBase) {
		let parent: Node = sp.uistyle.parent || this.getLevel(sp.uistyle?.level ?? 'default');
		let lastIndex = 0;
		if (parent.children.length > 0) {
			lastIndex = parent?.children[parent.children.length - 1].zIndex;
		}
		parent.addChild(sp.node);
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
		sp.node.emit(UIState.Hide, sp.node);
		//销毁或缓存
		if (sp.uistyle.cache) {
			this._pool.put(sp.path, sp.node);
		} else {
			sp.node.destroy();
			sp.node.emit(UIState.Destroy);
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

	public adapt() {
		let designSize = view.getDesignResolutionSize();
		let viewSize = view.getVisibleSize();
		let widget = director.getScene().getChildByName('Canvas').getComponent(Widget);
		//如果屏幕窄了
		if (viewSize.width / viewSize.height < designSize.width / designSize.height) {
			view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH);
			console.log('宽度适配');
			widget.left = 0;
			widget.right = 0;
			widget.top = (viewSize.height - designSize.height) / 2;
			widget.bottom = (viewSize.height - designSize.height) / 2;
		} else {
			view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT);
			console.log('高度适配');
			widget.left = (viewSize.width - designSize.width) / 2;
			widget.right = (viewSize.width - designSize.width) / 2;
			widget.top = 0;
			widget.bottom = 0;
		}
	}
}
