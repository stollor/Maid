import { KeyCode, Vec3 } from 'cc';
import { InputMethod } from './input_method';

export class InputTool {
    /**
     * 转换cocos KEYCODE 到 字符串
     * @param keyCode
     * @param up
     * @returns
     */
    static transfromKeyCodeToChar(keyCode: KeyCode, up: boolean = false): string {
        if (keyCode >= KeyCode.DIGIT_0 && keyCode <= KeyCode.KEY_Z) {
            return up ? String.fromCharCode(keyCode) : String.fromCharCode(keyCode).toLowerCase();
        }
        if (keyCode >= KeyCode.NUM_0 && keyCode <= KeyCode.NUM_9) {
            return '' + (keyCode - KeyCode.NUM_0);
        }
        switch (keyCode) {
            case KeyCode.TAB:
                return '    ';
            case KeyCode.SPACE:
                return ' ';
            case KeyCode.SEMICOLON:
                return up ? ':' : ';';
            case KeyCode.EQUAL:
                return up ? '+' : '=';
            case KeyCode.COMMA:
                return up ? '<' : ',';
            case KeyCode.DASH:
                return up ? '_' : '-';
            case KeyCode.PERIOD:
                return up ? '>' : '.';
            case KeyCode.SLASH:
                return up ? '?' : '/';
            case KeyCode.BACKSLASH:
                return up ? '|' : '\\';
            case KeyCode.BACK_QUOTE:
                return up ? '~' : '`';
            case KeyCode.BRACKET_LEFT:
                return up ? '{' : '[';
            case KeyCode.BRACKET_RIGHT:
                return up ? '}' : ']';
            case KeyCode.QUOTE:
                return up ? '"' : "'";
            default:
                return '';
        }
    }

    /**
     * 触发复制
     * @param str
     */
    static copy(str: string) {
        let save = function (e) {
            e.clipboardData.setData('text/plain', str);
            e.preventDefault();
        };
        document.addEventListener('copy', save);
        document.execCommand('copy');
        document.removeEventListener('copy', save);
    }

    /**
     * 触发粘贴
     * @param cb
     */
    static paste(cb: Function) {
        navigator.clipboard
            .readText()
            .then((text) => {
                cb(text);
            })
            .catch((err) => {
                console.error('无法读取剪贴板内容:', err);
            });
    }

    /**
     * 判断输入的变量是否是有效数字
     * 有效数字:有意义的数字
     * @param a
     * @returns
     */
    static isValidNumber(varite: any) {
        return !isNaN(Number(varite));
    }

    static _inputMethod: InputMethod;
    /**
     * 外部输入字符,唤起输入法,输入空时自动隐藏输入法
     */
    static input(key: string, add: string, pos: Vec3) {
        if (key) {
            this._inputMethod.node.active = true;
            this._inputMethod.onInput(key, add, false);
            this._inputMethod.node.setPosition(pos);
        } else {
            this._inputMethod.node.active = false;
        }
    }
}
