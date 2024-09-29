import { Component, EventMouse, EventTouch, Node, ScrollView, _decorator } from 'cc';
const { ccclass, property } = _decorator;
/**
 * 允许事件穿透
 */
@ccclass('AllowBubbling')
export class AllowBubbling extends Component {
	private _sv: ScrollView | null = null;
	onLoad() {
		this._sv = this.node.getComponent(ScrollView);
		this.node.on(Node.EventType.TOUCH_START, this.dontBeSwallowed, this, !!this._sv);
		this.node.on(Node.EventType.TOUCH_MOVE, this.dontBeSwallowed, this, !!this._sv);
		this.node.on(Node.EventType.TOUCH_END, this.dontBeSwallowed, this, !!this._sv);
		this.node.on(Node.EventType.TOUCH_CANCEL, this.dontBeSwallowed, this, !!this._sv);

		this.node.on(Node.EventType.MOUSE_DOWN, this.dontBeSwallowed, this);
		this.node.on(Node.EventType.MOUSE_MOVE, this.dontBeSwallowed, this);
		this.node.on(Node.EventType.MOUSE_UP, this.dontBeSwallowed, this);
	}

	onDestroy() {
		this.node.off(Node.EventType.TOUCH_START, this.dontBeSwallowed, this, !!this._sv);
		this.node.off(Node.EventType.TOUCH_MOVE, this.dontBeSwallowed, this, !!this._sv);
		this.node.off(Node.EventType.TOUCH_END, this.dontBeSwallowed, this, !!this._sv);
		this.node.off(Node.EventType.TOUCH_CANCEL, this.dontBeSwallowed, this, !!this._sv);

		this.node.off(Node.EventType.MOUSE_DOWN, this.dontBeSwallowed, this);
		this.node.off(Node.EventType.MOUSE_MOVE, this.dontBeSwallowed, this);
		this.node.off(Node.EventType.MOUSE_UP, this.dontBeSwallowed, this);
	}

	dontBeSwallowed(event: EventMouse | EventTouch) {
		event.preventSwallow = true;
		event.propagationStopped = false;
		event.propagationImmediateStopped = false;
	}
}
