import { CCInteger, EventHandler, Layout, Node, _decorator, instantiate } from 'cc';
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

	@property(EventHandler) itemInitFunc: EventHandler;

	@range()
	setItemNum(value: number) {
		let nowCount = this.node.children.length;
		if (nowCount < value) {
			for (let i = nowCount; i < value; i++) {
				this.node.addChild(this.getOneAndShow());
			}
		} else if (nowCount > value) {
			for (let i = nowCount - 1; i >= value; i--) {
				this.node.children[i].destroy();
			}
		}
	}

	getOneAndShow() {
		let item = instantiate(this.item);
		item.active = true;
		this.itemInitFunc.emit([item]);
		return item;
	}
}

export class MLayoutItem {
	public task: PromiseList = new PromiseList();
}

export class PromiseList {
	private _list: (() => Promise<any>)[] = [];
	private _run: boolean = false;

	public isRun() {
		return this._run;
	}

	/**
	 * 添加事件
	 * @param fun 一个返回Promise的函数
	 * @param run_now 是否立刻run这个PomiseList
	 */
	public add<T>(fun: () => Promise<T>, run_now: boolean = true) {
		this._list.push(fun);
		if (!this._run && run_now) {
			this.run();
		}
	}

	public async run() {
		let fun = this._list.shift();
		if (fun) {
			await fun();
			await this.run();
		}
	}
}
