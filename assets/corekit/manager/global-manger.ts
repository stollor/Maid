import { Singleton } from '../decorater/function';

@Singleton
export class GlobalManager {
	static getInstance: () => GlobalManager;
	public timeScale: number = 1;
}
