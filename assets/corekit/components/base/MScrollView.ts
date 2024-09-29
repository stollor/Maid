import { CCBoolean, CCFloat, Material, Node, ScrollView, UITransform, Widget, _decorator, assetManager } from 'cc';
import { Direction } from '../../../const/enum';
const { ccclass, property } = _decorator;

@ccclass('MScrollView')
export class MScrollView extends ScrollView {
    @property({
        type: CCBoolean,
        displayName: '弹性',
        tooltip: '是否允许滚动内容超过边界，并在停止触摸后回弹。',
        group: { name: '手感' },
    })
    elastic: boolean;

    @property({
        type: CCFloat,
        displayName: '回弹持续的时间',
        tooltip: '回弹持续的时间，0 表示将立即反弹。',
        group: { name: '手感' },
    })
    bounceDuration: number;
    @property({
        type: CCBoolean,
        displayName: '惯性',
        tooltip: '开启惯性后，在用户停止触摸后滚动多快停止，0表示永不停止，1表示立刻停止。',
        group: { name: '手感' },
    })
    inertia: boolean;

    @property({
        type: CCFloat,
        displayName: '惯性系数',
        tooltip: '开启惯性后，在用户停止触摸后滚动多快停止，0表示永不停止，1表示立刻停止。',
        group: { name: '手感' },
    })
    brake: number;

    @property(CCBoolean) _fadeInTop: boolean = false;
    @property({
        type: CCBoolean,
        displayName: '上侧渐变',
        group: { name: '显示细节' },
        visible: function () {
            return this.vertical;
        },
    })
    get fadeInTop() {
        return this._fadeInTop;
    }
    set fadeInTop(val: boolean) {
        this.fadeInTop = val;
        this._showFade('fadeTop', Direction.Up, val);
    }
    @property({
        type: CCBoolean,
        displayName: '下侧渐变',
        group: { name: '显示细节' },
        visible: function () {
            return this.vertical;
        },
    })
    fadeInBottom: boolean;
    @property({
        type: CCBoolean,
        displayName: '左侧渐变',
        group: { name: '显示细节' },
        visible: function () {
            return this.horizontal;
        },
    })
    fadeInLeft: boolean;
    @property({
        type: CCBoolean,
        displayName: '下侧渐变',
        group: { name: '显示细节' },
        visible: function () {
            return this.horizontal;
        },
    })
    fadeInRight: boolean;

    protected onLoad(): void {
        super.onLoad?.();
        this.node.on(ScrollView.EventType.SCROLLING, this._onScroll, this);
    }

    _showFade(name: string, direction: Direction, show: boolean) {
        let parent = this.content;
        if (!show) {
            parent.getChildByName(name)?.destroy();
            return;
        }
        let node = parent.getChildByName(name) ?? maid.util.node.getUINode(name);
        this._setFadeSprite(node);
        this._setWidget(node, direction);
    }

    _setWidget(node: Node, direction: Direction) {
        let wid = node.getComponent(Widget) || node.addComponent(Widget);
        wid.alignMode = Widget.AlignMode.ALWAYS;
        wid.isAlignTop = direction == Direction.Up;
        wid.isAlignBottom = direction == Direction.Down;
        wid.isAlignLeft = direction == Direction.Left;
        wid.isAlignRight = direction == Direction.Right;
        wid.top = 0;
        wid.bottom = 0;
        wid.left = 0;
        wid.right = 0;
    }

    _setFadeSprite(node) {
        let sp = maid.util.node.addSpriteColor(node, '#FFFFFF');
        if (Editor) {
            Editor.Message.request('asset-db', 'query-uuid', 'db://assets/shader').then((uuid: string) => {
                if (!uuid) {
                    console.warn('没找到渐变shader');
                    return;
                }
                assetManager.loadAny(uuid, (err, imgseet: Material) => {
                    if (err) {
                        console.warn('没找到渐变shader');
                        return;
                    }
                    sp.customMaterial = imgseet;
                });
            });
        } else {
            maid.asset.load('edgeblur').then((data: Material) => {
                sp.customMaterial = data;
            });
        }
    }

    _onScroll(scrollview: ScrollView) {
        let contentY = scrollview.content.position.y;
        let contentH = scrollview.content.getComponent(UITransform).height;
        let contentA = scrollview.content.getComponent(UITransform).anchorY;
        let contentPosY = contentY + contentH * contentA;

        if (contentPosY) {
        }
    }

    /**
     * 获取节点的相对坐标
     * 与锚点无关,子节点最上边与父节点最上边的距离,向上为正,向下为负
     * @param node
     */
    getRelTopPos(node: Node) {}
}
