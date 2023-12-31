import { _decorator, CCString, Component, EditBox, Enum, Label, ProgressBar, Slider, Sprite, Toggle } from 'cc';
import { EDITOR } from 'cc/env';
import { Data } from './data';

const { ccclass, property } = _decorator;

enum ListenType {
	Label,
	Sprite,
	ProgressBar,
	EditBox,
	Toggle,
	Slider,
	VirtualList,
}

Enum(ListenType);

@ccclass('data/Listen')
export class Listen extends Component {
	@property private _key: string = '';
	@property(CCString)
	get key(): string {
		return this._key;
	}
	set key(value: string) {
		this._key = value;
		this.refresh();
	}

	@property({ type: ListenType }) type: ListenType = ListenType.Label;
	public data: Data = null;

	protected onLoad(): void {
		this.refresh();
	}

	refresh(): void {
		if (EDITOR) {
			return;
		}
		this.data = null;
		if (!this.key) return;

		this.data = maid.database.get(this.key);
		this.data.listen((data, old) => {
			this.onChange(data);
		}, this);
	}

	onChange(data) {
		let val = data.newValue;
		switch (this.type) {
			case ListenType.Label:
				{
					this.node.getComponent(Label).string = val;
				}
				break;
			case ListenType.Sprite:
				{
					this.node.getComponent(Sprite).imgStr = val;
				}
				break;
			case ListenType.ProgressBar:
				{
					this.node.getComponent(ProgressBar).progress = val;
				}
				break;
			case ListenType.EditBox:
				{
					this.node.getComponent(EditBox).string = val;
				}
				break;
			case ListenType.Toggle:
				{
					this.node.getComponent(Toggle).isChecked = !!val;
				}
				break;
			case ListenType.Slider:
				{
					this.node.getComponent(Slider).progress = val;
				}
				break;
			case ListenType.VirtualList:
				{
					//TODO:未实装
					let virtualList: any = this.node.getComponent('VirtualList');
					if (virtualList) {
						virtualList.modelManager.clear();
						virtualList.modelManager.insert(val);
					}
				}
				break;
		}
	}
}
