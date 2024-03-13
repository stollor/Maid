import { _decorator, ccenum, CCFloat, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

enum AsyncSizeType {
    OnlyWeight = 1 << 0,
    OnlyHeight = 1 << 1,
    All = (1 << 0) | (1 << 1),
}
ccenum(AsyncSizeType);

@ccclass('AsyncSize')
export class AsyncSize extends Component {
    /**来源目标 */
    @property(UITransform) uiOriginObj!: UITransform;
    /**应用对象 */
    @property(UITransform) uiTargetObj!: UITransform;
    /**type */
    @property({ type: AsyncSizeType }) sizeType: AsyncSizeType = AsyncSizeType.All;
    /**最大高度 -1 则无限制*/
    @property({
        type: CCFloat,
        visible: function () {
            return !!(this.sizeType & AsyncSizeType.OnlyHeight);
        },
    })
    maxHeight: number = -1;
    /**最大宽度 -1 则无限制*/
    @property({
        type: CCFloat,
        visible: function () {
            return !!(this.sizeType & AsyncSizeType.OnlyWeight);
        },
    })
    maxWeight: number = -1;
    /**高度偏移值*/
    @property({
        type: CCFloat,
        visible: function () {
            return !!(this.sizeType & AsyncSizeType.OnlyHeight);
        },
    })
    offsetHeight: number = 0;
    /**宽度偏移值 */
    @property({
        type: CCFloat,
        visible: function () {
            return !!(this.sizeType & AsyncSizeType.OnlyWeight);
        },
    })
    offsetWight: number = 0;

    start() {
        this.uiOriginObj.node.on(Node.EventType.SIZE_CHANGED, this.onSizeChange, this);
    }

    onSizeChange() {
        if (this.sizeType & AsyncSizeType.OnlyWeight)
            if (this.maxWeight < 0 || this.uiOriginObj.width < this.maxWeight) {
                this.uiTargetObj.width = this.uiOriginObj.width + this.offsetWight;
            } else {
                this.uiTargetObj.width = this.maxWeight + this.offsetWight;
            }
        if (this.sizeType & AsyncSizeType.OnlyHeight) {
            if (this.maxHeight < 0 || this.uiOriginObj.height < this.maxHeight) {
                this.uiTargetObj.height = this.uiOriginObj.height + this.offsetHeight;
            } else {
                this.uiTargetObj.height = this.maxHeight + this.offsetHeight;
            }
        }
    }
}
