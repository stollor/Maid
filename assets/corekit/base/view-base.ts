import { _decorator, Component, Constructor, Node } from 'cc';
const { ccclass, property } = _decorator;

// declare module '../../index' {
//     interface Maid {

//     }
// }

@ccclass('Base')
export class Base extends Component {
    private _nodeMap: Map<string, Node>;

    protected onLoad(): void {
        this.__initPrefabChildNode();
    }

    __initPrefabChildNode() {
        this._nodeMap = new Map<string, Node>();
        var recursion = (parent: Node) => {
            for (let i = 0; i < parent.children.length; i++) {
                if (parent.children[i].name && parent.children[i].name[0] == '@') {
                    this._nodeMap.set(parent.children[i].name, parent.children[i]);
                }
                recursion(parent.children[i]);
            }
        };
        recursion(this.node);
    }

    /**获取节点
     * 可以获取节点树中 以"@"开头命名的节点
     */
    getChild(name: string): Node | null;
    getChild(name: string, comp: string): Component | null;
    getChild<T extends Component>(name: string, comp: Constructor<T> | ((...args: any[]) => T)): T | null;
    getChild<T extends Component>(name: string, comp?: string | Constructor<T> | ((...args: any[]) => T)): Node | T | null {
        if (!this._nodeMap.has(name)) {
            return null;
        } else if (!comp) {
            return this._nodeMap.get(name) as Node;
        } else {
            //@ts-ignore
            return this._nodeMap.get(name).getComponent(comp) as T;
        }
    }

    // getComponent<T extends Component>(classConstructor: __private._types_globals__Constructor<T>): T;
    // getComponent(className: string): Component;
    // getComponent(className: unknown): Component | T {
    //     if (!this._nodeMap.has(name)) {
    //         return null;
    //     } else if (!comp) {
    //         return this._nodeMap.get(name) as Node;
    //     } else {
    //         return this._nodeMap.get(name).getComponent(comp as any) as typeof comp;
    //     }
    // }

    // getChild<T extends typeof Component | Node>(name: string, comp?: T): InstanceType<T> {
    //     if (!this._nodeMap.has(name)) {
    //         return null;
    //     } else if (!comp) {
    //         return this._nodeMap.get(name) as InstanceType<T>;
    //     } else {
    //         return this._nodeMap.get(name).getComponent(comp as any) as InstanceType<T>;
    //     }
    // }

    // getChild<T extends typeof Node | Component | string = typeof Node>(
    //     name: string,
    //     comp?: T
    // ): T extends typeof Node ? InstanceType<T> : any {
    //     if (!this._nodeMap.has(name)) {
    //         return null;
    //     } else if (!comp) {
    //         return this._nodeMap.get(name) as T extends typeof Node ? InstanceType<T> : any;
    //     } else {
    //         return this._nodeMap.get(name).getComponent(comp as T) as T extends typeof Node ? InstanceType<T> : any;
    //     }
    // }

    /**
     * 遍历获取节点树中对应名称的节点
     * @param name
     * @returns
     */
    find(name: string): Node | undefined {
        var recursion = (parent: Node) => {
            for (let i = 0; i < parent.children.length; i++) {
                if (parent.children[i].name == name) {
                    return parent.children[i];
                }
                recursion(parent.children[i]);
            }
        };
        return recursion(this.node);
    }
}
