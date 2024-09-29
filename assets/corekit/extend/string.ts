interface String {
    /**返回 新的 反转的字符串 */
    reverse(): string;
    /**返回 新的 重复count次的字符串 */
    repetition(count: number): string;
    /** 获取富文本打字机数组
     * @param str 传入富文本
     * @returns 返回字符串数组(0->leng:最长->最短)
     */
    getRichTextArrary(str: string): string[];

    fill(filler: string, leng: number): string;
}

String.prototype.reverse = function () {
    return this.split('').reverse().join('');
};

String.prototype.repetition = function (count: number) {
    var result: string = '';
    while (count--) {
        result += this;
    }
    return result;
};

String.prototype.getRichTextArrary = function (str: string) {
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
};

/**
 * 填充str到指定长度
 * @param str 传入字符串
 * @param filler 填充物
 * @param leng 目标长度
 * @returns
 */
String.prototype.fill = function (filler, leng) {
    if (this.length >= leng) return this;
    return this.charString(filler, leng - this.length) + this;
};
