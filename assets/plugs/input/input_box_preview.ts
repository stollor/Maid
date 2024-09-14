import { Component, EventTouch, Node, RichText, _decorator } from 'cc';
import { InputBox } from './input_box';
const { ccclass, property } = _decorator;

@ccclass('InputBoxPreview')
export class InputBoxPreview extends Component {
    @property(Node) showBg!: Node;
    @property(RichText) showLabel!: RichText;
    @property(InputBox) input!: InputBox;

    strs = ['open file', 'create new document', 'save changes', 'close application', 'copy selected text'];

    onInput(inputString: string) {
        if (inputString == '') {
            this.showBg.oparity = 0;
            return;
        }
        this.showBg.oparity = 255;
        let strs = this.strs.filter((str) => str.toLowerCase().includes(inputString.toLowerCase()));
        for (let i = 0; i < strs.length; i++) {
            strs[i] = `<on click="onClick" param="${strs[i]}">${strs[i]} </on>`;
        }
        this.showLabel.string = strs.join('<br/>');
    }

    onClick(eventTouch: EventTouch, param: string) {
        if (this.showBg.oparity < 1) return;
        console.log('onClick', param);
        this.input.string = param;
    }
}
