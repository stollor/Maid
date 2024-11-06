import { _decorator, Component, EventHandler, instantiate, Label, Node } from 'cc';
import { pinYinUtil } from './pinyinUtil';
import { InputTool } from './tool';
const { ccclass, property } = _decorator;
@ccclass('InputMethod')
export class InputMethod extends Component {
    @property(Node) CWItem!: Node;
    @property(Node) nContent!: Node;
    @property({ type: [EventHandler], displayName: '选中词后' }) inputChoose: EventHandler[] = [];

    private _CWN: number = 5;
    /** 当前候选词页数index*/
    private _nowCWPI: number = 0;

    private _items: Node[] = [];
    private _hzs: string[] = [];
    start() {
        for (let i = 0; i < this._CWN; i++) {
            this._addLabelItem('');
        }
    }

    onInput(key: string, add: string, isSelfInput: boolean) {
        if (isSelfInput) return;
        if (InputTool.isValidNumber(add) && this.checkIndex(Number(add))) {
            this.onChoose(Number(add) == 0 ? undefined : Number(add));
        } else if (add == ' ') {
            this.onChoose(1);
        } else if (add == '[') {
            this._nowCWPI = Math.max(this._nowCWPI - 1, 0);
            this.refreshItems();
        } else if (add == ']') {
            this._nowCWPI = Math.min(this._nowCWPI + 1, ~~(this._hzs.length / this._CWN));
            this.refreshItems();
        } else {
            this.onInputPinyin(key);
        }
    }

    checkIndex(index) {
        let ni = this._nowCWPI * this._CWN + index;
        return ni <= this._hzs.length && ni >= 1;
    }

    onChoose(index) {
        let ni = Math.max(Math.min(this._nowCWPI * this._CWN + index, this._hzs.length), 1);
        if (this._hzs[ni - 1]) {
            EventHandler.emitEvents(this.inputChoose, this._hzs[ni - 1]);
            this.onInputPinyin('');
        }
    }

    onInputPinyin(pinyin: string) {
        this._hzs = pinYinUtil.getHanzi2(pinyin.replace(/'/g, ''))[0];
        this._nowCWPI = 0;
        this.refreshItems(this._hzs);
    }

    refreshItems(hzs: string[] = this._hzs) {
        this.nContent.children.forEach((item) => (item.getComponent(Label).string = ''));
        let start = this._CWN * this._nowCWPI;
        let end = Math.min(this._CWN * (this._nowCWPI + 1), hzs.length);
        let count = 1;
        for (let i = start; i < end; i++) {
            this._setLabelItem(count - 1, `${count++}.${hzs[i]} `);
        }
    }

    _setLabelItem(i: number, str: string) {
        let item = this.nContent.children[i];
        item.getComponent(Label).string = str;
    }

    _addLabelItem(str: string) {
        let item = instantiate(this.CWItem);
        item.getComponent(Label).string = str;
        this.nContent.addChild(item);
    }
}
