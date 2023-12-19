// 导出一个泛型类Singleton，它有一个静态方法getInstance，返回类型为T，T继承自Singleton<T>

export class Singleton {
	// 定义一个静态方法getInstance，参数为this，返回类型为T，T继承自Singleton<T>
	public static getInstance<T extends {}>(this: new () => T): T {
		// 如果this.instance不存在，则将this.instance赋值为一个新的实例
		if (!(<any>this).instance) {
			(<any>this).instance = new this();
			(<any>this).instance?.init?.();
		}
		// 返回this.instance
		return (<any>this).instance;
	}
}
