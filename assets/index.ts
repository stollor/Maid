import { director, sys } from 'cc';
import { CONST } from './const/const';
import { Base } from './corekit/base/view-base';
import { Data } from './corekit/data/data';
import { Database } from './corekit/data/database';
import { AssetsManager } from './corekit/manager/assets/assets-manager';
import { BundleManager } from './corekit/manager/assets/bundle-manager';
import { AudioManager } from './corekit/manager/audio-manger';
import { NodePoolManager } from './corekit/manager/catch/node-pool-manager';
import { DebugManger } from './corekit/manager/debug-manger';
import { EventManager } from './corekit/manager/event-manger';
import { GlobalManager } from './corekit/manager/global-manger';
import { MouseManger } from './corekit/manager/mouse-manger';
import { UIManager } from './corekit/manager/ui-manager';
// import * as TOML from './plugs/toml/j-toml';
import { Utils } from './utils';

declare module './' {
    interface Maid {
        Base: typeof Base;
        CONST: typeof CONST;
        asset: AssetsManager;
        bundl: BundleManager;
        em: EventManager;
        pool: NodePoolManager;
        global: GlobalManager;
        mouse: MouseManger;
        ui: UIManager;
        audio: AudioManager;
        debug: DebugManger;
        Data: typeof Data;
        database: Database;
    }
}

export class Maid {
    static Base: typeof Base;
    CONST: typeof CONST;

    private _utils: Utils;
    get util(): Utils {
        if (!this._utils) this._utils = new Utils();
        return this._utils;
    }

    private _assets: AssetsManager;
    private _bundl: BundleManager;
    private _em: EventManager;
    private _pool: NodePoolManager;
    private _global: GlobalManager;
    private _mouse: MouseManger;
    private _ui: UIManager;
    private _audio: AudioManager;
    private _debug: DebugManger;
    private _database: Database;
    private _globalManager: GlobalManager;
    private _sound: AudioManager;

    /** 资源管理器 */
    get asset(): AssetsManager {
        if (!this._assets) this._assets = new AssetsManager();
        return this._assets;
    }

    /** 包管理器 */
    get bundl(): BundleManager {
        if (!this._bundl) this._bundl = new BundleManager();
        return this._bundl;
    }

    /** 事件管理器 */
    get em(): EventManager {
        if (!this._em) this._em = new EventManager();
        return this._em;
    }

    /** 缓存管理器 */
    get pool(): NodePoolManager {
        if (!this._pool) this._pool = new NodePoolManager();
        return this._pool;
    }

    /** 全局管理器 */
    get global(): GlobalManager {
        if (!this._global) this._global = new GlobalManager();
        return this._global;
    }

    /** 鼠标管理器 */
    get mouse(): MouseManger {
        if (!this._mouse) this._mouse = new MouseManger();
        return this._mouse;
    }

    /** UI管理器 */
    get ui(): UIManager {
        if (!this._ui) this._ui = new UIManager();
        return this._ui;
    }

    /** 音频管理器 */
    get audio(): AudioManager {
        if (!this._audio) this._audio = new AudioManager();
        return this._audio;
    }

    /** 调试管理器 */
    get debug(): DebugManger {
        if (!this._debug) this._debug = new DebugManger();
        return this._debug;
    }

    /** 数据库管理器 */
    get database(): Database {
        if (!this._database) this._database = new Database();
        return this._database;
    }

    /**全局管理器 */
    get globalManager(): GlobalManager {
        if (!this._globalManager) this._globalManager = new GlobalManager();
        return this._globalManager;
    }

    // get toml(): typeof TOML {
    //     return TOML;
    // }
}

// Maid.prototype.util = Utils.getInstance();
// Maid.prototype.asset = AssetsManager.getInstance();
// Maid.prototype.em = EventManager.getInstance();
// Maid.prototype.pool = NodePoolManager.getInstance();
// Maid.prototype.bundl = BundleManager.getInstance();
// Maid.prototype.global = GlobalManager.getInstance();
// Maid.prototype.mouse = MouseManger.getInstance();
// Maid.prototype.ui = UIManager.getInstance(); //UIManager.getInstance();
// Maid.prototype.audio = AudioManager.getInstance();
// Maid.prototype.debug = DebugManger.getInstance();
// Maid.prototype.database = Database.instance = new Database();

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
