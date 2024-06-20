import { Sprite } from 'cc';
import { LogStyleData, LogType } from './define';

class PrettyLog {
	get isOpen() {
		return maid.CONST.DEV;
	}

	checkEmpty(value: any) {
		return value == null || value === undefined || value === '';
	}

	baseLog(title: string | undefined, text: string, type: LogType, padding: number = 2) {
		if (!this.isOpen) return;
		let config = LogStyleData[type];
		console.log(
			`%c ${title ?? config.title} %c ${text} %c`,
			`background: ${config.color.titleBG};
             border: 1px solid ${config.color.border};
             padding: ${padding}px;
             border-radius: 4px 0 0 4px;
             color: ${config.color.title};
             font-weight: bold;`,
			`background: ${config.color.textBg};
             border: 1px solid ${config.color.border};
             padding: ${padding}px;
             border-radius: 0 4px 4px 0;
             color: ${config.color.text};`,
			`background: transparent;
             font-size: 14px;`
		);
	}

	_easyLog(type: LogType, textOrTitle: string, content?: string, padding?: number) {
		const title = content ? textOrTitle : undefined;
		const text = content ?? textOrTitle;
		this.baseLog(title, text, type, padding);
	}

	/**打印普通消息 */
	info(textOrTitle: string, content?, padding?: number) {
		this._easyLog(LogType.info, textOrTitle, content, padding);
	}

	/**打印错误消息 */
	error(textOrTitle: string, content?, padding?: number) {
		this._easyLog(LogType.error, textOrTitle, content, padding);
	}
	/**打印警告消息 */
	warning(textOrTitle: string, content?, padding?: number) {
		this._easyLog(LogType.warn, textOrTitle, content, padding);
	}
	/**打印成功消息 */
	success(textOrTitle: string, content?, padding?: number) {
		this._easyLog(LogType.success, textOrTitle, content, padding);
	}

	/**
	 * 打印图片
	 * @param dataUri  base64数据 或者 对应网址
	 * @param scale  缩放倍数
	 * @returns
	 */
	img = (dataUri: string, scale = 1) => {
		if (this.isOpen) return;
		const img = new Image();
		img.onload = () => {
			const c = document.createElement('canvas');
			const ctx = c.getContext('2d');
			if (ctx) {
				c.width = img.width;
				c.height = img.height;
				ctx.fillStyle = 'red';
				ctx.fillRect(0, 0, c.width, c.height);
				ctx.drawImage(img, 0, 0);
				const dataUri = c.toDataURL('image/png');
				console.log(
					`%c sup?`,
					`font-size: 1px;
                    padding: ${Math.floor((img.height * scale) / 2)}px ${Math.floor((img.width * scale) / 2)}px;
                    background-image: url(${dataUri});
                    background-repeat: no-repeat;
                    background-size: ${img.width * scale}px ${img.height * scale}px;
                    color: transparent;
                    `
				);
			}
		};
		img.src = dataUri;
	};

	sprite(sp: Sprite, scale: number) {}
}

// 创建打印对象
globalThis.log = new PrettyLog();
