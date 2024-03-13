import { EditBox } from 'cc';

declare module 'cc' {
    interface Editbox {}
}

EditBox._EditBoxImpl.prototype._resize = function () {
    if (this?._delegete?.node) {
        this._delegate.node.hasChangedFlags = 1;
    }
};
