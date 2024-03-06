import { Component } from 'cc';
import { UIManager, UIStyle } from '../manager/ui-manager';

export class UIBase extends Component {
    /**页面风格 */
    public uistyle: UIStyle = {
        level: 3,
    };

    /**数据 */
    public data: any;
    /**预制体路径 */
    public path!: string;
    /**返回的路径 */
    public returnPath!: string;

    __preload() {
        this.node.on('close', this.onClose, this);
    }

    public onClose() {
        UIManager.getInstance().close(this);
    }
}
