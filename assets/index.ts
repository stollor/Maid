export class Maid {}

declare global {
	var maid: Maid;
}

globalThis.maid = new Maid();

export * from './corekit/base/singleton';
export * from './corekit/base/ui-base';
export * from './data/data';
