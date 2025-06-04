import { ActiveStateNode } from './baseState';
import {
  DragMovingBehavior,
  DragResizeBehavior,
  DragRotateBehavior,
  DragSelectionBehavior,
  NodeHoverBehaviorNode,
  NodeSelectBehaviorNode,
  ScreenScrollingBehaviorNode
} from '../behavior';
import {
  BBorderResizeEventArea,
  LBorderResizeEventArea,
  LBPointResizeEventArea,
  LBPointRotateEventArea,
  LTPointResizeEventArea,
  LTPointRotateEventArea,
  RBorderResizeEventArea,
  RBPointResizeEventArea,
  RBPointRotateEventArea,
  RTPointResizeEventArea,
  RTPointRotateEventArea,
  TBorderResizeEventArea
} from '../customNode';
import { BaseCollectionArea } from '../../node';
import { StateFactory } from '../base/factory';
import { EEditorStateName } from '../../const';


export class DefaultStateNode extends ActiveStateNode{

  /**
   * 初始化behavior以及其对应的热区
   */
  initBehaviors(): void {
    const { view, collectionUIManager } = this;
    const dragMovingArea = [new BaseCollectionArea('drag-move', collectionUIManager, view)];
    const dragResizeArea = [
      new LBorderResizeEventArea('resize-l', collectionUIManager, view),
      new RBorderResizeEventArea('resize-r', collectionUIManager, view),
      new TBorderResizeEventArea('resize-t', collectionUIManager, view),
      new BBorderResizeEventArea('resize-b', collectionUIManager, view),

      new LTPointResizeEventArea('resize-lt', collectionUIManager, view),
      new RTPointResizeEventArea('resize-rt', collectionUIManager, view),
      new RBPointResizeEventArea('resize-rb', collectionUIManager, view),
      new LBPointResizeEventArea('resize-lb', collectionUIManager, view),

      new LTPointRotateEventArea('rotate-lt', collectionUIManager, view),
      new RTPointRotateEventArea('rotate-rt', collectionUIManager, view),
      new RBPointRotateEventArea('rotate-rb', collectionUIManager, view),
      new RBPointRotateEventArea('rotate-lb', collectionUIManager, view),
    ];
    const dragRotateArea = [
      new LTPointRotateEventArea('rotate-lt', collectionUIManager, view),
      new RTPointRotateEventArea('rotate-rt', collectionUIManager, view),
      new RBPointRotateEventArea('rotate-rb', collectionUIManager, view),
      new LBPointRotateEventArea('rotate-lb', collectionUIManager, view),
    ];

    const behaviors = [
      new NodeSelectBehaviorNode(this.view, this.collectionUIManager),
      new DragSelectionBehavior(this.view, this.collectionUIManager),
      new NodeHoverBehaviorNode(this.view, this.collectionUIManager),
      new DragMovingBehavior(this.view, this.collectionUIManager, dragMovingArea),
      new DragRotateBehavior(this.view, this.collectionUIManager, dragRotateArea),
      new DragResizeBehavior(this.view, this.collectionUIManager, dragResizeArea),
      // new ScreenScrollingBehaviorNode(this.view, this.collectionUIManager),
    ];
    behaviors.forEach(behavior => {
      this.registerBehavior(behavior);
    });
  }

  onEnter(): void {
    super.onEnter();
    this.view.canvasManager?.setCursorType('cursor-default');
  }
}

StateFactory.register(EEditorStateName.Default, DefaultStateNode);
