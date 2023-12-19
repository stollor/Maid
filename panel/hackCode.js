(() => 
{
	// 触发功能快捷鍵
	const EVENT_KEY = 'q'
	const inputType = {"text":1,"password":1,"number":1,"date":1,"color":1,"range":1,"month":1,"week":1,"time":1,"email":1,"search":1,"url":1,"textarea":1}

	// 不是输入状态时
	function inputTypeChk(e){
		if (e.path[0] ){
			let type = e.path[0].type ;
			if ( inputType[type]){
				return true
			}
		}
	}

	// 键盘监听
	document.body.addEventListener("keydown", (e) => 
	{
		let notDoubleKey = !e.ctrlKey && !e.metaKey && !e.altKey;
		if(e.key.toLocaleLowerCase() == EVENT_KEY && !inputTypeChk(e) && notDoubleKey)
		{
			if(e.shiftKey){
				Editor.Message.request('scene','execute-scene-script',{
					name: 'simple-handle-node',
					method: 'setActiveRadio',
					args:[],
				})
			}else{
				Editor.Message.request('scene','execute-scene-script',{
					name: 'simple-handle-node',
					method: 'setActive',
					args:[],
				})
			}
			e.preventDefault();// 吞噬捕获事件
			return true
		}
	}, false);
})();