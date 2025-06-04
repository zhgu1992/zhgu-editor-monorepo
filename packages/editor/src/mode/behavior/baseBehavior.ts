import type {XYPos, XYWH} from '@zhgu/type';
import { getFixPixelGridAlignmentVal } from '../../utils';
import { BaseModelNode } from '../base';
import type { View } from '../../view';
import type { ICollectionUIManager } from '../../interface';


export class BehaviorNode extends BaseModelNode{ // 活动名称
  // 对齐像素网格最小值
  protected pga = 1;
  private _collectionUIManager: ICollectionUIManager;

  constructor(view: View, type: string, collectionUIManager: ICollectionUIManager) {
    super(view,`state-${type}`);
    this._collectionUIManager = collectionUIManager;
  }

  get collectionUIManager(){
    return this._collectionUIManager;
  }

  getFixPixelGridBoundByPGA(bound: XYWH, isRotation = false){
    // const enabledPGA = this.view!.configManager!.PGAEnabled && !isRotation;
    const enabledPGA = false;
    return enabledPGA ? this._getFixPixelGridBound(bound) : {...bound};
  }

  // 根据像素网格进行位置修正
  getPositionDataByPGA(position: XYPos){
    // const enabledPGA = this.view!.configManager!.PGAEnabled;
    const enabledPGA = false;
    return enabledPGA ? this._getFixPixelGridPos(position) :  {...position};
  }

  getLineWidthByPGA(lineWidth: number, rotation: number){
    // const enabledPGA = this.view!.configManager!.PGAEnabled;
    const enabledPGA = false;
    const isOnAxis = (rotation + Math.PI * 2) % (Math.PI / 2) < 0.00001;
    return enabledPGA && isOnAxis ? getFixPixelGridAlignmentVal(lineWidth, this.pga) : lineWidth;
  }

  protected _getFixPixelGridPos(position: XYPos){
    const {x, y} = position;
    const { pga } = this;
    return {
      x: getFixPixelGridAlignmentVal(x, pga),
      y: getFixPixelGridAlignmentVal(y, pga),
    };
  }

  protected _getFixPixelGridBound(bound: XYWH){
    const {x, y, w, h} = bound;
    const { pga } = this;
    const pgaX = getFixPixelGridAlignmentVal(x, pga);
    const pgaY = getFixPixelGridAlignmentVal(y, pga);
    const pgaW = getFixPixelGridAlignmentVal(x + w, pga) - pgaX;
    const pgaH = getFixPixelGridAlignmentVal(y + h, pga) - pgaY;

    return {
      x: pgaX,
      y: pgaY,
      w: Math.abs(pgaW),
      h: Math.abs(pgaH),
    };
  }

}
