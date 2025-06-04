import { ESceneElementType } from '@zhgu/type';
import { DragCreationBehaviorNode } from '../dragCreation';

export class DragCreationFrameBehaviorNode extends DragCreationBehaviorNode {
  protected creationType = ESceneElementType.Frame;
}
