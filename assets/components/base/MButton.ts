import { _decorator, Button, CCBoolean, ccenum, EventHandler, EventTouch, Node, Sprite } from 'cc';
import { UIState } from '../../const/enum';
const { ccclass, property } = _decorator;

/**
 * 按钮样式
 */
enum ButtonStyle {
	Default,
	Default_gray,
	Close,
	Close_gray,
}
ccenum(ButtonStyle);

/**
 * 按钮点击类型
 */
enum ButtonClickType {
	/**默认 */
	Default = 0,
	/**长按*/
	LongPress = 1,
}
ccenum(ButtonClickType);
/**
 * 自定义封装的按钮
 * 在监听到"ui_ready"后才可点击
 */
@ccclass('MButton')
export class MButton extends Button {
	@property(CCBoolean) private _gray: boolean = false;
	@property({ type: CCBoolean, tooltip: '置灰对应按钮图片', displayOrder: 16 })
	public get gray() {
		return this._gray;
	}

	public set gray(value: boolean) {
		this._gray = value;
		let sp = this.target.getComponent(Sprite);
		sp.grayscale = value;
	}

	@property(CCBoolean) private _enabledByEvent: boolean = false;
	@property({ type: CCBoolean, displayName: '响应Ready事件', tooltip: '在监听到ui_ready后才可点击', displayOrder: 17 })
	public get enabledByEvent() {
		return this._enabledByEvent;
	}
	public set enabledByEvent(value: boolean) {
		this._enabledByEvent = value;
		this.interactable = !value;
	}

	@property({ type: ButtonStyle }) _style: ButtonStyle = ButtonStyle.Default;
	@property({ type: ButtonStyle, displayName: '按钮样式', tooltip: '', displayOrder: 1 })
	public get style() {
		return this._style;
	}
	public set style(value: ButtonStyle) {
		this._style = value;
		//@ts-ignore
		let args = ButtonStyle.__enums__[value].name.split('_');
		switch (args[0]) {
			case 'Default':
				{
				}
				break;
			case 'Close':
				{
				}
				break;
		}
		switch (args[1]) {
			case undefined:
				{
					this.target.getComponent(Sprite).grayscale = false;
					this.interactable = true;
				}
				break;
			case 'gray':
				{
					this.target.getComponent(Sprite).grayscale = true;
					this.interactable = false;
				}
				break;
		}
	}

	@property({ type: ButtonClickType }) _clickType: ButtonClickType = ButtonClickType.Default;
	@property({ type: ButtonClickType, displayName: '点击样式', tooltip: '', displayOrder: 1 })
	public get clickType() {
		return this._clickType;
	}
	public set clickType(value: ButtonClickType) {
		this._clickType = value;
	}

	protected _transition = Button.Transition.SCALE;
	protected _duration = 0.05; //默认间隔
	protected _zoomScale = 1.05; //默认缩放
	/**
	 * 玩家设置的是否可点击
	 */
	public _canClick: boolean = true;
	/**
	 * 自动防连点
	 */
	public _canClickInter: boolean = true;
	/**
	 * 最终是否可点击
	 */
	public _interactable: boolean = true;
	public get interactable() {
		return this._canClick && this._canClickInter;
	}
	public set interactable(value: boolean) {
		this._canClick = value;
	}

	protected onLoad(): void {
		globalThis.enum = ButtonStyle;
		if (this._enabledByEvent) {
			this._canClick = false;
			this.node.on(UIState.AllReady, this.onCheck, this);
		}
		this.node.on('click', this.onClick, this);
	}

	protected onClick(event: Event) {
		switch (this._clickType) {
			case ButtonClickType.Default:
				{
					this._canClickInter = false;
					this.scheduleOnce(() => {
						this._canClickInter = true;
					}, this._duration);
				}
				break;
			case ButtonClickType.LongPress:
				{
				}
				break;
		}
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

	onCheck() {
		this._canClick = true;
	}

	protected _onTouchEnded(event?: EventTouch): void {
		if (!this._interactable || !this.enabledInHierarchy) {
			return;
		}

		//@ts-ignore
		if (this._pressed) {
			EventHandler.emitEvents(this.clickEvents, event);
			if (this.interactable) {
				this.node.emit(Button.EventType.CLICK, this);
			} else {
				this.node.emit('click_gray', this);
			}
		}
		//@ts-ignore
		this._pressed = false;
		this._updateState();

		if (event) {
			event.propagationStopped = true;
		}
	}
}
