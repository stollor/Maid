export class FileUtil {
	static async readFile(file: any) {
		return new Promise((resolve, reject) => {
			var selectedFile = new File([], 'out');
			var reader = new FileReader(); //这里是核心！！！读取操作就是由它完成的。
			reader.readAsText(selectedFile); //读取文件的内容
			reader.onload = function () {
				//console.log('读取结果：', this.result);
				//当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
				//@ts-ignore
				let json = JSON.parse(this.result);
				resolve(json);
			};
		});
	}
}
