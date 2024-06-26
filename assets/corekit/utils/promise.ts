/**
 * 顺序执行队列
 */
export class PromiseList {
    private _list: (() => Promise<any>)[] = [];
    private _run: boolean = false;

    public isRun() {
        return this._run;
    }

    /**
     * 添加事件
     * @param fun 一个返回Promise的函数
     * @param run_now 是否立刻run这个PomiseList
     */
    public add<T>(fun: () => Promise<T>, run_now: boolean = true) {
        this._list.push(fun);
        if (!this._run && run_now) {
            this.run();
        }
    }

    public async run() {
        let fun = this._list.shift();
        if (fun) {
            await fun();
            await this.run();
        }
    }
}

export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
