import { Button, EventHandler, EventTouch, Vec3 } from 'cc';

declare module 'cc' {
    interface Button {
        /**
         * 停止冒泡,默认true(停止)
         * 需要穿透响应事件时可改为false
         */
        stopBubble: boolean;
    }
}

Object.defineProperty(Button.prototype, 'stopBubble', {
    enumerable: false,
    configurable: true,
    get() {
        if (this._stopBubble == undefined) {
            this._stopBubble = true;
        }
        return this._stopBubble;
    },

    set(val) {
        return (this._stopBubble = val);
    },
});

//@ts-ignore
Button.prototype._onTouchBegan = function (event?: EventTouch) {
    if (!this._interactable || !this.enabledInHierarchy) {
        return;
    }
    this._pressed = true;
    this._updateState();
    if (event) {
        event.propagationStopped = this.stopBubble;
    }
};

//@ts-ignore
Button.prototype._onTouchMove = function (event?: EventTouch) {
    if (!this._interactable || !this.enabledInHierarchy || !this._pressed) {
        return;
    }
    // mobile phone will not emit _onMouseMoveOut,
    // so we have to do hit test when touch moving
    if (!event) {
        return;
    }

    const touch = event.touch;
    if (!touch) {
        return;
    }

    const hit = this.node._uiProps.uiTransformComp!.hitTest(touch.getLocation());

    if (this._transition === 3 && this.target && this._originalScale) {
        if (hit) {
            Vec3.copy(this._fromScale, this._originalScale);
            Vec3.multiplyScalar(this._toScale, this._originalScale, this._zoomScale);
            this._transitionFinished = false;
        } else {
            this._time = 0;
            this._transitionFinished = true;
            this.target.setScale(this._originalScale);
        }
    } else {
        let state;
        if (hit) {
            state = 'pressed';
        } else {
            state = 'normal';
        }
        this._applyTransition(state);
    }

    if (event) {
        event.propagationStopped = this.stopBubble;
    }
};

//@ts-ignore
Button.prototype._onTouchEnded = function (event?: EventTouch) {
    if (!this._interactable || !this.enabledInHierarchy) {
        return;
    }

    if (this._pressed) {
        EventHandler.emitEvents(this.clickEvents, event);
        this.node.emit('click', this);
    }
    this._pressed = false;
    this._updateState();

    if (event) {
        event.propagationStopped = this.stopBubble;
    }
};
