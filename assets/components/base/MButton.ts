import { _decorator, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MButton')
export class MButton extends Button {
	protected _transition = Button.Transition.SCALE;
	protected _duration = 0.05;
	protected _zoomScale = 1.05;
}
