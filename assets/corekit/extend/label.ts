import { Label } from 'cc';

declare module 'cc' {
    interface Label {
        /**
         * 设置文本
         */
        setStr: (text: string | number) => void;
    }
}

Label.prototype.setStr = function (text: string | number) {
    this.string = String(text);
};
