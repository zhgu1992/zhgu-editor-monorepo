import { getResizeCursor, getRotateCursor, type CornerDirection } from '../../../utils';
import { BaseCollectionArea, CustomCollection } from '../../../node';
import type { ICollection, ICustomStyledOptions } from '../../../interface';
import { COLOR_CONFIG } from '../../../const';
import type { AllEventType } from '../../../interface';
import type { AllDirection } from '../../../utils';
import type { View } from '../../../view';
import {mat3} from "gl-matrix";

// 选中框的四个角的热区， 是vector
const getPathMap = (w: number, isMini = false) => {
  if (isMini) {
    const halfW = w / 2;
    return {
      lt: `M 0 0 L ${w} 0 L ${w} ${halfW} L ${halfW} ${halfW} L ${halfW} ${w} L 0 ${w} L 0 0 Z`, // 左上
      rt: `M ${halfW} 0 L ${halfW} ${w} L 0 ${w} L 0 ${halfW} L -${halfW} ${halfW} L -${halfW} 0 L ${halfW} 0 Z`, // 右上
      rb: `M ${halfW} ${halfW} L -${halfW} ${halfW} L -${halfW} 0 L 0 0 L 0 -${halfW} L ${halfW} -${halfW} L ${halfW} ${halfW} Z`, // 右下
      lb: `M 0 ${halfW} L ${w} ${halfW} L ${w} 0 L ${halfW} 0 L ${halfW} -${halfW} L 0 -${halfW} L 0 ${halfW} Z`, // 左下
    };
  }

  return {
    lt: `M 0 0 L ${w} 0 L ${w} ${w} L 0 ${w} L 0 0 Z`, // 左上
    rt: `M ${w} 0 L ${w} ${w} L 0 ${w} L 0 0 L ${w} 0 Z`, // 右上
    rb: `M ${w} ${w} L 0 ${w} L 0 0 L ${w} 0 L ${w} ${w} Z`, // 右下
    lb: `M 0 ${w} L ${w} ${w} L ${w} 0 L 0 0 L 0 ${w} Z`, // 左下
  };
};


export class BaseSelectBorder extends CustomCollection{
  update(){
    super.update();
    this.isVisible = this.collection.nodes.length > 0;
  }
}

/**
 * 选中框的四个点渲染基类，另外也是非闭合矢量的选中线的两个点的渲染基类
 */
export class BaseRenderPoint extends CustomCollection {
  constructor(id: string, collection: ICollection, view: View,
    options: Partial<ICustomStyledOptions> = {
      strokeWeight : 1,
      color: COLOR_CONFIG['light/purple/50'],
      opacity: 1,
      colorEnabled: true,
      strokeEnabled: true,
      strokeOpacity: 1,
    }) {
    super(id, collection, view, options);
  }
  get w() {
    return this.rectSize;
  }

  get h() {
    return this.rectSize;
  }

  protected get rectSize() {
    this.isVisible = this.collection.nodes.length > 0;
    return this.eventManager.viewPort.screen2page(8) as number;
  }

  protected get diffSize() {
    return this.rectSize / 2;
  }
}

/**
 * 选中框的四个边及四个点 resize 热区基类
 */
export class BaseResizeEventArea extends BaseCollectionArea {
  protected _resizeType: AllDirection = 'l';

  constructor(id: string, collection: ICollection, view: View,
    options: Partial<ICustomStyledOptions>={
      opacity: 0.5,
      color: COLOR_CONFIG['light/purple/50'] ,
      strokeEnabled: false,
    }) {
    super(id, collection,view, options);
    this.isVisible = false;
  }

  get screenW() {
    return this.getPixelScreen(this.collection.w) as number;
  }

  get renderOrder() {
    return 1;
  }

  get cursor() {
    return getResizeCursor({
      apoints: this.collection.apoints,
      key: this.resizeType,
    });
  }

  get screenH() {
    return this.getPixelScreen(this.collection.h) as number;
  }

  calcCornerSize(num: number) {
    const { screenW, screenH } = this;
    if (screenW < 24 || screenH < 24) {
      return 6;
    }

    if (num < 60) {
      const offset = Math.round((60 - num) / 6);
      return 12 - offset;
    }

    return 12;
  }

  get borderH() {
    return this.getScreenPixel(this.calcCornerSize(this.screenH)) as number;
  }

  get borderW() {
    return this.getScreenPixel(this.calcCornerSize(this.screenW)) as number;
  }

  get resizeType(): AllDirection {
    return this._resizeType;
  }

  set resizeType(type: AllDirection) {
    this._resizeType = type;
  }
}
export class BaseResizePoint extends BaseResizeEventArea {
  protected _resizeType: CornerDirection = 'lt';
  constructor(id: string, collection: ICollection, view: View,
    options: Partial<ICustomStyledOptions>={
      opacity: 1.0,
      color: COLOR_CONFIG['light/purple/600'],
      strokeEnabled: false,
    }) {
    super(id, collection, view, options);
    this.isVisible = false;
  }
  get w() {
    return this.rectSize;
  }

  get h() {
    return this.rectSize;
  }

  protected get rectSize() {
    return this.getScreenPixel(12) as number;
  }

  protected get diffSize() {
    return this.rectSize / 2;
  }
}

// 矩形的和直线不太一样
export class BaseRectangleResizePoint extends BaseResizePoint {
  get type() {
    return 'vector';
  }

  get renderOrder() {
    return 2;
  }

  get useMini() {
    return this.screenW < 24 || this.screenH < 24;
  }

  get offset() {
    if (this.useMini) {
      return this.getScreenPixel(6) as number;
    }
    return 0;
  }

}

/**
 * 选中框的四个点旋转热区基类
 */
export class BaseRotatePoint extends BaseRenderPoint {
  protected _rotateType: CornerDirection = 'lt';
  get isKeepSelected() {
    return true;
  }

  get rotateType() {
    return this._rotateType;
  }

  get boundEvents(): AllEventType[] {
    return ['dragstart', 'dragmove', 'dragend'];
  }

  get renderOrder() {
    return 1;
  }

  protected get rotateSize() {
    return 22 / this.eventManager.viewPort.zoom;
  }

  get w() {
    return this.rectSize;
  }

  get h() {
    return this.rectSize;
  }

  protected get rectSize() {
    return this.getScreenPixel(18) as number;
  }

  protected get diffSize() {
    return this.getScreenPixel(6);
  }
}

export class BaseRectangleRotatePoint extends BaseRotatePoint {
  protected _rotateType: CornerDirection = 'lt';
  get type() {
    return 'vector';
  }

  get offset() {
    return this.getScreenPixel(9);
  }

  get cursor() {
    return getRotateCursor({
      apoints: this.collection.apoints,
      key: this._rotateType,
    });
  }
}
