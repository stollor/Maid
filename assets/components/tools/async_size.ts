import { _decorator, ccenum, CCFloat, Component, Node, UITransform } from 'cc';
const { ccclass, property, executeInEditMode, menu, requireComponent } = _decorator;

enum AsyncSizeType {
	OnlyWeight = 1 << 0,
	OnlyHeight = 1 << 1,
	All = (1 << 0) | (1 << 1),
}
ccenum(AsyncSizeType);

@ccclass('AsyncSize')
@menu('maid/tools/AsyncSize')
@executeInEditMode(true)
@requireComponent(UITransform)
export class AsyncSize extends Component {
	/**来源目标 */
	@property(UITransform) uiOriginObj!: UITransform;
	/**应用对象 */
	@property(UITransform) _uiTargetObj!: UITransform;
	get uiTargetObj() {
		if (!this._uiTargetObj) {
			this._uiTargetObj = this.node.getComponent(UITransform)!;
		}
		return this._uiTargetObj;
	}
	/**type */
	@property({ type: AsyncSizeType }) sizeType: AsyncSizeType = AsyncSizeType.All;

	@property(CCFloat) _maxHeight: number = -1;
	/**最大高度 -1 则无限制*/
	@property({
		type: CCFloat,
		visible: function () {
			return !!(this.sizeType & AsyncSizeType.OnlyHeight);
		},
	})
	get maxHeight() {
		return this._maxHeight;
	}
	set maxHeight(value) {
		this._maxHeight = value;
		this.onSizeChange();
	}
	/**最大宽度 -1 则无限制*/
	@property(CCFloat) _maxWeight: number = -1;
	@property({
		type: CCFloat,
		visible: function () {
			return !!(this.sizeType & AsyncSizeType.OnlyWeight);
		},
	})
	get maxWeight() {
		return this._maxWeight;
	}
	set maxWeight(value) {
		this._maxWeight = value;
		this.onSizeChange();
	}

	/**高度偏移值*/
	@property(CCFloat) _offsetHeight: number = 0;
	/**高度偏移值*/
	@property({
		type: CCFloat,
		visible: function () {
			return !!(this.sizeType & AsyncSizeType.OnlyHeight);
		},
	})
	get offsetHeight() {
		return this._offsetHeight;
	}

	set offsetHeight(value) {
		this._offsetHeight = value;
		this.onSizeChange();
	}

	/**宽度偏移值 */
	@property(CCFloat) _offsetWight: number = 0;
	/**宽度偏移值 */
	@property({
		type: CCFloat,
		visible: function () {
			return !!(this.sizeType & AsyncSizeType.OnlyWeight);
		},
	})
	get offsetWight() {
		return this._offsetWight;
	}

	set offsetWight(value) {
		this._offsetWight = value;
		this.onSizeChange();
	}

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
