import { CustomNode } from '../../../node';
import type { ICustomStyledOptions } from '../../../interface';
import { COLOR_CONFIG, ERenderGroupKey } from '../../../const';
import type { View } from '../../../view';
// import { handleFillPaints, handleStroke } from '../../../node';
import type { NodeGroup } from '../../../render';

/**
 * 拖拽框
 */
export class DragNodeState extends CustomNode {
  group: NodeGroup;
  constructor(id: string, view: View, options: Partial<ICustomStyledOptions> = {
    color: COLOR_CONFIG.primary(),
    opacity: 0.1,
    strokeColor: COLOR_CONFIG.primary(),
    strokeWeight: 1,
  }) {
    super(id, view, options);
    this.group = this.renderManager.getNodeGroup(ERenderGroupKey.Top)!;
    this.group.addNode(this);
  }

  init(){
    this.setDefaultStyle();
  }

  get x() {
    const { currentPagePoint, originPagePoint } = this.eventManager.snapshot;
    return Math.min(originPagePoint.x, currentPagePoint.x);
  }

  get y() {
    const { currentPagePoint, originPagePoint } = this.eventManager.snapshot;
    return Math.min(originPagePoint.y, currentPagePoint.y);
  }

  get w() {
    const { currentPagePoint, originPagePoint } = this.eventManager.snapshot;
    return Math.abs(originPagePoint.x - currentPagePoint.x);
  }

  get h() {
    const { currentPagePoint, originPagePoint } = this.eventManager.snapshot;
    return  Math.abs(originPagePoint.y - currentPagePoint.y);
  }

  destroy(){
    this.group.removeNodeById(this.id);
    super.destroy();
  }

  update(): void {
    super.update();
    // this.renderManager.updateRenderNode(this, this.renderNode, new Set(['size', 'transform']));
  }
}
