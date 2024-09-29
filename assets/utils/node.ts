import { Color, Layers, Node, Sprite, SpriteFrame, Texture2D, UITransform, Widget, assetManager, instantiate } from 'cc';

export type MyNode = Node & { [index: string]: MyNode };

export const NodeHandler: ProxyHandler<Node> = {
    get: (target: Node, property: string, receiver) => {
        // 如果属性以 $ 开头,则尝试从 this._nodes 中获取对应的节点
        if (property.startsWith('$$')) {
            return target.$(property.replace('$$', '@'));
        } else if (property.startsWith('$')) {
            return target.$(property.replace('$', ''));
        }else if (property.startsWith('cmp')) {
            return target.getComponent(property.replace('$', ''));
        }

        if (property == 'copy') {
            return new Proxy(instantiate(target), NodeHandler);
        }

        // 确保属性存在
        if (!(property in target)) {
            //throw new Error(`Node 中不存在属性: ${property} `);
        }

        // 调用目标对象的方法
        return target[property];
    },
};

export class NodeUtil {
    find(node: Node, name: string): MyNode | undefined {
        if (!node.children || node.children.length === 0) {
            return undefined;
        }

        for (const child of node.children) {
            if (child.name === name) {
                return new Proxy(child, NodeHandler) as MyNode;
            }

            const found = this.find(child, name);
            if (found) {
                return new Proxy(found, NodeHandler) as MyNode;
            }
        }

        return undefined;
    }

    /**
     * 获得一个顶级UI节点
     * @param name 节点名称
     */
    public getLayerNode(name: string = 'layer') {
        let node = new Node();
        node.layer = Layers.Enum.UI_2D;
        node.name = name;
        this.addWidgetFull(node);
        return node;
    }

    public getUINode(name: string = 'uinode') {
        let node = new Node();
        node.layer = Layers.Enum.UI_2D;
        node.name = name;
        let ui = node.addComponent(UITransform);
        ui.setAnchorPoint(0.5, 0.5);
        ui.setContentSize(100, 100);
        return node;
    }

    /**
     * 增加Widget 组件,并适配全屏
     * @param node
     * @returns widget
     */
    public addWidgetFull(node: Node) {
        let sp = node.addComponent(Widget);
        sp.isAlignTop = true;
        sp.isAlignBottom = true;
        sp.isAlignLeft = true;
        sp.isAlignRight = true;
        sp.top = 0;
        sp.bottom = 0;
        sp.left = 0;
        sp.right = 0;
        return sp;
    }

    /**
     * 添加Sprite,并设置默认颜色
     * @param node
     * @param color 颜色
     * @returns Sprite
     */
    public addSpriteColor(node: Node, color: string) {
        let sp = node.addComponent(Sprite);
        if (!sp.spriteFrame) {
            assetManager.loadAny('', (err: any, frame: SpriteFrame) => {
                sp.spriteFrame = frame;
            });
        }
        sp.color = new Color(color);
        return sp;
    }

    public async getBase64Data(base64: string, cb) {
        var img = new Image();
        img.onload = () => {
            var newFrame = new SpriteFrame();
            var texture = new Texture2D();
            texture.reset({
                width: img.width,
                height: img.height,
            });
            texture.uploadData(img, 0, 0);
            newFrame.texture = texture;
            cb(newFrame);
        };
        img.onerror = (err) => {
            console.warn('base64 img err');
        };
        if ((<any>base64).startsWidth !== undefined && base64.startsWith('data:image')) {
            img.src = base64;
        } else {
            img.src = 'data:image/png;base64,' + base64;
        }
    }
}
