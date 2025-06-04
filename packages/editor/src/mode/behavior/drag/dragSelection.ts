import { DragBaseBehaviorNode } from './dragBase';
import type { ICollectionUIManager, ICustomCollection, IInputSnapshot, TJsDragMoveEvent } from '../../../interface';
import type { View } from '../../../view';
import { DragNodeState } from '../../customNode';
/**
 * 框选
 */
export class DragSelectionBehavior extends DragBaseBehaviorNode {
  private _dragBox: DragNodeState;
  protected needUpdateData = false;
  protected needHideUIWhenMoving = false;

  constructor(view: View, collectionUIManager: ICollectionUIManager) {
    super(view, 'drag-box', collectionUIManager);
    this._dragBox = new DragNodeState('drag-box', view);
    this._dragBox.init();
    this._dragBox.isVisible = false;
  }

  onExit() {
    super.onExit();
    this._dragBox.destroy();
    const eventManager = this.view.eventManager!;
    eventManager.selectedNodes = [];
  }

  get dragBox() {
    return this._dragBox;
  }

  shouldDrag(areaNode: ICustomCollection, inputSnapshot: IInputSnapshot): boolean {
    if (areaNode && !inputSnapshot.cmdKey) {
      return false;
    }
    return true;
  }

  onDragStart: TJsDragMoveEvent = (message, positionMessage) => {
    const {dragBox} = this;
    if(!dragBox){
      return;
    }
    dragBox.setPosition(dragBox.x, dragBox.y);
  };


  onDragMove: TJsDragMoveEvent = (message, positionMessage) => {
    const eventManager =  this.view.eventManager;
    if(!eventManager){
      return;
    }
    const dragBox = this._dragBox;
    dragBox.setPath();
    dragBox.setPosition(dragBox.x, dragBox.y);
    dragBox.update();
    dragBox.isVisible = true;
    const results = this.view.picker!.pickByBox(dragBox);
    eventManager.selectedNodes = results;
  };

  onDragEnd = () => {
    this._dragBox.isVisible = false;
  };
}
