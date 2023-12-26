import { Button, CCBoolean, Component, EventMouse, EventTouch, Node, NodeEventType, _decorator } from 'cc';
const { ccclass, property } = _decorator;
/**
 * 允许事件穿透
 */
@ccclass('AllowBubbling')
export class AllowBubbling extends Component {
    @property({
        type: CCBoolean,
        displayName: '开启子节点Button穿透',
        tooltip: '设置子节点的button的stopBubble为false',
    })
    allowChildrenButtonBubbing: Boolean = false;
    onLoad() {
        this.node.on(Node.EventType.MOUSE_DOWN, this.dontBeSwallowed, this);
        this.node.on(Node.EventType.MOUSE_MOVE, this.dontBeSwallowed, this);
        this.node.on(Node.EventType.MOUSE_UP, this.dontBeSwallowed, this);
        this.node.on(Node.EventType.TOUCH_START, this.dontBeSwallowed, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.dontBeSwallowed, this);
        this.node.on(Node.EventType.TOUCH_END, this.dontBeSwallowed, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.dontBeSwallowed, this);

        this.node.on(Node.EventType.CHILD_ADDED, this.onChildAdd, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.MOUSE_DOWN, this.dontBeSwallowed, this);
        this.node.off(Node.EventType.MOUSE_MOVE, this.dontBeSwallowed, this);
        this.node.off(Node.EventType.MOUSE_UP, this.dontBeSwallowed, this);
        this.node.off(Node.EventType.TOUCH_START, this.dontBeSwallowed, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.dontBeSwallowed, this);
        this.node.off(Node.EventType.TOUCH_END, this.dontBeSwallowed, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.dontBeSwallowed, this);
        this.node.off(Node.EventType.CHILD_ADDED, this.onChildAdd, this);
    }

    onEnable() {
        if (this.allowChildrenButtonBubbing)
            this.node.children.forEach((item) => this.setComponentProperties(item, Button, 'stopBubble', false));
    }

    dontBeSwallowed(event: EventMouse | EventTouch) {
        event.preventSwallow = true;
        event.propagationStopped = false;
        event.propagationImmediateStopped = false;
        //this.node.parent.emit(event.type, event);
    }

    onChildAdd(node) {
        if (this.allowChildrenButtonBubbing) {
            this.setComponentProperties(node, Button, 'stopBubble', false);
        }
    }

    setComponentProperties(node: Node, comp: any, prop: any, val: any) {
        let cmp1 = node.getComponent(comp);
        if (cmp1) {
            cmp1[prop] = val;
            node.off(NodeEventType.MOUSE_ENTER);
            node.off(NodeEventType.MOUSE_LEAVE);
        }
        node.children.forEach((item) => this.setComponentProperties(item, comp, prop, val));
    }
}
