import { director, sys } from 'cc';
import { CONST } from './const/const';
import { Base } from './corekit/base/view-base';
import { AssetsManager } from './corekit/manager/assets/assets-manager';
import { BundleManager } from './corekit/manager/assets/bundle-manager';
import { AudioManager } from './corekit/manager/audio-manger';
import { NodePoolManager } from './corekit/manager/catch/node-pool-manager';
import { DebugManger } from './corekit/manager/debug-manger';
import { EventManager } from './corekit/manager/event-manger';
import { GlobalManager } from './corekit/manager/global-manger';
import { MouseManger } from './corekit/manager/mouse-manger';
import { UIManager } from './corekit/manager/ui-manager';
import { Utils } from './utils';

export class Maid {
    static Base: typeof Base;
    CONST: typeof CONST;
}

declare module './' {
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

declare global {
    var maid: Maid;
}

globalThis.maid = new Maid();
globalThis.maid.CONST = CONST; // 全局变量

export * from './const/const';
export * from './const/enum';
export * from './const/interface';
export * from './corekit/base/ui-base';
export * from './corekit/base/view-base';
export * from './corekit/data/data';
export * from './corekit/decorater/function';
export * from './corekit/define/ui';
export * from './corekit/utils/promise';
