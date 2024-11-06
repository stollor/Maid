import { _decorator, CCString, Component, Node } from 'cc';
const { ccclass, property, menu, executeInEditMode } = _decorator;

@ccclass('UIState')
@executeInEditMode(true)
export default class UIState extends Component {
    @property _stateData: Map<string, {}>;
    @property(CCString) _nowState: string = 'define';
    @property({ type: CCString, displayName: '当前状态' })
    set nowState(index) {
        this._nowState = index;
        this.onUse(index);
    }
    get nowState() {
        return this._nowState;
    }

    @property({ type: CCString, displayName: '将当前UI状态保存为key' })
    set opt(val) {
        this.onSave(val);
    }
    get opt() {
        return '';
    }

    @property({ type: CCString, displayName: '删除状态' })
    set del(val) {
        this.onDelete(val);
    }
    get del() {
        return '';
    }

    @property({ type: CCString, multiline: true, readonly: true, displayName: '所有状态key' })
    allState: String = 'define';

    onSave(key: string) {
        if (!this._stateData) this._stateData = new Map();
        let data = this._stateData.get(key);
        if (!data) {
            data = {};
            this._stateData.set(key, data);
        }
        this._onSave(data, this.node);
        this.refreshAllState();
    }

    _onSave(data: any, node: Node) {
        data[node.uuid] = node.active;
        node.children.forEach((item) => this._onSave(data, item));
    }

    onUse(key) {
        if (!this._stateData) this._stateData = new Map();
        let data = this._stateData.get(key);
        if (data) {
            this._onUse(data, this.node);
        }
    }

    _onUse(data, node: Node) {
        node.active = !!data[node.uuid];
        node.children.forEach((item) => this._onUse(data, item));
    }

    onDelete(key: string) {
        if (!this._stateData) this._stateData = new Map();
        this._stateData.delete(key);
        this.refreshAllState();
        if (this._nowState == key) {
            this.nowState = 'define';
        }
    }

    refreshAllState() {
        if (!this._stateData) this._stateData = new Map();
        this.allState = '';
        for (let [key, value] of this._stateData) {
            this.allState += key + '\n';
        }
    }

    protected start(): void {
        this.opt = 'define';
    }
}
