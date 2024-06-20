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
            text: '#2980B9',
            textBg: '#E6F3FC',
            border: '#87C5F0',
        },
    },
    [LogType.warn]: {
        title: 'Warn',
        color: {
            title: '#FFFFFF',
            titleBG: '#F5D76E',
            text: '#E67E22',
            textBg: '#FEF6E3',
            border: '#F5D76E',
        },
    },
    [LogType.error]: {
        title: 'Error',
        color: {
            title: '#FFFFFF',
            titleBG: '#E57373',
            text: '#C62828',
            textBg: '#FFEBEE',
            border: '#E57373',
        },
    },
    [LogType.success]: {
        title: 'Success',
        color: {
            title: '#FFFFFF',
            titleBG: '#81C784',
            text: '#2E7D32',
            textBg: '#E8F5E9',
            border: '#81C784',
        },
    },
    [LogType.other]: {
        title: 'Other',
        color: {
            title: '#FFFFFF',
            titleBG: '#81C784',
            text: '#2E7D32',
            textBg: '#E8F5E9',
            border: '#81C784',
        },
    },
};
