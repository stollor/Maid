import { DEBUG } from 'cc/env';
import { ColorType } from '../corekit/define/ui';

export class debug {
	getColor(index: number) {
		return ColorType[index % Object.keys(ColorType).length];
	}

	getRandomColor() {
		return this.getColor[~~(Object.keys(ColorType).length * Math.random())];
	}

	logList(list: any[], log: boolean = DEBUG) {
		if (!log) return;
		let color = this.getRandomColor();
		for (let i = 0; i < list.length; i++) {
			console.log(`%c${list[i]}`, `color:${ColorType.黑};background:${color}`);
		}
	}

	log(msg, color = ColorType.绿, log: boolean = DEBUG) {
		if (!log) return;
		console.log(`%c${msg}`, `color:${ColorType.黑};background:${color}`);
	}

	err(msg, log: boolean = DEBUG) {
		if (!log) return;
		console.log(`%c${msg}`, `color:${ColorType.白};background:${ColorType.红}`);
	}
}
