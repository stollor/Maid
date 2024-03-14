export class MathUtil {
	/**
	 * 映射x到y
	 * @param x
	 * @param y
	 * @param k 增长曲线
	 * @returns
	 */
	static mapTo(x: number, y: number, k = 1) {
		return y * (1 - Math.exp(-k * x));
	}

	/**
	 * 洗牌算法
	 * @param list
	 */
	static shuffle(list: any[]) {
		for (let i = 0; i < list.length; i++) {
			let j = Math.floor(Math.random() * (list.length - i)) + i;
			[list[i], list[j]] = [list[j], list[i]];
		}
	}

	/**
	 * 限制
	 * @param num 传入数字
	 * @param min 最小
	 * @param max 最大
	 * @returns
	 */
	public static limit(num: number, min: number, max: number) {
		return Math.min(Math.max(num, min), max);
	}

	public static swap(list: any[], index1: number, index2: number) {
		let temp = list[index1];
		list[index1] = list[index2];
		list[index2] = temp;
	}

	/**
	 * 删除数组特定元素
	 */
	public static arrRemove<T>(arr: Array<T>, obj: T) {
		if (!arr) return;
		let index = arr.indexOf(obj);
		if (index > -1) {
			arr.splice(index, 1);
		}
	}
}
