import { _decorator, CCString, Component, Node } from 'cc';
const { ccclass, property, menu, executeInEditMode } = _decorator;

@executeInEditMode(true)
@ccclass('UIStateItem')
export default class UIStateItem extends Component {
    @property(CCString) key: string = 'define';
    @property([CCString]) _stateData: string[] = [];

    onEnable() {
        this.onUse();
    }

    protected onDisable(): void {}

    start() {
        if (!this._stateData || this._stateData.length < 1) {
            this.onSave();
        }
    }

    onSave() {
        this._stateData = [];
        this._onSave(this.node);
    }

    _onSave(node: Node) {
        if (node.active) this._stateData.push(node.uuid);
        node.children.forEach((item) => this._onSave(item));
    }

    onUse() {
        this._onUse(this.node);
    }

    _onUse(node: Node) {
        node.active = this._stateData.indexOf(node.uuid) >= 0;
        node.children.forEach((item) => this._onUse(item));
    }
}
