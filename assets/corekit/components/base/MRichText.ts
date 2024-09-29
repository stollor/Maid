import { CCBoolean, Node, RichText, UITransform, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MRichText')
export class MRichText extends RichText {
    @property(CCBoolean) _MaxWidthFollow!: boolean;
    @property(CCBoolean)
    get MaxWidthFollow() {
        return this._MaxWidthFollow;
    }
    set MaxWidthFollow(val: boolean) {
        this._MaxWidthFollow = val;
        if (val) {
            this.onMaxWidthFollow();
        } else {
            this.offMaxWidthFollow();
        }
    }

    onMaxWidthFollow() {
        this.node.parent.on(Node.EventType.SIZE_CHANGED, this.onMaxWidthChange, this);
        this.onMaxWidthChange();
    }

    offMaxWidthFollow() {
        this.node.parent.off(Node.EventType.SIZE_CHANGED, this.onMaxWidthChange, this);
    }

    onMaxWidthChange() {
        this.maxWidth = this.node?.parent?.getComponent(UITransform)?.width ?? 0;
    }
}
