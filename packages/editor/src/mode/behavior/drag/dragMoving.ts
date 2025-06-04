import { DragBaseBehaviorNode } from './dragBase';
import type {
  IPositionMessage,
  TJsDragMoveEvent,
  ICustomNode,
  IInputSnapshot,
  IBaseNode,
  ICollideMessage,
  ICustomCollection,
  ICollectionUIManager,
} from '../../../interface';
import { handleHorizontalOrVertical } from '../../../utils';
import { getMaxAABB } from '@zhgu/data';
import type { XYPos, XYWH } from '@zhgu/type';
import { mat3 } from 'gl-matrix';
import type { View } from '../../../view';
import type { Transaction } from '@zhgu/type';

type INodeInfo = {
  index: number;
  parentId?: string;
  at: mat3;
};
export class DragMovingBehavior extends DragBaseBehaviorNode {
  protected hideUIIfDragging = true;
  private beginCenterPos: XYPos = { x: 0, y: 0 };
  private beginPos: XYPos[] = [];
  private beginAABB: XYWH = { x: 0, y: 0, w: 0, h: 0 };
  // 定时器，用于移动碰撞优化
  private collisionTimer: number | null = null;
  // 记录初期每个节点的状态
  private startNodesInitialParentId: Record<string, INodeInfo> = {};
  // 记录初始拖拽的节点，默认为pageNode
  private initialCollideGroupNode: IBaseNode | null = null;
  private currentCollideGroupNode: IBaseNode | null = null;
  // 集中容器节点的渲染节点
  private focusRenderNode: ICustomNode | null = null;
  // 拖拽起始画板是否为自动布局
  private isInitialAutoLayout: boolean = false;
  private _lastAlt = false; // 记录上一次alt
  private _copyNodes: IBaseNode[] | null = null;
  private _diff: XYPos = { x: 0, y: 0 };

  constructor(view: View, collectionUIManager: ICollectionUIManager, areaNodes: ICustomCollection[]) {
    super(view, 'drag-moving', collectionUIManager, areaNodes);
  }

  /** 聚焦或者销毁聚焦自定义组件 */
  private handleNodeFocus(node?: IBaseNode) {
    if (!node) {
      this.focusRenderNode?.destroy();
      return;
    }
  }

  override shouldDrag(areaNode: ICustomCollection, inputSnapshot: IInputSnapshot) {
    const { view } = this;
    if (view.eventManager?.selectedNodes.length === 0 || inputSnapshot.cmdKey) {
      return false;
    }

    return super.shouldDrag(areaNode, inputSnapshot);
  }

  override onDragStart: TJsDragMoveEvent = (collideMessage: ICollideMessage, positionMessage) => {
    const { view } = this;
    this.startNodesInitialParentId = {};
    // @ts-ignore
    const { originPagePoint } = positionMessage;

    const selectedNodes = view.eventManager!.selectedNodes;
    if (selectedNodes.length === 0) {
      return;
    }

    // 拖拽初期记录选中的节点位置信息以及父级信息
    selectedNodes.forEach(node => {
      // @ts-ignore
      const index = node.parent ? node.parent.children.indexOf(node) : -1;
      this.startNodesInitialParentId[node.id] = {
        parentId: node.parent?.id,
        index,
        at: mat3.copy(mat3.create(), node.at),
      };
    });
    const { x, y, w, h } = getMaxAABB(selectedNodes);
    this.beginCenterPos = { x: x + w / 2, y: y + h / 2 } as XYPos;
    // 记录初始拖拽位置
    // @ts-ignore
    this.beginPos = selectedNodes.map(node => ({ x: node.at[6], y: node.at[7] }));
    this.beginAABB = { x, y, w, h };
    this.currentCollideGroupNode = this.initialCollideGroupNode;
  };

  override onDragMove: TJsDragMoveEvent = (collideMessage: ICollideMessage, positionMessage) => {
    const { view } = this;
    const selectedNodes = view.eventManager!.selectedNodes;
    if (selectedNodes.length === 0) {
      return;
    }
    this.dragMove(selectedNodes, positionMessage);
  };

  override onDragEnd: TJsDragMoveEvent = (collideMessage: ICollideMessage, message) => {
    if (this.collisionTimer) {
      window.clearTimeout(this.collisionTimer);
    }
    this.collisionTimer = null;
  };

  private dragMove(nodes: IBaseNode[], options: IPositionMessage) {
    if (!nodes) {
      return false;
    }
    const { shiftKey, cmdKey, currentPagePoint, originPagePoint, currentScreenPoint, lastScreenPoint } = options;
    let newCurrentPagePoint = currentPagePoint;
    const { view } = this;

    const { x, y } = this.beginAABB;

    const movementX = currentPagePoint.x - originPagePoint.x; // 拖拽移动距离
    const movementY = currentPagePoint.y - originPagePoint.y;

    const { x: fixX, y: fixY } = this.getPositionDataByPGA({ x: x + movementX, y: y + movementY });

    let diffX = fixX - x; // 对齐像素网格后, 应该移动的距离
    let diffY = fixY - y;

    // 按下shift键，进行水平或垂直拖拽，获取水平或垂直的拖拽距离
    if (shiftKey) {
      newCurrentPagePoint = handleHorizontalOrVertical(this.beginCenterPos, currentPagePoint, originPagePoint); // shift修正后
      const { x: fixX, y: fixY } = this.getPositionDataByPGA({
        x: newCurrentPagePoint.x - originPagePoint.x,
        y: newCurrentPagePoint.y - originPagePoint.y,
      });
      diffX = fixX;
      diffY = fixY;
    }

    this._diff = {
      x: diffX,
      y: diffY,
    };

    // 过滤被锁定的node
    // 更新拖拽距离
    const transactions: Transaction = [];
    nodes.forEach((node, i) => {
      // if (node.isLocked) {
      //   return;
      // }
      const { x: beginX, y: beginY } = this.beginPos[i];
      const pos = {
        x: beginX + diffX,
        y: beginY + diffY,
      };
      const change = node.changeRelativePos(pos);
      transactions.push(change);
    });
    view.applyTransaction(transactions);
    return true;
  }
}
