/**
 * 日志类型
 */
export enum LogType {
	/**消息 */
	info,
	/**警告 */
	warn,
	/**错误 */
	error,
	/**成功 */
	success,
	/**多媒体消息 */
	other,
}

/**
 * 日志风格数据
 */
type LogStyleData = {
	[index in (typeof LogType)[keyof typeof LogType]]: {
		//[index in keyof typeof LogType]: {
		/**标题 */
		title: string;
		/**颜色 */
		color: {
			/**标题颜色 */
			title: string;
			/**标题背景颜色*/
			titleBG: string;
			/**正文颜 */
			text: string;
			/**正文背景颜色 */
			textBg: string;
			/**边框颜色 */
			border: string;
		};
	};
};

/**
 * 日志风格数据
 */
export const LogStyleData: LogStyleData = {
	[LogType.info]: {
		title: 'Info',
		color: {
			title: '#2980B9',
			titleBG: '#87C5F0',
			text: '#282825',
			textBg: '#E6F3FC',
			border: '#87C5F0',
		},
	},
	[LogType.warn]: {
		title: 'Warn',
		color: {
			title: '#4a3f56',
			titleBG: '#e0c862',
			text: '#282825',
			textBg: '#FEF6E3',
			border: '#e0c862',
		},
	},
	[LogType.error]: {
		title: 'Error',
		color: {
			title: '#f1ecb8',
			titleBG: '#a62323',
			text: '#282825',
			textBg: '#fdf4f5',
			border: '#a62323',
		},
	},
	[LogType.success]: {
		title: 'Success',
		color: {
			title: '#f6f6d2',
			titleBG: '#25974c',
			text: '#282825',
			textBg: '#E8F5E9',
			border: '#25974c',
		},
	},
	[LogType.other]: {
		title: 'Other',
		color: {
			title: '#afc3d1',
			titleBG: '#4680a2',
			text: '#282825',
			textBg: '#E6F3FC',
			border: '#4680a2',
		},
	},
};
