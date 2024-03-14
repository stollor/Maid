import { sys } from 'cc';
import { Singleton } from '../base/singleton';

enum DebugType {
	/**开发模式 */
	Develop = 0,

	/**发布模式 */
	Release = 1,
}

export class DebugManger extends Singleton {
	static EventType: typeof DebugType = DebugType;
	static static: DebugType = DebugType.Develop;

	constructor() {
		super();
	}

	public log(...args: any[]) {
		if (DebugManger.static == DebugType.Develop) {
			console.log(...args);
		}
	}

	public error(...args: any[]) {
		if (DebugManger.static == DebugType.Develop) {
			console.error(...args);
		}
	}

	public warn(...args: any[]) {
		if (DebugManger.static == DebugType.Develop) {
			console.warn(...args);
		}
	}
}

if (sys.isNative) {
	let __handler;
	if (window['__errorHandler']) {
		__handler = window['__errorHandler'];
	}
	window['__errorHandler'] = function (...args) {
		maid.debug.error('游戏报错,原生系统', args);
		if (__handler) {
			__handler(...args);
		}
	};
}

if (sys.isBrowser) {
	let __handler;
	if (window.onerror) {
		__handler = window.onerror;
	}
	window.onerror = function (...args) {
		maid.debug.error('onerror 捕获到异常', args);
		if (__handler) {
			__handler(...args);
		}
	};

	window.addEventListener(
		'error',
		(error) => {
			maid.debug.error('onerror 捕获到异常：', error);
		},
		true
	);

	window.addEventListener(
		'unhandledrejection',
		(error) => {
			maid.debug.error('unhandledrejection 捕获到异常：', error);
		},
		true
	);

	window.addEventListener('load', function () {
		sessionStorage.setItem('good_exit', 'pending');
		setInterval(function () {
			sessionStorage.setItem('time_before_crash', new Date().toString());
		}, 1000);
	});

	window.addEventListener('beforeunload', function () {
		sessionStorage.setItem('good_exit', 'true');
	});

	if (sessionStorage.getItem('good_exit') && sessionStorage.getItem('good_exit') !== 'true') {
		alert('Hey, welcome back from your crash, looks like you crashed on: ' + sessionStorage.getItem('time_before_crash'));
	}
}
