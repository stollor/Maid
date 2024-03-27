/*
 * 判断是否是类实例,可以区别简单的object和类实例
 * @param obj
 * @returns
 */
export function isClassInstance(obj: any): boolean {
	return (
		obj !== null && typeof obj === 'object' && obj.constructor !== Object && Object.getPrototypeOf(obj) !== Object.prototype
	);
}
