import { Sprite, SpriteFrame, _decorator } from 'cc';
import { AssetsManager } from '../manager/assets/assets-manager';

const { ccclass, property } = _decorator;

declare module 'cc' {
	interface Sprite {
		imgStr: string;
	}
}

Object.defineProperty(Sprite.prototype, 'imgStr', {
	configurable: true,
	enumerable: false,
	async set(value) {
		this.imgStr = value + '/spriteFrame';
		this.spriteFrame = await AssetsManager.getInstance().load<SpriteFrame>(this.imgStr);
	},
	get() {
		return this.imgStr;
	},
});
