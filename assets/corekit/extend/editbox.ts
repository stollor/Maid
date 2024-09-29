import { EditBox, Mat4, Vec2, Vec3, director, game, view } from 'cc';

declare module 'cc' {
    interface Editbox {}
}

EditBox._EditBoxImpl.prototype._resize = function () {
    if (this?._delegete?.node) {
        this._delegate.node.hasChangedFlags = 1;
    }
};

EditBox.prototype.update = function () {
    if (this._impl) {
        updateImplMatrix(this._impl);
    }
};

function updateImplMatrix(self: any) {
    if (!self._edTxt) {
        return;
    }
    const _matrix = new Mat4();
    const _matrix_temp = new Mat4();
    const _vec3 = new Vec3();

    const node = self._delegate!.node;
    let scaleX = view.getScaleX();
    let scaleY = view.getScaleY();
    const viewport = view.getViewportRect();
    // TODO: implement editBox in PAL
    const dpr = view.getDevicePixelRatio();

    node.getWorldMatrix(_matrix);
    const transform = node._uiProps.uiTransformComp;
    if (transform) {
        Vec3.set(_vec3, -transform.anchorX * transform.width, -transform.anchorY * transform.height, _vec3.z);
    }

    Mat4.transform(_matrix, _matrix, _vec3);
    if (!node._uiProps.uiTransformComp) {
        return;
    }

    const camera = director.root!.batcher2D.getFirstRenderCamera(node);
    if (!camera) return;

    camera.node.getWorldRT(_matrix_temp);
    const m12 = _matrix_temp.m12;
    const m13 = _matrix_temp.m13;
    const vs = view.getVisibleSize();
    const center = new Vec2(view.getVisibleOrigin().x + vs.width / 2, view.getVisibleOrigin().y + vs.height / 2);
    _matrix_temp.m12 = center.x - (_matrix_temp.m00 * m12 + _matrix_temp.m04 * m13);
    _matrix_temp.m13 = center.y - (_matrix_temp.m01 * m12 + _matrix_temp.m05 * m13);

    Mat4.multiply(_matrix_temp, _matrix_temp, _matrix);
    scaleX /= dpr;
    scaleY /= dpr;

    const container = game.container;
    const a = _matrix_temp.m00;
    const b = _matrix_temp.m01;
    const c = _matrix_temp.m04;
    const d = _matrix_temp.m05;

    let offsetX = parseInt((container && container.style.paddingLeft) || '0');
    offsetX += viewport.x / dpr;
    let offsetY = parseInt((container && container.style.paddingBottom) || '0');
    offsetY += viewport.y / dpr;
    const tx = _matrix_temp.m12 * scaleX + offsetX;
    const ty = _matrix_temp.m13 * scaleY + offsetY;

    const matrix = `matrix(${a},${-b},${-c},${d},${tx},${-ty})`;
    self._edTxt.style.transform = matrix;
    self._edTxt.style['-webkit-transform'] = matrix;
    self._edTxt.style['transform-origin'] = '0px 100% 0px';
    self._edTxt.style['-webkit-transform-origin'] = '0px 100% 0px';
}
