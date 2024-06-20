export function catchAsync(msg: string) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			try {
				return await originalMethod.apply(this, args);
			} catch (error) {
				console?.error(`${msg}异常.${args}, ${propertyKey}:${error} `);
				// 处理错误的逻辑
			}
		};

		return descriptor;
	};
}

export function catchError(msg: string) {
	return function catchError(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = function (...args: any[]) {
			try {
				return originalMethod.apply(this, args);
			} catch (error) {
				console.error(`${msg}异常. ${propertyKey}: ${error}`);
				throw error;
			}
		};

		return descriptor;
	};
}

/**
 * 限制函数输入值的范围
 * @param min 默认0
 * @param max 默认Number.MAX_VALUE
 * @returns
 */
export function range(min: number = 0, max: number = Number.MAX_VALUE) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;
		descriptor.value = function (...args: any[]) {
			for (let i in args) {
				if (typeof args[i] == 'number') {
					args[i] = Math.min(Math.max(args[i], min), max);
				}
			}
			return originalMethod.apply(this, args);
		};
		return descriptor;
	};
}

/**
 * 单例类装饰器
 * 使用后会获取一个静态方法getInstance，返回类型为T，T继承自Singleton<T>
 * @param constructor
 * @returns
 */
export function Singleton<T extends { new (...args: any[]): {} }>(ctr: T) {
	// 导出一个泛型类Singleton，它有一个静态方法getInstance，返回类型为T，T继承自Singleton<T>
	return class SingletonClass extends ctr {
		public static getInstance<T extends {}>(this: new () => T): T {
			// 如果this.instance不存在，则将this.instance赋值为一个新的实例
			if (!(<any>this).instance) {
				(<any>this).instance = new this();
			}
			// 返回this.instance
			return (<any>this).instance;
		}
	} as T & {
		getInstance: () => T;
	};
}

export function MBase<T extends { new (...args: any[]): {} }>(ctr: T) {
	return class Base extends ctr {
		public static getInstance<T extends {}>(this: new () => T): T {
			// 如果this.instance不存在，则将this.instance赋值为一个新的实例
			if (!(<any>this).instance) {
				(<any>this).instance = new this();
			}
			// 返回this.instance
			return (<any>this).instance;
		}
	};
}
