import { CONST } from './const/const';
import { Base } from './corekit/base/view-base';

export class Maid {
    static Base: typeof Base;
    CONST: typeof CONST;
}

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
export * from './corekit/decorater/function';
export * from './corekit/define/ui';
export * from './data/data';
