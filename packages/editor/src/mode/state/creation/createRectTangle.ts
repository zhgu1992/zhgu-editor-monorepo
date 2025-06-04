import { ActiveStateNode } from '../baseState';
import { ClickCreationBehaviorNode, DragCreationBehaviorNode } from '../../behavior';
import { StateFactory } from '../../base/factory';
import { EEditorStateName } from '../../../const';

export class CreateRectTangleStateNode extends ActiveStateNode {

  initBehaviors(): void {
    const behaviors = [
      new ClickCreationBehaviorNode(this.view, this.collectionUIManager, this),
      new DragCreationBehaviorNode(this.view, this.collectionUIManager, this),
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
StateFactory.register(EEditorStateName.CreateRectTangle, CreateRectTangleStateNode);
