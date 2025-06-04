import type { RenderManager } from '../render';
import type { XYPos, XYWH } from '@zhgu/type';
import type { ICustomNode, IBaseNode } from '../interface';
import type { Scene } from '../node';

export class Picker {
  private _lastPickFrame = -1;
  private _frameTime = -1;
  private _pickInfo: IBaseNode | null = null;
  private _lastPos: XYPos = { x: 0, y: 0 };
  private _pickAreaInfo: ICustomNode[] = [];
  private _renderManager: RenderManager;
  private _scene: Scene;

  constructor(renderManager: RenderManager, scene: Scene) {
    this._renderManager = renderManager;
    this._scene = scene;
  }

  get renderManager() {
    return this._renderManager;
  }

  set frameTime(time: number) {
    this._frameTime = time;
  }

  get frameTime() {
    return this._frameTime;
  }

  pick(position: XYPos, ignoreFrameCheck = false): IBaseNode | null {
    const page = this._scene.currentPage;
    const { x, y } = position;
    // if (this._isSameFrame(x, y, ignoreFrameCheck)) {
    //   return this._pickInfo;
    // }
    const nodes = page.children as IBaseNode[];
    const len = nodes.length;
    for (let i = len - 1; i >= 0; i--) {
      const flag = nodes[i].pick(position);
      if (flag) {
        this._pickInfo = nodes[i];
        return nodes[i];
      }
    }
    return null;
  }

  pickByBox(bounds: XYWH, containerNode?: IBaseNode) {
    const page = containerNode ?? this._scene.currentPage;
    const nodes = page.children as IBaseNode[];
    const results = [];
    for (let i = 0; i < nodes.length; i++) {
      const flag = nodes[i].pickByBox(bounds);
      if (flag) {
        results.push(nodes[i]);
      }
    }
    return results;
  }

  private _isSameFrame(x: number, y: number, ignoreFrameCheck = false) {
    if (ignoreFrameCheck) {
      return false;
    }
    // 如果是同一帧
    if (this._lastPickFrame === this._frameTime) {
      if (this._lastPos.x === x && this._lastPos.y === y) {
        this._lastPickFrame = this._frameTime;
        return true;
      }
    }
    this._lastPos = { x, y };
    this._lastPickFrame = this._frameTime;
    return false;
  }
}
