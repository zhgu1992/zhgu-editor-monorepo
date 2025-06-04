import type { ICollectionUIManager, TJsPointerEvent } from '../../../interface';
import { BehaviorNode } from '..';
import { setRegion } from '@zhgu/data';
import type { View } from '../../../view';

/**
 * 屏幕自由滚动行为
 */
export class ScreenScrollingBehaviorNode extends BehaviorNode{
  zoomSpeed = 1;
  panSpeed = 2;
  constructor(view: View, collectionUIManager: ICollectionUIManager) {
    super(view, 'screen-scroll', collectionUIManager);
  }

  override onWheel: TJsPointerEvent = (inputSnapshot) => {
    const {zoomSpeed, panSpeed: PAN_SPEED} = this;
    const { wheelDeltaXY, ctrlKey, cmdKey, currentPagePoint, shiftKey } = inputSnapshot;
    let { x: dx, y: dy } = wheelDeltaXY;
    const  viewPort = this.view.eventManager!.viewPort;

    if (ctrlKey || cmdKey) {
      // 缩放
      const { zoom: oldZoom } = viewPort;
      let scaleZoom;

      // 保证放大缩小按相同速率更新，速率参考老项目变化速率
      if (dy >= 0) {
        const ratio = setRegion(1 - (dy * 1.96) / 200, 0.5, 1); // 根据老项目变化推出1.96 / 200变化率约等于0.039
        scaleZoom = oldZoom * ratio * zoomSpeed;
      } else { // 放大，zoom变大
        const ratio = setRegion(1 + (dy * 1.96) / 200, 0.5, 1);
        scaleZoom = oldZoom / ratio * zoomSpeed;
      }


      const newZoom = Math.min(256, Math.max(0.02, scaleZoom));
      viewPort.zoomAt(currentPagePoint, {state: 0, zoom: newZoom});
    } else {
      if (shiftKey && dx === 0) {
        const middle = dx;
        dx = dy;
        dy = middle;
      }
      // 移动
      const zoom = viewPort.zoom;
      const { x: oldX, y: oldY } = viewPort.position;
      const newX = oldX + (dx / zoom) * PAN_SPEED;
      const newY = oldY + (dy / zoom) * PAN_SPEED;
      viewPort.position = { x: newX, y: newY };
    }
  };
}
