import { js } from 'cc';
import { Singleton } from '../decorater/function';

const fastRemoveAt = js.array.fastRemoveAt;

class BaseEvent {
	target: any;
	callback: Function;

	constructor(target: any, callback: Function) {
		this.target = target;
		this.callback = callback;
	}
}

/**
 * 全局事件管理
 */
@Singleton
export class EventManager {
	static getInstance: () => EventManager;
	private _eventList: any = {};
	private _eventMap: any = {};

	/**监听事件
	 * @param type 事件类型
	 * @param event 事件回调
	 * @param target 事件对象
	 * @returns
	 */
	public on(type: string, event: Function, target: any) {
		let tempBaseEvent = new BaseEvent(target, event);
		this._eventList[type] = this._eventList[type] || [];
		this._eventList[type].push(tempBaseEvent);
	}

	public once(type: string, event: Function, target: any) {
		this.on(
			type,
			(data: any) => {
				event.call(target, data);
				this.off(type, event, target);
			},
			target
		);
	}

	/**移除事件
	 * @param type 事件类型
	 * @param callback 事件回调
	 * @param target 事件对象
	 */
	public off(type: string, callback: Function, target: any) {
		let list = this._eventList[type];
		if (list) {
			let len = list.length;
			for (let i = 0; i < len; i++) {
				if (list[i].target == target && list[i].callback == callback) {
					fastRemoveAt(list, i);
					--i;
					--len;
				}
			}
		}
	}

	/**抛消息
	 * @param type
	 * @param data
	 */
	public emit(type: string, data: any) {
		let list = this._eventList[type];
		if (list) {
			let len = list.length;
			for (let i = 0; i < len; i++) {
				list[i]?.callback?.call(list[i].target, data);
			}
		}
	}

	/**移除目标上的所有事件
	 * @param target
	 */
	public offTarget(target: any) {
		for (let key in this._eventList) {
			let list = this._eventList[key];
			if (list) {
				let len = list.length;
				for (let i = 0; i < len; i++) {
					if (list[i].target == target) {
						fastRemoveAt(list, i);
						--i;
						--len;
					}
				}
			}
		}
	}

	/**移除事件
	 * @param target
	 */
	public offEvent(type: string) {
		this._eventList[type] = null;
	}
}
