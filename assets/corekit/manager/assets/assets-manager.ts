import { Asset, AssetManager, Constructor } from 'cc';
import { Singleton } from '../../base/singleton';
import { catchAsync } from '../../decorater/function';
import { BundleManager } from './bundle-manager';

const AskUrl = <T>(url: string, asset?: Constructor<T>) => {
	return url + asset ? asset.toString() : 'none';
};

export class AssetsManager extends Singleton {
	private _bundleManager: BundleManager;
	public defaultBundleName: string = 'resources';
	private _askingMap: Map<string, any> = new Map(); //资源缓存

	//ype?: Constructor<Asset> | null
	/**获取缓存 */
	private getCache<T extends Asset>(bundle: AssetManager.Bundle, url: string, type?: Constructor<T>) {
		const info = bundle.getInfoWithPath(url, type);
		if (info) {
			return (bundle.get(info.uuid) as T) || null;
		}
		return null;
	}

	constructor() {
		super();
		this._bundleManager = BundleManager.getInstance();
	}

	get bundleMgr(): BundleManager {
		return this._bundleManager;
	}

	@catchAsync('加载资源')
	public async load<T extends Asset>(
		url: string,
		type?: Constructor<T>,
		bundleName: string = this.defaultBundleName
	): Promise<T> {
		if (!bundleName) throw new Error('bundleName is empty');
		if (!url) throw new Error('url is empty');
		const bundle = await this._bundleManager.getBundle(bundleName);
		if (this._askingMap.has(AskUrl(url, type))) return this._askingMap.get(AskUrl(url, type));
		if (this.getCache<T>(bundle, url, type)) return this.getCache<T>(bundle, url, type);
		const asset = new Promise<T>((resolve, reject) => {
			bundle.load<T>(url, (err: any, asset: T) => {
				this._askingMap.delete(AskUrl(url, type));
				if (err) reject(err);
				else resolve(asset as T);
			});
		});
		this._askingMap.set(AskUrl(url, type), asset);
		return asset;
	}

	@catchAsync('释放资源')
	public async release<T extends Asset>(url: string, bundleName: string = this.defaultBundleName, type?: Constructor<T>) {
		const bundle = await this._bundleManager.getBundle(bundleName);
		bundle.release(url, type);
	}

	@catchAsync('加载文件夹')
	public async loadDir(dir: string, bundleName: string = this.defaultBundleName) {
		if (!bundleName) throw new Error('bundleName is empty');
		if (!dir) throw new Error('dir is empty');
		const bundle = await this._bundleManager.getBundle(bundleName);
		const asset = new Promise((resolve, reject) => {
			bundle.loadDir(dir, (err: any, data: Asset[]) => {
				if (err) reject(err);
				else resolve(data);
			});
		});
		return asset;
	}
}
