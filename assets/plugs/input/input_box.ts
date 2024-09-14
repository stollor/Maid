import { Button, Component, EventHandler, EventKeyboard, Input, KeyCode, Label, Node, _decorator, input, sys } from 'cc';
import { InputTool } from './tool';
const { ccclass, property } = _decorator;

enum InputModel {
    en = 'EN',
    cn = '中',
}

@ccclass('InputBox')
export class InputBox extends Component {
    @property(Label) label!: Label;
    @property(Label) Model!: Label;
    @property(Node) ModelSwitch!: Node;
    @property({ type: [EventHandler], displayName: '输入时' }) inputChang: EventHandler[] = [];
    @property({ type: [EventHandler], displayName: '完成后' }) inputOver: EventHandler[] = [];
    private _string: string = '';
    private _stringCache: string = '';
    private _flash: string = ' ';
    private _flashInter: number = 0.45;
    /**
     * rang [1,length+1]  -1表示默认值,默认为 length+1
     */
    private _flashPos: number = -1;
    private _frameSum: number = 0;
    private _historyPos: number = -1;
    private _pressKey: { [index: number]: boolean } = {};

    private _inputModel: InputModel = InputModel.en;
    get string() {
        return this._string;
        //offest
    }

    set string(val: string) {
        this._string = val;
    }

    public shift: boolean = false;
    public focus: boolean = false;

    protected start(): void {
        this.node.on(Button.EventType.CLICK, this.onFocus, this);
        this.ModelSwitch.on(Button.EventType.CLICK, this.onSwitchModel, this);
    }

    onFocus() {
        this.focus = true;
        input.on(Input.EventType.KEY_UP, this.onkeyUp, this);
        input.on(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.MOUSE_DOWN, this.offFocus, this);
    }

    offFocus() {
        this.focus = false;
        input.off(Input.EventType.KEY_UP, this.onkeyUp, this);
        input.off(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.MOUSE_DOWN, this.offFocus, this);
    }

    onKeyDown(event: EventKeyboard) {
        this._pressKey[event.keyCode] = true;
        if (event.keyCode == KeyCode.SHIFT_LEFT) {
            this.onSwitchModel();
        }
        if (event.keyCode == KeyCode.CAPS_LOCK) {
            this.shift = true;
            return;
        }
        if (event.keyCode == KeyCode.ENTER) {
            this.run();
            return;
        }
        if (event.keyCode == KeyCode.DELETE || event.keyCode == KeyCode.BACKSPACE) {
            this.onDelete();
            return;
        } else if (event.keyCode == KeyCode.ARROW_DOWN) {
            this.getHistory(1);
        } else if (event.keyCode == KeyCode.ARROW_UP) {
            this.getHistory(-1);
        } else if (event.keyCode == KeyCode.ARROW_LEFT) {
            this.moveFlash(-1);
        } else if (event.keyCode == KeyCode.ARROW_RIGHT) {
            this.moveFlash(1);
        } else if (event.keyCode == KeyCode.KEY_C && this._pressKey[KeyCode.CTRL_LEFT]) {
            InputTool.copy(this.string);
        } else if (event.keyCode == KeyCode.KEY_V && this._pressKey[KeyCode.CTRL_LEFT]) {
            InputTool.paste((text) => {
                this.input(text);
            });
        } else {
            this.input(InputTool.transfromKeyCodeToChar(event.keyCode, this.shift));
        }
    }

    input(str: string, param?: any) {
        if (str == '') return;
        switch (this._inputModel) {
            case InputModel.en:
                {
                    this._input(str);
                    EventHandler.emitEvents(this.inputChang, this._string, str, true);
                    this.node.emit('InputBox_Input', this._string, str, true);
                }
                break;
            case InputModel.cn:
                {
                    if (param) {
                        this._input(str);
                        this._stringCache = '';
                        EventHandler.emitEvents(this.inputChang, this._string, str, !!param);
                        this.node.emit('InputBox_Input', this._string, str, !!param);
                    } else {
                        if (str == ']' || str == '[' || str == ' ') {
                        } else {
                            this._stringCache = this._stringCache + str;
                        }
                        EventHandler.emitEvents(this.inputChang, this._stringCache, str, !!param);
                        this.node.emit('InputBox_Input', this._string, str, !!param);
                    }
                }
                break;
        }
    }

    _input(str: string) {
        if (this._flashPos < 0) {
            //尾部增加
            this._string = this._string + str;
        } else if (this._flashPos == 1) {
            //头部增加
            this._string = str + this._string;
        } else {
            //中间增加
            this._string = this._string.slice(0, this._flashPos - 1) + str + this._string.slice(this._flashPos - 1);
        }
        if (this._flashPos > 0) {
            this._flashPos += str.length;
        }
    }

    onSwitchModel() {
        if (this._inputModel == InputModel.cn) this._inputModel = InputModel.en;
        else if (this._inputModel == InputModel.en) this._inputModel = InputModel.cn;
        this.Model.string = this._inputModel;
        this._stringCache = '';
    }

    onDelete() {
        var _delete = (onlyInput) => {
            if (this._string.length < 1) return;

            if (this._flashPos < 0) {
                //删除尾部
                this._string = this._string.slice(0, this._string.length - 1);
            } else if (this._flashPos > 1) {
                //删除中间
                this._string = this._string.slice(0, this._flashPos - 2) + this._string.slice(this._flashPos - 1);
                this._flashPos -= 1;
            }
            EventHandler.emitEvents(this.inputChang, this._string, null, onlyInput);
            this.node.emit('InputBox_Input', this._string, null, onlyInput);
        };
        switch (this._inputModel) {
            case InputModel.en:
                {
                    _delete(true);
                }
                break;
            case InputModel.cn:
                {
                    if (this._stringCache.length > 0) {
                        this._stringCache = this._stringCache.slice(0, this._stringCache.length - 1);
                        EventHandler.emitEvents(this.inputChang, this._stringCache, '');
                        this.node.emit('InputBox_Input', this._string, '');
                    } else {
                        _delete(false);
                    }
                }
                break;
        }
    }

    onKeyPressing(event: EventKeyboard) {
        if (event.keyCode == KeyCode.DELETE || event.keyCode == KeyCode.BACKSPACE) {
            this.onDelete();
            return;
        }
        if (event.keyCode == KeyCode.ARROW_LEFT) {
            this.moveFlash(-1);
            return;
        }
        if (event.keyCode == KeyCode.ARROW_RIGHT) {
            this.moveFlash(1);
            return;
        }
    }

    onkeyUp(event: EventKeyboard) {
        this._pressKey[event.keyCode] = false;
        if (event.keyCode == KeyCode.CAPS_LOCK) {
            this.shift = false;
            return;
        }
    }

    getHistory(step: number = -1) {
        let history: string[] = JSON.parse(sys.localStorage.getItem('inputHistory')) ?? [];
        if (this._historyPos == -1) {
            this._historyPos = history.length;
        }
        if (history?.[this._historyPos + step]) {
            this._historyPos = this._historyPos + step;
            this._string = history?.[this._historyPos];
            this._flashPos = -1;
        } else {
            return;
        }
    }

    moveFlash(dir: number) {
        if (this._flashPos == -1) {
            this._flashPos = this._string.length + 1;
        }
        this._flashPos += dir;
        if (this._flashPos < 1) this._flashPos = 1;
        if (this._flashPos > this._string.length + 1) this._flashPos = this._string.length + 1;
    }

    run() {
        let cmd = this._string;
        //保存历史记录
        let history: string[] = JSON.parse(sys.localStorage.getItem('inputHistory')) ?? [];
        while (history.length > 50) {
            history.shift();
        }
        history.push(cmd);
        sys.localStorage.setItem('inputHistory', JSON.stringify(history));
        this._historyPos = -1;
        this._flashPos = -1;
        //执行相关命令
        //...
        EventHandler.emitEvents(this.inputOver, this._string);
        this.node.emit('InputBox_Over', this._string);
        this._string = '';
    }

    protected update(dt: number): void {
        //间隔时间计算
        if (this._frameSum >= this._flashInter) {
            this._frameSum = 0;
            if (this._flash == '|') {
                this._flash = ' ';
            } else {
                this._flash = '|';
            }
        } else {
            this._frameSum += dt;
        }
        if (this.focus) {
            //如果获得焦点
            if (this._flashPos > 1) {
                this.label.string =
                    this._string.slice(0, this._flashPos - 1) + this._flash + this._string.slice(this._flashPos - 1);
            } else if (this._flashPos == 1) {
                //在头部
                this.label.string = this._flash + this._string + this._stringCache;
            } else {
                //在尾部,默认状态
                this.label.string = this._string + this._flash + this._stringCache;
            }
        } else {
            //如果失去焦点
            this.label.string = this._string + this._stringCache;
        }
    }
}
