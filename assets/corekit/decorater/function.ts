function isStringOrStringArray(value: any): value is string | string[] {
    return typeof value === 'string' || (Array.isArray(value) && value.every((item) => typeof item === 'string'));
}

export function catchAsync(msg: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                //log.error(`${msg}异常,参数:${args}`, error);
                // if (isStringOrStringArray(error)) {
                //     if (typeof error == 'string') {
                //         log.error(`${msg}异常,参数:${args}`, error);
                //     } else {
                //         log.error(`${msg}异常`, `参数:${args}\n ${propertyKey}:${error.join('\n')} `);
                //     }
                // } else {
                //     console?.error(`${msg}异常,参数:${args}\n ${propertyKey}:${error} `);
                // }
                console?.error(`${msg}异常,参数:${args}\n ${propertyKey}:${error} `);
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
                console?.error(`${msg}异常,参数:${args}\n ${propertyKey}:${error} `);
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
            for (let i in args) {
                if (typeof args[i] == 'number') {
                    args[i] = Math.min(Math.max(args[i], min), max);
                }
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}

/**
 * 单例类装饰器
 * 使用后会获取一个静态方法getInstance，返回类型为T，T继承自Singleton<T>
 * @param constructor
 * @returns
 */
export function Singleton<T extends { new (...args: any[]): {} }>(ctr: T) {
    // 导出一个泛型类Singleton，它有一个静态方法getInstance，返回类型为T，T继承自Singleton<T>
    return class SingletonClass extends ctr {
        public static getInstance<T extends {}>(this: new () => T): T {
            // 如果this.instance不存在，则将this.instance赋值为一个新的实例
            if (!(<any>this).instance) {
                (<any>this).instance = new this();
            }
            // 返回this.instance
            return (<any>this).instance;
        }
    } as T & {
        getInstance: () => T;
    };
}

export function MBase<T extends { new (...args: any[]): {} }>(ctr: T) {
    return class Base extends ctr {
        public static getInstance<T extends {}>(this: new () => T): T {
            // 如果this.instance不存在，则将this.instance赋值为一个新的实例
            if (!(<any>this).instance) {
                (<any>this).instance = new this();
            }
            // 返回this.instance
            return (<any>this).instance;
        }
    };
}

// function singleton(target: any, propertyKey: string) {
//     const privateKey = _${propertyKey};

//     Object.defineProperty(target, propertyKey, {
//         get: function () {
//             if (!this[privateKey]) {
//                 this[privateKey] = new this();
//             }
//             return this[privateKey];
//         },
//         configurable: false,
//         enumerable: false,
//     });
// }

//对继承无影响
export function SingleFunc(target: any) {
    target.Ins = function (thisMe: any, ...args) {
        if (!target.__ins__) {
            target.__ins__ = new target(...args);
        }
        return target.__ins__;
    };
    return target;
}

declare global {
    interface Function {
        Ins<T>(arg: { new (...args): T }, ...params: any[]): T;
    }
}
