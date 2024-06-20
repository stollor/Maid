import { director, sys } from 'cc';
import { Maid } from '../index';
import { Utils } from '../utils';
import { AssetsManager } from './manager/assets/assets-manager';
import { BundleManager } from './manager/assets/bundle-manager';
import { AudioManager } from './manager/audio-manger';
import { NodePoolManager } from './manager/catch/node-pool-manager';
import { DebugManger } from './manager/debug-manger';
import { EventManager } from './manager/event-manger';
import { GlobalManager } from './manager/global-manger';
import { MouseManger } from './manager/mouse-manger';
import { UIManager } from './manager/ui-manager';

declare module '../index' {
	interface Maid {
		asset: AssetsManager;
		bundl: BundleManager;
		em: EventManager;
		pool: NodePoolManager;
		global: GlobalManager;
		mouse: MouseManger;
		ui: UIManager;
		audio: AudioManager;
		debug: DebugManger;
	}
}

Maid.prototype.util = Utils.getInstance();
Maid.prototype.asset = AssetsManager.getInstance();
Maid.prototype.em = EventManager.getInstance();
Maid.prototype.pool = NodePoolManager.getInstance();
Maid.prototype.bundl = BundleManager.getInstance();
Maid.prototype.global = GlobalManager.getInstance();
Maid.prototype.mouse = MouseManger.getInstance();
Maid.prototype.ui = UIManager.getInstance(); //UIManager.getInstance();
Maid.prototype.audio = AudioManager.getInstance();
Maid.prototype.debug = DebugManger.getInstance();

let oldTick = director.tick.bind(director);
director.tick = function (dt) {
	dt *= maid?.global?.timeScale ?? 1;
	oldTick(dt);
	if (sys.isNative) {
		// @ts-ignore  此处SkeletonAnimation爆红，但是不影响运行
		sp.spine.SkeletonAnimation.setGlobalTimeScale(maid.globalManager.timeScale || 1);
	}
};
