import { Node } from 'cc';

export class ToolUtil {
	//object 多重排序
	sortObjects(obj: any, ...props: any[]) {
		props = props.map((prop) => {
			if (!(prop instanceof Array)) {
				prop = [prop, true];
			}
			if (prop[1]) {
				prop[1] = 1;
			} else {
				prop[1] = -1;
			}
			return prop;
		});

		function arraryCmp(a: any, b: any) {
			for (let i = 0; i < props.length; i++) {
				let aV, bV;
				if (typeof props[i][0] == 'function') {
					aV = props[i][0](a);
					bV = props[i][0](b);
				} else {
					aV = a[props[i][0]];
					bV = b[props[i][0]];
				}
				if (aV > bV) {
					return props[i][1];
				} else if (aV < bV) {
					return -props[i][1];
				}
			}
			return 0;
		}

		obj.sort((a: any, b: any) => {
			return arraryCmp(a, b);
		});
	}

	//object排序
	sortObject(obj: any, key: string, isAsc: boolean = true) {
		let arr = [];
		for (let k in obj) {
			arr.push(obj[k]);
		}
		arr.sort((a, b) => {
			if (isAsc) {
				return a[key] - b[key];
			} else {
				return b[key] - a[key];
			}
		});
		return arr;
	}

	/**
	 *克隆function
	 * @param func
	 * @returns
	 */
	cloneFunction(func: Function) {
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
	 * 克隆anyone. 注意:遇到Node时会返回其指针(索引)而不是克隆
	 * @param obj
	 * @param hash
	 * @returns
	 */
	deepClone<T extends object>(obj: T, hash = new WeakMap()): T {
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
	 * 判断是否是类实例,可以区别简单的object和类实例
	 * @param obj
	 * @returns
	 */
	isClassInstance(obj: any): boolean {
		return obj !== null && typeof obj === 'object' && obj.constructor !== Object && Object.getPrototypeOf(obj) !== Object.prototype;
	}

	/**
	 * 获取富文本打字机数组
	 * @param str 传入富文本
	 * @returns 返回字符串数组(0->leng:最长->最短)
	 */
	public GetRichTextArrary(str: string) {
		let charArr = str.replace(/<.+?\/?>/g, '').split('');
		let tempStrArr = [str];

		for (let i = charArr.length; i > 1; i--) {
			let curStr = tempStrArr[charArr.length - i];
			let lastIdx = curStr.lastIndexOf(charArr[i - 1]);
			let prevStr = curStr.slice(0, lastIdx);
			let nextStr = curStr.slice(lastIdx + 1, curStr.length);

			tempStrArr.push(prevStr + nextStr);
		}
		return tempStrArr;
	}

	/**
	 * 规范数字进制
	 * @param value (数量)
	 * @param size  保留小数位数
	 * @returns
	 */
	public numberFormat2(value: number, size: number = 1): string {
		const param = {};
		const k = 1000;
		const sizes = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
		if (value < k) {
			param['value'] = value.toFixed(size);
			param['unit'] = '';
		} else {
			const i = Math.floor(Math.log10(value) / Math.log10(k));
			param['value'] = Math.floor((value / Math.pow(k, i)) * Math.pow(10, size)) / Math.pow(10, size);
			param['unit'] = sizes[i];
		}
		return param['value'] + param['unit'];
	}

	/*
	 * 对日期进行格式化， 和C#大致一致 默认yyyy-MM - dd HH: mm: ss
	 * 可不带参数 一个日期参数 或一个格式化参数
	 * @param date 要格式化的日期
	 * @param format 进行格式化的模式字符串
	 * 支持的模式字母有：
	 * y: 年,
	 * M: 年中的月份(1 - 12),
	 * d: 月份中的天(1 - 31),
	 * H: 小时(0 - 23),
	 * h: 小时(0 - 11),
	 * m: 分(0 - 59),
	 * s: 秒(0 - 59),
	 * f: 毫秒(0 - 999),
	 * q: 季度(1 - 4)
	 * @return String
	 * @author adswads@gmail.com
	 */
	public static dateFormat(date?: any, format?: string): string {
		//无参数
		if (date == undefined && format == undefined) {
			date = new Date();
			format = 'yyyy-MM-dd HH:mm:ss';
		}
		//无日期
		else if (typeof date == 'string') {
			format = date;
			date = new Date();
		}
		//无格式化参数
		else if (format === undefined) {
			format = 'yyyy-MM-dd HH:mm:ss';
		} else {
		}
		//没有分隔符的特殊处理

		let map = {
			y: date.getFullYear() + '', //年份
			M: date.getMonth() + 1 + '', //月份
			d: date.getDate() + '', //日
			H: date.getHours(), //小时 24
			m: date.getMinutes() + '', //分
			s: date.getSeconds() + '', //秒
			q: Math.floor((date.getMonth() + 3) / 3) + '', //季度
			f: date.getMilliseconds() + '', //毫秒
		};
		//小时 12
		if (map['H'] > 12) {
			map['h'] = map['H'] - 12 + '';
		} else {
			map['h'] = map['H'] + '';
		}
		map['H'] += '';

		let reg = 'yMdHhmsqf';
		let all = '',
			str = '';
		for (let i = 0, n = 0; i < reg.length; i++) {
			n = format.indexOf(reg[i]);
			if (n < 0) {
				continue;
			}
			all = '';
			for (; n < format.length; n++) {
				if (format[n] != reg[i]) {
					break;
				}
				all += reg[i];
			}
			if (all.length > 0) {
				if (all.length == map[reg[i]].length) {
					str = map[reg[i]];
				} else if (all.length > map[reg[i]].length) {
					if (reg[i] == 'f') {
						str = map[reg[i]] + this.charString('0', all.length - map[reg[i]].length);
					} else {
						str = this.charString('0', all.length - map[reg[i]].length) + map[reg[i]];
					}
				} else {
					switch (reg[i]) {
						case 'y':
							str = map[reg[i]].substr(map[reg[i]].length - all.length);
							break;
						case 'f':
							str = map[reg[i]].substr(0, all.length);
							break;
						default:
							str = map[reg[i]];
							break;
					}
				}
				format = format.replace(all, str);
			}
		}
		return format;
	}

	/**
	 * 获取重复count的str
	 * @param str
	 * @param count
	 * @returns
	 */
	public static charString(str: string, count: number): string {
		var result: string = '';
		while (count--) {
			result += str;
		}
		return result;
	}

	/**
	 * 填充str到指定长度
	 * @param str 传入字符串
	 * @param leng 目标长度
	 * @param filler 填充物
	 * @returns
	 */
	public static fillString(str, leng, filler) {
		if (str.length >= leng) return str;
		return this.charString(filler, leng - str.length) + str;
	}

	/**深拷贝 ps:不能拷贝方法,只能拷贝数据
	 * @param obj  拷贝对象
	 */
	public static deepCopy1(obj: any): any {
		var a = JSON.stringify(obj);
		var newobj = JSON.parse(a);
		return newobj;
	}
}
