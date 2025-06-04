import { DragBaseBehaviorNode } from './dragBase';
import type {
  IInputSnapshot,
  ICustomCollection,
  ICollectionUIManager,
  TJsDragStartEvent,
  TJsDragMoveEvent,
} from '../../../interface';
import type { View } from '../../../view/';
import { mat3 } from 'gl-matrix';
import { type Transaction, type XYPos } from '@zhgu/type';
import type { BaseRotatePoint } from '../../UIElement';
import { getAngleByRotate, getMaxAABB } from '@zhgu/data';
import { getRotateCursor, type CornerDirection } from '../../../utils';

export class DragRotateBehavior extends DragBaseBehaviorNode {
  private startAngle: number = 0;
  private originAngle: number = 0;
  private lastAngle: number = 0;
  private originAt: mat3 = mat3.create();
  private centerScreenPos: XYPos = { x: 0, y: 0 };
  // 旋转超出屏幕不能修改viewport大小
  protected viewPortChangeIfOutOfScreen = false;
  protected needHideUIWhenMoving = false;

  constructor(view: View, collectionUIManager: ICollectionUIManager, areaNodes: ICustomCollection[]) {
    super(view, 'drag-rotate', collectionUIManager, areaNodes);
  }

  override shouldDrag(areaNode: ICustomCollection, inputSnapshot: IInputSnapshot) {
    const { view } = this;
    if (view.eventManager?.selectedNodes.length === 0 || inputSnapshot.cmdKey) {
      return false;
    }

    return super.shouldDrag(areaNode, inputSnapshot);
  }

  override onDragStart: TJsDragStartEvent = (areaNode, inputSnapshot) => {
    const { area } = areaNode;
    if (!area) {
      return;
    }
    const {
      collection: { nodes },
    } = area as BaseRotatePoint;
    const { x, y, w, h } = getMaxAABB(nodes);
    this.centerScreenPos = { x: x + w / 2, y: y + h / 2 } as XYPos;
    this.originAngle = nodes.length === 1 ? nodes[0].rotation : 0;
    this.originAt = nodes.length === 1 ? mat3.clone(nodes[0].at) : mat3.create();
    this.startAngle = -getAngleByRotate(this.centerScreenPos, inputSnapshot.currentPagePoint);
  };

  onDragMove: TJsDragMoveEvent = (message, inputSnapshot) => {
    const { area } = message;
    this.dragRotate(area as BaseRotatePoint, inputSnapshot);
  };

  onDragEnd?: TJsDragStartEvent | undefined = message => {
    this.lastAngle = 0;
  };

  /**
   * 拖拽旋转
   * @param e
   * @param nodes
   */
  private dragRotate(collideArea: BaseRotatePoint, inputSnapshot: IInputSnapshot) {
    const { startAngle, lastAngle, originAngle, centerScreenPos } = this;
    const { shiftKey, currentPagePoint } = inputSnapshot;
    const {
      collection: { nodes },
    } = collideArea;

    const currentAngle = -getAngleByRotate(centerScreenPos, currentPagePoint); // 当前三点钟, 逆时针为正角度
    let changeAngle = currentAngle - startAngle; // 鼠标从点击到现在的旋转角度
    let dr; // 每次鼠标移动角度变化值

    if (shiftKey) {
      // 将 changeAngle 对齐到最近的 15 度倍数
      const snapAngle = Math.round((changeAngle + originAngle) / 15) * 15;
      dr = snapAngle - lastAngle - originAngle; // 调整 dr 以反映对齐后的角度变化
      changeAngle = snapAngle - originAngle; // 更新 changeAngle 到对齐后的值
    } else {
      // 松开 Shift 键，计算相对于最后对齐角度的变化
      dr = changeAngle - lastAngle;
    }

    this.lastAngle = changeAngle;

    const transactions: Transaction = [];
    nodes.forEach(node => {
      transactions.push(node.changeRotation(dr, [this.centerScreenPos.x, this.centerScreenPos.y]));
    });
    this.updateRotateCursor(collideArea.rotateType, dr);
    this.view.applyTransaction(transactions);
    this.collectionUIManager.update();
  }

  /**
   * 更新旋转指针
   * @param key
   * @param dr
   */
  private updateRotateCursor(key: CornerDirection, dr: number) {
    this.view.canvasManager?.setCursorType(getRotateCursor({ apoints: this.collectionUIManager.apoints, key }, dr));
  }
}
