'use strict';
const fs = require('fs');
const path = require('path');
const electron = require('electron');

// 获得Creator主窗口
function getMainWebContents() {
	let allwins = electron.BrowserWindow.getAllWindows();
	for (let i = 0; i < allwins.length; i++) {
		const win = allwins[i];
		if (win.title && win.title.includes('Cocos Creator')) {
			return win.webContents;
		}
	}
	return;
}

module.exports = {
	load() {
		let webContents = getMainWebContents();
		try {
			if (webContents.__injected_handle_widget) {
				// in case plugin if reloaded
				return;
			}
		} catch (error) {
			// usually happen when creator is just started and main window is not created
			console.log(error);
			return;
		}

		// 往web环境里写代码，添加键盘监听事件
		let hackCode = fs.readFileSync(path.join(__dirname, 'panel', 'hackCode.js')).toString();
		webContents.__injected_handle_widget = true;
		webContents.executeJavaScript(hackCode, function (result) {});
	},

	unload() {},

	methods: {
		setActive() {
			Editor.Message.request('scene', 'execute-scene-script', {
				name: 'simple-handle-node',
				method: 'set-active',
				args: {},
			});
		},
		setActiveRadio() {
			Editor.Message.request('scene', 'execute-scene-script', {
				name: 'simple-handle-node',
				method: 'set-active-radio',
				args: {},
			});
		},
	},
};
