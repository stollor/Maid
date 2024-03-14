import { Asset } from 'cc';
import { Singleton } from '../../base/singleton';
import { catchAsync } from '../../decorater/function';
import { BundleManager } from './bundle-manager';

export class AssetsManager extends Singleton {
	private _bundleManager: BundleManager;
	public defaultBundleName: string = 'resources';
	private _cacheMap: Map<string, any> = new Map(); //资源缓存

	constructor() {
		super();
		this._bundleManager = BundleManager.getInstance();
	}

	get bundleMgr(): BundleManager {
		return this._bundleManager;
	}

	@catchAsync('加载资源')
	public async load<T extends Asset>(url: string, bundleName: string = this.defaultBundleName): Promise<T> {
		if (!bundleName) throw new Error('bundleName is empty');
		if (!url) throw new Error('url is empty');
		const bundle = await this._bundleManager.getBundle(bundleName);
		if (this._cacheMap.has(`${bundleName}/${url}`)) return this._cacheMap.get(`${bundleName}/${url}`) as T;
		const asset = new Promise<T>((resolve, reject) => {
			bundle.load<T>(url, (err: any, asset: T) => {
				this._cacheMap.set(url, asset);
				if (err) reject(err);
				else resolve(asset as T);
			});
		});
		this._cacheMap.set(url, asset);
		return asset;
	}

	@catchAsync('释放资源')
	public async release(url: string, bundleName: string = this.defaultBundleName) {
		this._cacheMap.delete(`${bundleName}/${url}`);
		const bundle = await this._bundleManager.getBundle(bundleName);
		bundle.release(url);
	}

	@catchAsync('加载文件夹')
	public async loadDir(dir:string, bundleName: string = this.defaultBundleName){
		if (!bundleName) throw new Error('bundleName is empty');
		if (!dir) throw new Error('dir is empty');
		const bundle = await this._bundleManager.getBundle(bundleName);
		const asset = new Promise((resolve, reject) => {
			bundle.loadDir(dir,(err:any,data:Asset[])=>{
				if (err) reject(err);
				else resolve(data );
			})
		});
		return asset
		
	}
}
