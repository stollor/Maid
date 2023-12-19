import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

declare module 'cc' {
	interface Component {
		interData: any;
	}
}
