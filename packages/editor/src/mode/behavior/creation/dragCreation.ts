import type { ElementChange, Transaction, XYPos } from '@zhgu/type';
import { ESceneElementType, EElementChangeType } from '@zhgu/type';
import { DragBaseBehaviorNode } from '../drag/dragBase';
import type { IBaseNode, ICustomCollection, IInputSnapshot } from '../../../interface';
import type { View } from '../../../view/';
import type {
  ICollectionUIManager,
  IStateNode,
  TJsDragEndEvent,
  TJsDragMoveEvent,
  TJsDragStartEvent,
} from '../../../interface';
import { getBoundingByPos, getDefaultStyle, mat2obj } from '../../../utils';
import { mat3 } from 'gl-matrix';

export class DragCreationBehaviorNode extends DragBaseBehaviorNode {
  private node: IBaseNode | undefined;
  private _clickState: IStateNode;
  private type: string | undefined = '';
  protected needHideUIWhenMoving: boolean = false;
  protected creationType = ESceneElementType.Rectangle;

  constructor(view: View, collectionUIManager: ICollectionUIManager, stateNode: IStateNode) {
    super(view, 'dragCreation', collectionUIManager);
    this._clickState = stateNode;
  }

  override shouldDrag(areaNode: ICustomCollection, inputSnapshot: IInputSnapshot) {
    return true;
  }

  override onDragStart: TJsDragStartEvent = (areaNode, inputSnapshot) => {};

  override onDragMove: TJsDragMoveEvent = (message, inputSnapshot) => {
    this.createAndDragMoving(inputSnapshot);
    this.collectionUIManager.update(new Set(['transform', 'size']));
  };

  override onDragEnd: TJsDragEndEvent = (message, positionMessage) => {
    if (!this.node) {
      return;
    }
    this._clickState.exitToDefault();
    this.view.eventManager!.selectedNodes = [this.node];
  };

  private createAndDragMoving(inputSnapshot: IInputSnapshot) {
    let { originPagePoint, currentPagePoint, shiftKey, altKey } = inputSnapshot;
    const { view, node } = this;
    // 像素网格对齐处理
    const parentNode = view.scene.currentPage;
    // const isContainer = isContainerNode(this.node as IBaseNode);
    currentPagePoint = this.getPositionDataByPGA(currentPagePoint);
    originPagePoint = this.getPositionDataByPGA(originPagePoint);
    // 创建节点
    if (!node) {
      const boundingBox = getBoundingByPos(originPagePoint, currentPagePoint);
      // 对齐像素网格
      const fixBox = this.getFixPixelGridBoundByPGA(boundingBox);

      // 创建容器时默认开启对齐像素网格
      if (fixBox.w === 0) {
        fixBox.w = 1;
      }
      if (fixBox.h === 0) {
        fixBox.h = 1;
      }
      const rt = mat3.create();
      rt[6] = fixBox.x;
      rt[7] = fixBox.y;
      const transform = mat2obj(rt);
      const parentId = parentNode.id;
      const parentPosition = parentNode.parentPositionEnd();

      const element = view.documentExchange.createElement(this.creationType, {
        ...getDefaultStyle(this.creationType, this.view),
        transform,
        parentIndex: {
          id: parentId,
          position: parentPosition,
        },
        ...fixBox,
      });

      view.applyTransaction([
        {
          type: EElementChangeType.Add,
          id: element.id,
          data: element,
        },
      ]);

      const node = view.scene.getNodeById(element.id) as IBaseNode;
      this.node = node;
      this.view.eventManager!.selectedNodes = [this.node];
    } else {
      this.resizeFromAToB(currentPagePoint, originPagePoint, shiftKey, altKey);
    }
  }

  resizeFromAToB(
    targetPoint: XYPos,
    currentPagePoint: XYPos,
    isEqualInAspectRatio: boolean,
    isResizingFromCenter: boolean
  ) {
    const { node } = this;

    const { x, y, w, h } = getBoundingByPos(targetPoint, currentPagePoint);

    const transactions: Transaction = [
      node?.changeAbsolutePos({ x, y }) as ElementChange,
      node?.changeSize({ w, h }) as ElementChange,
    ];

    this.view.applyTransaction(transactions);
  }
}
