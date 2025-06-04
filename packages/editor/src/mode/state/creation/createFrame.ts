import { ClickFrameBehaviorNode, DragCreationFrameBehaviorNode } from '../../behavior/creation';
import { ActiveStateNode } from '../baseState';
import { StateFactory } from '../../base/factory';
import { EEditorStateName } from '../../../const';

export class CreateFrameStateNode extends ActiveStateNode {

  initBehaviors(): void {
    const behaviors = [
      new ClickFrameBehaviorNode(this.view, this.collectionUIManager, this),
      new DragCreationFrameBehaviorNode(this.view, this.collectionUIManager, this),
    ];
    behaviors.forEach(behavior => {
      this.registerBehavior(behavior);
    });
  }

  onEnter(): void {
    super.onEnter();
    this.view.canvasManager?.setCursorType('cursor-crosshair');
  }
}

StateFactory.register(EEditorStateName.CreateFrame, CreateFrameStateNode);
