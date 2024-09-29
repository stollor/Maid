import { CCFloat, Component, Label, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MemoryUtil')
export class MemoryUtil extends Component {
	@property(Label) lbLimit: Label | null = null;
	@property(Label) lbTotal: Label | null = null;
	@property(Label) lbUsed: Label | null = null;
	@property(CCFloat) inter: number = 1;

	private _unit = 2;
	private _unit2 = ['B', 'KB', 'MB', 'GB'];
	//---运算复用---
	private _size = 0;
	private _limit = 0;
	private _total = 0;
	private _used = 0;

	start() {
		this.node.on('click', this.onClick, this);
	}

	onEnable() {
		this.schedule(this.refresh, this.inter);
	}

	onDisable() {
		this.unschedule(this.refresh);
	}

	onClick() {
		this._unit = (this._unit + 1) % 4;
		this._size = 1024 ** this._unit;
	}

	refresh() {
		this.refresMemory();
		this.refreshLabel();
	}

	refresMemory() {
		//@ts-ignore
		this._limit = globalThis.window.performance.memory.jsHeapSizeLimit / this._size;
		//@ts-ignore
		this._total = globalThis.window.performance.memory.totalJSHeapSize / this._size;
		//@ts-ignore
		this._used = globalThis.window.performance.memory.usedJSHeapSize / this._size;
	}

	refreshLabel() {
		if (this.lbLimit) {
			this.lbLimit.string = this._limit.toFixed(2) + this._unit2[this._unit];
		}
		if (this.lbTotal) {
			this.lbTotal.string = this._total.toFixed(2) + this._unit2[this._unit];
		}
		if (this.lbUsed) {
			this.lbUsed.string = this._used.toFixed(2) + this._unit2[this._unit];
		}
	}
}
