interface Number {
	formatUnit(size?: number): string;
}

/**
 * 规范数字进制
 * @param value (数量)
 * @param size  保留小数位数
 * @returns
 */
Number.prototype.formatUnit = function (size: number = 1): string {
	const param = {};
	const k = 1000;
	const sizes = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
	if (this < k) {
		param['value'] = this.toFixed(size);
		param['unit'] = '';
	} else {
		const i = Math.floor(Math.log10(this) / Math.log10(k));
		param['value'] = Math.floor((this / Math.pow(k, i)) * Math.pow(10, size)) / Math.pow(10, size);
		param['unit'] = sizes[i];
	}
	return param['value'] + param['unit'];
};
