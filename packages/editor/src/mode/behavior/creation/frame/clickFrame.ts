import { ClickCreationBehaviorNode } from '../clickCreation';
import { ESceneElementType } from '@zhgu/type';

export class ClickFrameBehaviorNode extends ClickCreationBehaviorNode {
  protected creationType = ESceneElementType.Frame;
}
