import { _decorator, Node, UIOpacity, UITransform } from 'cc';
import { MyNode, NodeHandler } from '../../utils/node';
import { Data } from '../data/data';

const { ccclass, property } = _decorator;

declare module 'cc' {
    interface Node {
        /**
         * 获取子节点
         * 传入路径或名称
         * '@'开头的节点(唯一化节点)可以直接获取
         *  */
        $: (s: string) => Node | undefined;
        /**获取子节点长度 */
        childCount: number;
        /**同层中的显示顺序,越大越靠前*/
        zIndex: number;
        /**透明度 */
        oparity: number;
        /**ui脚本 */
        ui: UITransform;

        /**
         * getComponent的简写
         * @param classConstructor
         * @returns
         */
        gc: <T>(
            classConstructor: __private._types_globals__Constructor<T> | __private._types_globals__AbstractedConstructor<T>
        ) => T;
        bindData: (data: Data) => void;
        move: (x: number, y: number) => void;
        moveAnchorTo: (x: number, y: number) => void;
        getExtendComponent: (comp: any) => any;
    }
}

Node.prototype.$ = function (s: string) {
    if (!s) return undefined;
    if (s.startsWith('@')) {
        if (!this._cache) this._cache = {};
        if (this._cache[s]) return this._cache[s];
        this._cache[s] = maid.util.node.find(this, s);
        return this._cache[s];
    }
    return new Proxy(this.getChildByPath(s), NodeHandler) as MyNode;
};

Node.prototype.move = function (x: number, y: number) {
    this.setPosition(this.position.x + x, this.position.y + y);
    this.emit('node-moving');
};

Node.prototype.getExtendComponent = function (comp: any) {
    for (let i = 0; i < this.components.length; i++) {
        if (this.components[i] instanceof comp) return this.components[i];
    }
};

Node.prototype.moveAnchorTo = function (x: number | null | undefined, y: number | null | undefined) {
    let ui = this.getComponent(UITransform);
    if (ui) {
        if (x === null || x === undefined) x = ui.anchorX;
        if (y === null || y === undefined) y = ui.anchorY;
        this.move((x - ui.anchorX) * ui.width, (y - ui.anchorY) * ui.height);
        ui.anchorX = x;
        ui.anchorY = y;
    }
};

Object.defineProperty(Node.prototype, 'oparity', {
    configurable: true,
    enumerable: false,
    set(value) {
        let sp = this.getComponent(UIOpacity);
        if (!sp) sp = this.addComponent(UIOpacity);
        sp.opacity = value;
    },
    get() {
        let sp = this.getComponent(UIOpacity);
        if (!sp) sp = this.addComponent(UIOpacity);
        return sp.opacity;
    },
});

Object.defineProperty(Node.prototype, 'ui', {
    configurable: true,
    enumerable: false,
    get() {
        return this.getComponent(UITransform);
    },
});

Object.defineProperty(Node.prototype, 'childCount', {
    configurable: true,
    enumerable: false,
    get() {
        return this.children.length;
    },
});

Object.defineProperty(Node.prototype, 'zIndex', {
    configurable: true,
    enumerable: false,
    get() {
        if (this['_zIndex'] === undefined) {
            this['_zIndex'] = 0;
            return this['_zIndex'];
        } else {
            return this['_zIndex'];
        }
    },
    set(value: number) {
        this['_zIndex'] = value;
        let siblingIndex = 0;
        for (let i = 0; i < this.parent.children.length; i++) {
            let item = this.parent.children[i];
            if (item == this) continue;
            if (item.zIndex <= value) {
                siblingIndex = item.getSiblingIndex();
            } else {
                break;
            }
        }
        this.setSiblingIndex(siblingIndex);
    },
});

// let originOparity = Object.getOwnPropertyDescriptor(Node.prototype, "oparity")

// let originGet = originOparity.get

// originOparity.get = function() {

//     return 255

// }

// originOparity.set = function(val:number) {
//     console.log(val)

// }
