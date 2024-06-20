import { _decorator, Asset, Component, isValid } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass, property } = _decorator;

declare module 'cc' {
	interface Component {
		interData: any;
		dynamicsAssets: Asset[];
		/**
		 * 标记动态资源
		 */
		markAsset: (asset: Asset) => void;
		/**
		 * 标记动态资源s
		 */
		markAssets: (assets: Asset[]) => void;
		/**
		 * 释放动态资源
		 * 会在组件销毁时调用
		 */
		releaseAssets: () => void;
	}
}

/**
 * 标记动态资源
 */
Component.prototype.markAsset = function (_asset: Asset) {
	if (!this.dynamicsAssets) this.dynamicsAssets = [];
	if (isValid(_asset)) {
		_asset.addRef();
		this.dynamicsAssets.push(_asset);
	}
};

/**
 * 标记动态资源s
 */
Component.prototype.markAssets = function (_assets: Asset[]) {
	for (const _asset of _assets) {
		this.markAsset(_asset);
	}
};

/**
 * 释放动态资源
 * 会在组件销毁时调用
 */
Component.prototype.releaseAssets = function () {
	if (!this.dynamicsAssets || this.dynamicsAssets.length < 1) return;
	for (let index = 0; index < this.dynamicsAssets.length; index++) {
		if (isValid(this.dynamicsAssets[index])) {
			this.dynamicsAssets[index].decRef();
		}
	}
	this.dynamicsAssets = [];
};

let oldDestory = Component.prototype.destroy;
Component.prototype.destroy = function () {
	if (!EDITOR) {
		this?.releaseAssets?.();
	}
	return oldDestory.apply(this);
};
