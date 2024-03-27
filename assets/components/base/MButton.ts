import { _decorator, Button, CCBoolean, EventHandler, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 自定义封装的按钮
 * 在监听到"ui_ready"后才可点击
 */
@ccclass('MButton')
export class MButton extends Button {
	protected _transition = Button.Transition.SCALE;
	protected _duration = 0.05;
	protected _zoomScale = 1.05;

	protected onLoad(): void {
		this.interactable = false;
		this.node.on('ui_ready', this.onCheck, this);
	}

	/**
	 * 添加点击事件
	 * @param node 脚本所在的节点
	 * @param comp 脚本类名
	 * @param fun  脚本方法名
	 * @param data 携带的参数
	 */
	public addClickEvent(node: Node, comp: string, fun: string, data: any) {
		const clickEventHandler = new EventHandler();
		clickEventHandler.target = node; // 这个 node 节点是你的事件处理代码组件所属的节点
		clickEventHandler.component = comp; // 这个是脚本类名
		clickEventHandler.handler = fun;
		clickEventHandler.customEventData = data;
		this.clickEvents.push(clickEventHandler);
	}

	@property(CCBoolean) private _gray: boolean;
	public get gray() {
		return this._gray;
	}

	public set gray(value: boolean) {
		this._gray = value;
		let sp = this.target.getComponent(Sprite);
		sp.grayscale = value;
	}

	onCheck() {
		this.interactable = true;
	}
}
