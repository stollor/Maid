import { Node, ccenum } from 'cc';

/** 页面风格参数*/
export interface PageStyleData {
    /**是否遮罩 */
    mask?: boolean;
    /**是否可以点击关闭 */
    close?: boolean;
    /**页面层级 */
    level?: string;
    /**父节点 */
    parent?: Node;
    /**是否缓存 */
    cache?: boolean;
}

/**页面层级 */
export enum PageLevel {
    /**最底层,背景之下*/
    Lowest,
    /**背景层 */
    Background,
    /**较低层 */
    Lower,
    /**默认层 */
    Default,
    /**较高层 */
    Upper,
    /**提示层 */
    Tip,
    /**最高级 */
    Top,
}
ccenum(PageLevel);

/**页面类型 */
export enum PageType {
    /**全屏 */
    Full,
    /**弹窗 */
    PopUp,
    /**提示 */
    Tip,
    /**其他 */
    Other,
}
ccenum(PageType);

/** 弹窗的遮罩类型*/
export enum MaskType {
    /**无遮罩,小心点击穿透*/
    None = 0,
    /**无遮罩,点击空白区域关闭 */
    None_Close = 1,
    /**黑色遮罩,点击关闭界面 */
    Black_Close = 2,
    /**仅黑色遮罩,无响应事件 */
    Black_NoClose = 3,
}
ccenum(MaskType);

/**页面动画类型 */
export enum PageAnimationType {
    /**无动画 */
    None = 0,
    /**从上往下 */
    FromTop = 1,
    /**从下往上 */
    FromBottom = 2,
    /**从左往右 */
    FromLeft = 3,
    /**从右往左 */
    FromRight = 4,
    /**从屏幕内向屏幕外 */
    FromIn = 5,
    /**从屏幕外向屏幕内 */
    FromOut = 6,
    /**从scaleY=0 到 scaleY=1 */
    FromScaleY = 7,
    /**从scaleX=0 到 scaleX=1 */
    FromScaleX = 8,
    /**其他自定义方法 */
    Custom = 9,
}
ccenum(PageAnimationType);

export type listenEvent = [obj: Object, event: string | number, cb: Function, target?: any];
