import { Touch, Vec2, view } from 'cc';

declare module 'cc' {
    interface Touch {}
}

let oldGetUILocation = Touch.prototype.getUILocation;
Touch.prototype.getUILocation = function (out?: Vec2) {
    let ret = oldGetUILocation.call(this, out);
    ret.x = ret.x - (view.getVisibleSize().x - view.getDesignResolutionSize().x) / 2;
    ret.y = ret.y - (view.getVisibleSize().y - view.getDesignResolutionSize().y) / 2;
    return ret;
};

let oldGetUIStartLocation = Touch.prototype.getUIStartLocation;
Touch.prototype.getUIStartLocation = function (out?: Vec2) {
    let ret = oldGetUIStartLocation.call(this, out);
    ret.x = ret.x - (view.getVisibleSize().x - view.getDesignResolutionSize().x) / 2;
    ret.y = ret.y - (view.getVisibleSize().y - view.getDesignResolutionSize().y) / 2;
    return ret;
};

let oldGetUIPrevLocation = Touch.prototype.getUIPreviousLocation;
Touch.prototype.getUIPreviousLocation = function (out?: Vec2) {
    let ret = oldGetUIPrevLocation.call(this, out);
    ret.x = ret.x - (view.getVisibleSize().x - view.getDesignResolutionSize().x) / 2;
    ret.y = ret.y - (view.getVisibleSize().y - view.getDesignResolutionSize().y) / 2;
    return ret;
};
