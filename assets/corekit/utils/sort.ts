/**
 * 对对象内元素排序
 * 类似：{ {index:1},{index:2},{index:3},{index:4}} 这样的
 * @param obj
 * @param key 排序的key
 * @param ascend 上升
 * @returns
 */
export function sortObject(obj: object, key: string, ascend: boolean = true) {
	let arr = [];
	for (let k in obj) {
		arr.push(obj[k]);
	}
	arr.sort((a, b) => {
		if (ascend) {
			return a[key] - b[key];
		} else {
			return b[key] - a[key];
		}
	});
	return arr;
}

/*
 * 适用于object列表的多重排序
 * obj:需要被排序的队列
 * 排序的依据,true升序false降序
 */
export function sortObjects<T>(obj: T[], ...props: [((data: any) => number) | string, boolean | number][]) {
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
				aV = (props[i][0] as (data: any) => number)(a);
				bV = (props[i][0] as (data: any) => number)(b);
			} else {
				aV = a[props[i][0] as string];
				bV = b[props[i][0] as string];
			}
			if (aV > bV) {
				return props[i][1] as number;
			} else if (aV < bV) {
				return -props[i][1] as number;
			}
		}
		return 0;
	}

	obj.sort((a: T, b: T) => {
		return arraryCmp(a, b);
	});
}
