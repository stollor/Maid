import { Singleton } from '../corekit/decorater/function';
import { Maid } from '../index';
import { DrawUtil } from './draw';
import { FileUtil } from './file';
import { MathUtil } from './math';
import { NodeUtil } from './node';
import { ToolUtil } from './tool';
import { TweenUtil } from './tween';

declare module '../index' {
	interface Maid {
		util: Utils;
	}
}

@Singleton
export class Utils {
	static getInstance: () => Utils;
	public draw: DrawUtil;
	public file: FileUtil;
	public math: MathUtil;
	public node: NodeUtil;
	public tool: ToolUtil;
	public tween: TweenUtil;

	constructor() {
		this.draw = new DrawUtil();
		this.file = new FileUtil();
		this.math = new MathUtil();
		this.node = new NodeUtil();
		this.tween = new TweenUtil();
		this.tool = new ToolUtil();
	}
}

//Maid.prototype.util = Utils.getInstance();
