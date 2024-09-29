import { isValid } from 'cc';

/**
 * 监听的类型
 */
enum ListenType {
    /**监听改变,返回具体的EventType */
    Change = 'Data_Change',
    /**监听数据,返回新旧数据 */
    Data = 'Data',
}

enum EventType {
    Add,
    Del,
    Sweap,
    Refresh,
    Set,
}

/**
 * 数据, 用于监听数据变化
 * 适用于:基础类型,数组,对象
 * 事件:
 * 		change:数据变化(基础类型),或者数组,对象的任意变化  (newValue,oldVal)  仅基础类型会返回正确的oldVal
 * 		add:数组,对象添加元素								(value,index)
 * 		del:数组,对象删除元素								(value,index)
 * 		set:数组,对象修改属性								(value,index/key)
 */
export class Data<T = any> {
    private _value: T;
    private _oldValue: T;

    private _changeEventList: [Function, any, string][] = [];
    private _dataEventList: [Function, any, string][] = [];

    constructor(data?: any) {
        this._value = data;
        this._oldValue = null;
        this._changeEventList = [];
        this._dataEventList = [];
    }

    public set value(value: T) {
        if (this._value === value) return;
        this._oldValue = this._value;
        this._value = value;
        this.emit(ListenType.Change, { newValue: this._value, oldVal: this._oldValue });
    }

    public get value(): T {
        if (Array.isArray(this._value)) {
            return new CustomArray<T>(this._value, this as Data<T[]>) as T;
        } else if (typeof this._value === 'object' && this._value !== null) {
            return new CustomObject<T>(this._value, this) as T;
        } else return this._value;
    }

    public get changeEventList() {
        this._changeEventList = this._changeEventList.filter(([fun, target, key]) => isValid(target));
        return this._changeEventList;
    }

    public get dataEventList() {
        this._dataEventList = this._dataEventList.filter(([fun, target, key]) => isValid(target));
        return this._dataEventList;
    }

    private _onChange(type: EventType, value: any, index: number | string) {
        this.changeEventList.forEach(([fun, target]) => {
            fun.apply(target, [type, value, index]);
        });
    }

    private _onListen(newData: T, oldVal: T) {
        this.dataEventList.forEach(([fun, target]) => {
            fun.apply(target, [newData, oldVal]);
        });
    }

    public emit(key: string, ...args: any) {
        if (key === ListenType.Change) {
            this._onChange(args[0], args[1], args[2]);
        } else if (key === ListenType.Data) {
            this._onListen(args[0], args[1]);
        }
    }

    public listenEvent(
        callback: (type?: EventType, value?: any, index?: number | string) => void,
        target: any,
        key: string = ''
    ) {
        this._changeEventList.push([callback, target, key]);
        return this;
    }

    public listen(callback: (newData?: T, oldVal?: T) => void, target: any, key: string = '') {
        this._dataEventList.push([callback, target, key]);
        callback.apply(target, [this._value, this._oldValue]);
        return this;
    }

    public onlyOnce(key: any) {}

    /**
     * 更新数据
     * 会根据数据变化,发送增删命令
     */
    public updata(data: any) {
        if (Array.isArray(this._value) && Array.isArray(data)) {
            //对比数组,交换增删
        } else if (typeof this._value === 'object' && this._value !== null && typeof data === 'object') {
            //对比对象,增删改
        } else {
            this.value = data;
        }
    }
}

class CustomArray<T> {
    private array: T[];
    private data: Data<T[]>;

    constructor(value: T[] = [], data: Data<T[]>) {
        this.array = value;
        this.data = data;
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                if (prop === 'push') {
                    return (value: T) => {
                        let result = this.array.push(value);
                        this.data.emit(ListenType.Data, this.array);
                        this.data.emit(ListenType.Change, EventType.Add, value, this.array.length - 1);
                        return result;
                    };
                } else if (prop === 'unshift') {
                    return (value: T) => {
                        let result = this.array.unshift(value);
                        this.data.emit(ListenType.Data, this.array);
                        this.data.emit(ListenType.Change, EventType.Add, value, 0);
                        return result;
                    };
                } else if (prop === 'pop') {
                    return () => {
                        let result = this.array.pop();
                        this.data.emit(ListenType.Data, this.array);
                        this.data.emit(ListenType.Change, EventType.Del, value, this.array.length - 1);
                        return result;
                    };
                } else if (prop === 'shift') {
                    return () => {
                        let result = this.array.shift();
                        this.data.emit(ListenType.Data, this.array);
                        this.data.emit(ListenType.Change, EventType.Del, value, 0);
                        return result;
                    };
                } else if (prop === 'length') {
                    return this.array.length;
                } else {
                    return Reflect.get(target, prop, receiver);
                }
            },
        });
    }
}

class CustomObject<T> {
    private object: T;
    private data: Data<T>;

    constructor(value: T, data: Data<T>) {
        this.object = value;
        this.data = data;
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                return this.object[prop]; // Reflect.get(this.object, prop, receiver);
            },
            set: (target, prop, value, receiver) => {
                this.data.emit(ListenType.Data, this.object);
                this.data.emit(ListenType.Change, EventType.Set, value, prop);
                this.object[prop] = value;
                return true;
                //return Reflect.set(target, prop, value, receiver);
            },
            deleteProperty: (target, prop) => {
                this.data.emit(ListenType.Data, this.object);
                this.data.emit(ListenType.Change, EventType.Del, this.object[prop], prop);
                delete this.object[prop];
                return true;
                //return Reflect.deleteProperty(target, prop);
            },
        });
    }
}
