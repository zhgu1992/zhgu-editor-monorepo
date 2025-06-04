import type { ICollection, ICustomCollection, ICustomStyledOptions } from '../../interface';
import { mat3 } from 'gl-matrix';
import { type XYPos } from '@zhgu/type';
import { CustomNode } from './CustomNode';
import { COLOR_CONFIG, ERenderGroupKey } from '../../const';
import type { View } from '../../view';
import type { NodeGroup } from '../../render';

/**
 * 自定义集合节点
 */
export class CustomCollection extends CustomNode implements ICustomCollection {
  collection: ICollection;
  private _mat3Cache = mat3.create();
  group: NodeGroup;
  constructor(id: string, collection: ICollection, view: View, options?: Partial<ICustomStyledOptions>) {
    super(id, view, options);
    this.group = this.renderManager.getNodeGroup(ERenderGroupKey.Custom)!;
    this.renderManager.setRenderOrder(this.renderNode, 1);
    this.group.addNode(this);
    this.collection = collection;
    this.setDefaultStyle();
  }

  protected getScreenPixel(value: number) {
    return this.eventManager.viewPort.screen2page(value) as number;
  }

  protected getPixelScreen(value: number) {
    return this.eventManager.viewPort.page2screen(value) as number;
  }

  get w() {
    return this.collection.w;
  }

  get h() {
    return this.collection.h;
  }

  // 相对于关联节点的位置
  protected get diffXY(): XYPos {
    return { x: 0, y: 0 };
  }

  get at() {
    const rt = mat3.fromValues(1, 0, 0, 0, 1, 0, this.diffXY.x, this.diffXY.y, 1);
    return mat3.mul(this._mat3Cache, this.collection.at, rt);
  }

  update() {
    super.update();
    this.renderNode.setTransform(this.at);
    this.setPath();
  }

  destroy() {
    this.group.removeNodeById(this.id);
    super.destroy();
  }
}

/**
 * 热区，可以通过isArea属性判别
 */
export class BaseCollectionArea extends CustomCollection {
  private _canCalculate = true;
  public isArea = true;
  constructor(
    id: string,
    collection: ICollection,
    view: View,
    options: Partial<ICustomStyledOptions> = {
      opacity: 0.2,
      color: COLOR_CONFIG['light/purple/500'],
      strokeEnabled: false,
    }
  ) {
    super(id, collection, view, options);
  }

  set canCalculate(val: boolean) {
    this._canCalculate = val;
  }

  get canCalculate(): boolean {
    return this._canCalculate;
  }
}
