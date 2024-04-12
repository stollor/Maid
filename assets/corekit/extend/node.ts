import { _decorator, Label, Node, UIOpacity, UITransform } from 'cc';
import { Data } from '../../data/data';

const { ccclass, property } = _decorator;

declare module 'cc' {
    interface Node {
        oparity: number;
        ui: UITransform;
        zIndex: number;
        /**获取组件*/
        getCmp: () => void;
        bindData: (data: Data) => void;
        move: (x: number, y: number) => void;
        moveAnchorTo: (x: number, y: number) => void;
        getExtendComponent: (comp: any) => any;
        setStr: (data: string | Data) => void;
    }
}

Node.prototype.getCmp = function (comp: any) {
    return this.getComponent(comp);
};

Node.prototype.setStr = function (data: string | Data) {
    let label = this.getComponent(Label);
    if (!label) return;
    if (typeof data === 'string') {
        label.string = data;
    } else if (data instanceof Data) {
        data.listen(
            (str) => {
                label.string = str;
            },
            this,
            'default'
        );
    }
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

Object.defineProperty(Node.prototype, 'zIndex', {
    configurable: true,
    enumerable: false,
    get() {
        if (this['_zIndex'] === undefined) {
            if (this.getSiblingIndex() == 0) {
                this['_zIndex'] = 0;
            } else {
                this['_zIndex'] = this.parent.children[this.getSiblingIndex() - 1].zIndex + 1;
            }
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
