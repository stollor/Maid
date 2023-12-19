import { Singleton } from '../corekit/base/singleton';
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

export class Utils extends Singleton {
	public draw: DrawUtil;
	public file: FileUtil;
	public math: MathUtil;
	public node: NodeUtil;
	public tool: ToolUtil;
	public tween: TweenUtil;

	constructor() {
		super();
		this.draw = new DrawUtil();
		this.file = new FileUtil();
		this.math = new MathUtil();
		this.node = new NodeUtil();
		this.tween = new TweenUtil();
		this.tool = new ToolUtil();
	}
}

//Maid.prototype.util = Utils.getInstance();
