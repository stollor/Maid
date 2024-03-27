import { js } from 'cc';

declare module 'cc' {
	namespace js {
		/**
		 * 是否是有效的数字
		 * @param value 数字,字符串,等
		 * @returns
		 */
		export function isValidNumber(value: any): boolean;
	}
}

js.isValidNumber = function (value: any): boolean {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return true;
	}

	if (typeof value === 'string') {
		// 科学计数法正则表达式
		const scientificNotationRegex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;

		return scientificNotationRegex.test(value) && !Number.isNaN(Number(value));
	}

	return false;
};
