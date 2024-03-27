/**
 *克隆function
 * @param func
 * @returns
 */
export function cloneFunction(func: Function) {
	const cloneFunc = function () {
		//@ts-ignore
		return func.apply(this, arguments);
	};
	Object.getOwnPropertyNames(func).forEach(function (key) {
		const desc = Object.getOwnPropertyDescriptor(func, key);
		//@ts-ignore
		Object.defineProperty(cloneFunc, key, desc);
	});
	Object.setPrototypeOf(cloneFunc, Object.getPrototypeOf(func));
	return cloneFunc;
}

/**
 * 深拷贝
 * 克隆anyone. 注意:遇到Node时会返回其指针(索引)而不是克隆
 * 支持基础类型,正则,
 * @param obj 需要拷贝的对象
 * @param hash 递归缓存数据,调用者不用传
 * @returns
 */
export function deepClone<T extends object>(obj: T, hash = new WeakMap()): T {
	// 返回基础类型
	if (Object(obj) !== obj) {
		return obj;
	}

	// 处理日期对象
	if (obj instanceof Date) {
		return new Date(obj) as T;
	}

	// 处理正则对象
	if (obj instanceof RegExp) {
		return new RegExp(obj) as T;
	}

	// 解决循环引用
	if (hash.has(obj)) {
		return hash.get(obj); // 解决循环引用
	}

	// 处理数组
	if (obj instanceof Array) {
		return obj.map((item) => this.deepClone(item)) as T;
	}

	//处理函数
	if (obj instanceof Function) {
		return this.cloneFunction(obj) as T;
	}

	//处理node
	if (obj instanceof Node) {
		return obj;
		//return instantiate(obj);
	}

	// 处理普通对象和类实例
	const result: any = Object.getPrototypeOf(obj) === Object.prototype ? {} : Object.create(obj.constructor.prototype);
	hash.set(obj, result);

	for (let key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			result[key] = this.deepClone(obj[key] as any, hash);
		}
	}

	return result;
}

/**
 * 浅拷贝
 * ps:不能拷贝方法,只能拷贝数据
 * @param obj  拷贝对象
 */
export function shallowCopy(obj: any): any {
	var a = JSON.stringify(obj);
	var newobj = JSON.parse(a);
	return newobj;
}
