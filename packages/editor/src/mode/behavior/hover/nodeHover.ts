import { BehaviorNode } from '..';
import type { ICollectionUIManager, TJsPointerEvent } from '../../../interface';
import type { View } from '../../../view';

/**
 * 节点hover框行为
 */
export class NodeHoverBehaviorNode extends BehaviorNode {
  constructor(view: View, collectionUIManager: ICollectionUIManager) {
    super(view, 'hover', collectionUIManager);
  }

  override onPointerMove: TJsPointerEvent = inputSnapshot => {
    const { isDragging, currentPagePoint } = inputSnapshot;
    const {
      view: { eventManager, picker, scene },
    } = this;
    if (!inputSnapshot.isCanvas || !eventManager || !picker) {
      return;
    }
    const area = this.collectionUIManager.pickArea(currentPagePoint);
    if (area[0]) {
      this.view.canvasManager?.setCursorType(area[0].cursor as string);
    } else {
      this.view.canvasManager?.setCursorType('cursor-default');
    }
    const selectedNodes = this.view.eventManager!.selectedNodes;
    if (area.length && selectedNodes.length > 1) {
      eventManager.hoverNode = null;
      return;
    }
    const result = picker.pick(currentPagePoint);
    eventManager.hoverNode = result;
  };

  onExit(): void {
    super.onExit();
    const {
      view: { eventManager, picker, scene },
    } = this;
    if (!eventManager || !picker) {
      return;
    }
    // 切换活动状态时清空 hover
    eventManager.hoverNode = null;
  }
}
