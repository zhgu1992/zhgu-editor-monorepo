import type { IBaseNode, ICustomStyledOptions } from '../../interface';
import { CustomNode } from './CustomNode';
import type { View } from '../../view';

/**
 * 自定义节点的特殊属性
 */
export class BaseCustomUnit extends CustomNode {
  node: IBaseNode;

  constructor(id: string, relatedNode: IBaseNode, view: View, options?: Partial<ICustomStyledOptions>) {
    super(id, view, options);
    this.node = relatedNode;
    this.setDefaultStyle();
  }

  get w(){
    return this.node.w;
  }

  get h(){
    return this.node.h;
  }

  get at(){
    return this.node.at;
  }

  get x() {
    return this.node.x;
  }

  get y() {
    return this.node.y;
  }
}
