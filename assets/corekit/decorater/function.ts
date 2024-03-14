import { MathUtil } from '../../utils/math';

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
			for (let arg of args) {
				if (arg < min || arg > max) {
					maid.debug.error(`参数超出范围: ${arg}`);
					arg = MathUtil.limit(arg, min, max);
				}
			}
			return originalMethod.apply(this, args);
		};
		return descriptor;
	};
}
