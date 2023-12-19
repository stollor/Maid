import { EventMouse, find, Node } from 'cc';
import { Singleton } from '../base/singleton';

export class MouseManger extends Singleton {
	onEnable() {
		var canvas: Node = find('Canvas')!;
		canvas.on(Node.EventType.MOUSE_MOVE, this.onMove, this);
	}

	onDisable() {
		var canvas: Node = find('Canvas')!;
		canvas.off(Node.EventType.MOUSE_MOVE, this.onMove, this);
	}

	hideMouse() {
		let gcs = document.getElementById('GameCanvas')!;
		gcs.style.cursor = 'none';
	}

	onMove(event: EventMouse) {
		// 获取当前鼠标位置
		maid.em.emit('mouse_move', event.getUILocation());
	}
}
