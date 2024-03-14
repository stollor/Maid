import { _decorator, CCInteger, instantiate, Layout, Node } from 'cc';
import { range } from '../../corekit/decorater/function';
import { MathUtil } from '../../utils/math';
const { ccclass, property } = _decorator;

@ccclass('MLayout')
export class MLayout extends Layout {
	@property(Node) item: Node;

	@property(CCInteger) _itemNum: number = 0;
	@property({
		type: CCInteger,
	})
	get itemNum() {
		return this._itemNum;
	}
	set itemNum(value) {
		this._itemNum = MathUtil.limit(value, 0, Number.MAX_VALUE);
		this.setItemNum(this._itemNum);
	}

	@range()
	setItemNum(value: number) {
		let nowCount = this.node.children.length;
		if (nowCount < value) {
			for (let i = nowCount; i < value; i++) {
				let item = instantiate(this.item);
				item.active = true;
				this.node.addChild(item);
			}
		} else if (nowCount > value) {
			for (let i = nowCount - 1; i >= value; i--) {
				this.node.children[i].destroy();
			}
		}
	}
}
