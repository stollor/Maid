import { _decorator, Asset, Component, isValid } from 'cc';
import { EDITOR } from 'cc/env';
import { MyNode } from '../../utils/node';
const { ccclass, property } = _decorator;

declare module 'cc' {
    interface Component {
        // _: { [index: string]: Node };
        root: MyNode;
        interData: any;
        dynamicsAssets: Asset[];
        /**
         * 标记动态资源
         */
        markAsset: (asset: Asset) => void;
        /**
         * 标记动态资源s
         */
        markAssets: (assets: Asset[]) => void;
        /**
         * 释放动态资源
         * 会在组件销毁时调用
         */
        releaseAssets: () => void;
        /**
         * 获取子节点
         * 传入路径或名称
         * '@'开头的节点(唯一化节点)可以直接获取
         *  */
        $: (s: string) => Node | undefined;
    }
}

// Component.prototype.$ = function (s: string) {
//     return this.node?.$(s);
// };

/**
 * 标记动态资源
 */
Component.prototype.markAsset = function (_asset: Asset) {
    if (!this.dynamicsAssets) this.dynamicsAssets = [];
    if (isValid(_asset)) {
        _asset.addRef();
        this.dynamicsAssets.push(_asset);
    }
};

/**
 * 标记动态资源s
 */
Component.prototype.markAssets = function (_assets: Asset[]) {
    for (const _asset of _assets) {
        this.markAsset(_asset);
    }
};

/**
 * 释放动态资源
 * 会在组件销毁时调用
 */
Component.prototype.releaseAssets = function () {
    if (!this.dynamicsAssets || this.dynamicsAssets.length < 1) return;
    for (let index = 0; index < this.dynamicsAssets.length; index++) {
        if (isValid(this.dynamicsAssets[index])) {
            this.dynamicsAssets[index].decRef();
        }
    }
    this.dynamicsAssets = [];
};

let oldDestory = Component.prototype.destroy;
Component.prototype.destroy = function () {
    if (!EDITOR) {
        this?.releaseAssets?.();
    }
    return oldDestory.apply(this);
};

Object.defineProperty(Component.prototype, 'root', {
    configurable: true,
    enumerable: false,
    get() {
        if (this._proxy) return this._proxy;
        this._proxy = new Proxy(this.node, {
            get: (target: Node, property: string, receiver: any) => {
                // 如果属性以 $ 开头,则尝试从 this._nodes 中获取对应的节点
                if (property.startsWith('$$')) {
                    return this.node.$(property.replace('$$', '@'));
                } else if (property.startsWith('$')) {
                    return this.node.$(property.replace('$', ''));
                }
                // 否则,使用原有的属性访问逻辑
                return Reflect.get(target, property, receiver);
            },
        });
        return this._proxy;
    },
});
