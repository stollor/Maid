import { Color, Layers, Node, Sprite, Widget } from 'cc';

export class NodeUtil {
	/**
	 * 获得一个顶级UI节点
	 * @param name 节点名称
	 */
	public getLayerNode(name: string = 'layer') {
		let node = new Node();
		node.layer = Layers.Enum.UI_2D;
		node.name = name;
		this.addWidgetFull(node);
		return node;
	}

	/**
	 * 增加Widget 组件,并适配全屏
	 * @param node
	 * @returns widget
	 */
	public addWidgetFull(node: Node) {
		let sp = node.addComponent(Widget);
		sp.isAlignTop = true;
		sp.isAlignBottom = true;
		sp.isAlignLeft = true;
		sp.isAlignRight = true;
		sp.top = 0;
		sp.bottom = 0;
		sp.left = 0;
		sp.right = 0;
		return sp;
	}

	/**
	 * 添加Sprite,并设置默认颜色
	 * @param node
	 * @param color 颜色
	 * @returns Sprite
	 */
	public addSpriteColor(node: Node, color: string) {
		let sp = node.addComponent(Sprite);
		sp.color = new Color(color);
		return sp;
	}
}
