import type { ICollectionUIManager, TJsPointerEvent } from '../../../interface';
import type { View } from '../../../view/';
import { BehaviorNode } from '../baseBehavior';

/**
 * 单选行为，只需要选中即可
 */
export class NodeSelectBehaviorNode extends BehaviorNode {
  constructor(view: View, collectionUIManager: ICollectionUIManager) {
    super(view, 'select', collectionUIManager);
  }

  /**
   * 点选
   * @param e
   */
  override onPointerDown: TJsPointerEvent = (inputSnapshot) => {
    const {view: {eventManager, picker, scene}} = this;
    if(!eventManager || !picker) {
      return;
    }
    const { shiftKey, currentPagePoint, button } = inputSnapshot;
    // 如果拿到热区则证明已经被其他behavior形成热区了，因此可以直接结束
    const area = this.collectionUIManager.pickArea(currentPagePoint);
    if(area.length){
      return;
    }
    const result = picker.pick(currentPagePoint);
    eventManager.selectedNodes = result === null ? [] : [result];
  };

  onClick: TJsPointerEvent = (inputSnapshot) => {
    const {view: {eventManager, picker, scene}} = this;
    if(!eventManager || !picker) {
      return;
    }
    const { shiftKey, currentPagePoint, button } = inputSnapshot;
    const result = picker.pick(currentPagePoint);
    eventManager.selectedNodes = result === null ? [] : [result];
  };

  onExit(): void {
    super.onExit();
    const {view: {eventManager}} = this;
    if(!eventManager) {
      return;
    }
    eventManager.selectedNodes = [];
  }

}
