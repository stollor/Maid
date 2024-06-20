import { Component, Node, _decorator } from 'cc';
import { EDITOR } from 'cc/env';
import { UIState } from '../../const/enum';
import { PageStyleData } from '../../const/interface';

const { ccclass, property } = _decorator;

@ccclass('UIBase')
export class UIBase extends Component {
	public state: UIState = UIState.PreShow;
	/**页面风格 */
	public uistyle: PageStyleData = {
		level: 'page',
	};

	/**数据 */
	public data: any;
	/**预制体路径 */
	public path!: string;
	/**返回的路径 */
	public returnPath!: string;

	/**
	 * 在创建预制体后,加入节点树前调用
	 * @returns
	 */
	public async preShow(): Promise<Boolean> {
		this.state = UIState.PreShow;
		return true;
	}

	public allReady() {
		var emit = (node: Node) => {
			node.emit(UIState.AllReady);
			node.children.forEach((item) => emit(item));
		};
		emit(this.node);
	}

	/**
	 * 由ui管理器打开的界面,应当用ui管理器关闭
	 */
	public onClose() {
		if (!EDITOR) {
			maid?.ui?.close?.(this);
		} else {
			this.onDestroy();
		}
	}
}
