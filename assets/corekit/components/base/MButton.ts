import { _decorator, Button, CCBoolean, ccenum, CCFloat, EventHandler, EventTouch, Node, NodeEventType } from 'cc';
const { ccclass, property } = _decorator;

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
    @property({ type: ButtonClickType }) _clickType: ButtonClickType = ButtonClickType.Default;
    @property({ type: ButtonClickType, displayName: '点击样式', tooltip: '', displayOrder: 1 })
    public get clickType() {
        return this._clickType;
    }
    public set clickType(value: ButtonClickType) {
        this._clickType = value;
    }
    @property({
        type: CCFloat,
        displayName: '长摁触发间隔',
        tooltip: '',
        visible: function () {
            return this.clickType == ButtonClickType.LongPress;
        },
    })
    public LongPressInterval: number = 1;
    @property({ type: CCBoolean, displayName: '允许点击穿透', tooltip: '是否允许点击事件继续向上传递' })
    public allowBubble: boolean = false;

    //继承的属性
    protected _transition = Button.Transition.SCALE;
    protected _duration = 0.05; //默认间隔
    protected _zoomScale = 1.05; //默认缩放

    public _interactable: boolean = true; //永远是true

    //自定义新增属性
    /**玩家设置的是否可点击*/
    public _canClick: boolean = true;
    /**受默认默认间隔控制,控制最小连点间隔 */
    private _canClickInter: boolean = true;
    public get interactable() {
        return this._canClick && this._canClickInter;
    }
    public set interactable(value: boolean) {
        this._canClick = value;
    }

    protected onLoad(): void {
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

    protected _registerNodeEvent(): void {
        this.node.on(NodeEventType.TOUCH_START, this._onTouchBegan, this, this.allowBubble);
        this.node.on(NodeEventType.TOUCH_MOVE, this._onTouchMove, this, this.allowBubble);
        this.node.on(NodeEventType.TOUCH_END, this._onTouchEnded, this, this.allowBubble);
        this.node.on(NodeEventType.TOUCH_CANCEL, this._onTouchCancel, this, this.allowBubble);

        this.node.on(NodeEventType.MOUSE_ENTER, this._onMouseMoveIn, this, this.allowBubble);
        this.node.on(NodeEventType.MOUSE_LEAVE, this._onMouseMoveOut, this, this.allowBubble);

        // this.node.on(XrUIPressEventType.XRUI_HOVER_ENTERED, this._xrHoverEnter, this);
        // this.node.on(XrUIPressEventType.XRUI_HOVER_EXITED, this._xrHoverExit, this);
        // this.node.on(XrUIPressEventType.XRUI_CLICK, this._xrClick, this);
        // this.node.on(XrUIPressEventType.XRUI_UNCLICK, this._xrUnClick, this);
    }

    protected _unregisterNodeEvent(): void {
        this.node.off(NodeEventType.TOUCH_START, this._onTouchBegan, this, this.allowBubble);
        this.node.off(NodeEventType.TOUCH_MOVE, this._onTouchMove, this, this.allowBubble);
        this.node.off(NodeEventType.TOUCH_END, this._onTouchEnded, this, this.allowBubble);
        this.node.off(NodeEventType.TOUCH_CANCEL, this._onTouchCancel, this, this.allowBubble);

        this.node.off(NodeEventType.MOUSE_ENTER, this._onMouseMoveIn, this, this.allowBubble);
        this.node.off(NodeEventType.MOUSE_LEAVE, this._onMouseMoveOut, this, this.allowBubble);

        // this.node.off(XrUIPressEventType.XRUI_HOVER_ENTERED, this._xrHoverEnter, this);
        // this.node.off(XrUIPressEventType.XRUI_HOVER_EXITED, this._xrHoverExit, this);
        // this.node.off(XrUIPressEventType.XRUI_CLICK, this._xrClick, this);
        // this.node.off(XrUIPressEventType.XRUI_UNCLICK, this._xrUnClick, this);
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

    protected _onTouchBegan(event?: EventTouch): void {
        if (!this._interactable || !this.enabledInHierarchy) {
            return;
        }
        //@ts-ignore
        this._pressed = true;
        this._updateState();
        if (event) {
            event.propagationStopped = !this.allowBubble; //this.stopBubble;
        }
        switch (this._clickType) {
            case ButtonClickType.Default:
                {
                }
                break;
            case ButtonClickType.LongPress:
                {
                    let count = 0;
                    this.schedule(() => {
                        this.emitClick(this.node, count++);
                    }, this.LongPressInterval);
                }
                break;
        }
    }

    protected _onTouchMove(event?: EventTouch): void {
        super._onTouchMove(event);
        if (event) {
            event.propagationStopped = !this.allowBubble;
        }
    }

    protected _onTouchEnded(event?: EventTouch): void {
        if (!this._interactable || !this.enabledInHierarchy) {
            return;
        }

        //@ts-ignore
        if (this._pressed) {
            switch (this._clickType) {
                case ButtonClickType.Default:
                    {
                        if (this.interactable) {
                            EventHandler.emitEvents(this.clickEvents, event);
                            this.emitClick(this.node, event);
                        } else {
                            /**不可交互时的点击响应 */
                            this.node.emit('click_gray', this);
                        }
                    }
                    break;
                case ButtonClickType.LongPress:
                    {
                        this.unscheduleAllCallbacks();
                    }
                    break;
            }
        }
        //@ts-ignore
        this._pressed = false;
        this._updateState();

        if (event) {
            event.propagationStopped = !this.allowBubble; //this.stopBubble;
        }
    }

    protected _onTouchCancel(event?: EventTouch): void {
        if (!this._interactable || !this.enabledInHierarchy) {
            return;
        }
        //@ts-ignore
        if (this._pressed) {
            switch (this._clickType) {
                case ButtonClickType.Default:
                    {
                        //this._canClickInter = true;
                    }
                    break;
                case ButtonClickType.LongPress: {
                    this.unscheduleAllCallbacks();
                }
            }
        }

        //@ts-ignore
        this._pressed = false;
        this._updateState();
    }

    async emitClick(node: Node, arg: any) {
        //@ts-ignore
        let cbinvoker = node._eventProcessor?.bubblingTarget;
        //@ts-ignore
        let list = node._eventProcessor?.bulletingTarget?._callbackTable.click;
        let btn = node.getComponent(Button);
        if (list) {
            btn.interactable = false;
            const rootInvoker = !list.isInvoking;
            list.isInvoking = true;

            const infos = list.callbackInfos;
            for (let i = 0, len = infos.length; i < len; ++i) {
                const info = infos[i];
                if (info) {
                    const callback = info.callback;
                    const target = info.target;
                    // Pre off once callbacks to avoid influence on logic in callback
                    if (info.once) {
                        node.off('click', callback, target);
                    }
                    // Lazy check validity of callback target,
                    // if target is CCObject and is no longer valid, then remove the callback info directly
                    if (!info.check()) {
                        node.off('click', callback, target);
                    } else if (target) {
                        await callback.call(target, arg);
                    } else {
                        await callback(arg);
                    }
                }
            }

            if (rootInvoker) {
                list.isInvoking = false;
                if (list.containCanceled) {
                    list.purgeCanceled();
                }
            }
            btn.interactable = true;
        }
    }
}
