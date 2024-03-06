import { Base } from './corekit/base/view-base';

export class Maid {
    static Base: typeof Base;
}

declare global {
    var maid: Maid;
}

globalThis.maid = new Maid();

export * from './corekit/base/singleton';
export * from './corekit/base/ui-base';
export * from './corekit/base/view-base';
export * from './data/data';
