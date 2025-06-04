import { BehaviorNode } from '../index';
import type { View } from '../../../view';
import type { ICollectionUIManager, IStateNode, TJsPointerEvent } from '../../../interface';
import { ESceneElementType, EElementChangeType } from '@zhgu/type';
import { mat2obj } from '@zhgu/data';
import { mat3 } from 'gl-matrix';
import { getDefaultStyle } from '../../../utils';

export class ClickCreationBehaviorNode extends BehaviorNode {
  private _clickState: IStateNode;
  protected creationType = ESceneElementType.Rectangle;
  constructor(view: View, collectionUIManager: ICollectionUIManager, state: IStateNode) {
    super(view, 'clickCreation', collectionUIManager);
    this._clickState = state;
  }

  override onClick: TJsPointerEvent = inputSnapshot => {
    const { view } = this;
    const parentNode = view.scene.currentPage;
    // 获取初始化点击创建大小 [1, 100]
    const canvasDom = view.canvas!;
    const min = Math.min(canvasDom.clientHeight, canvasDom.clientWidth);
    let initializeSize = Math.round(min / view.viewPort!.zoom);
    switch (true) {
      case initializeSize > 100: {
        initializeSize = 100;
        break;
      }
      case initializeSize < 1: {
        initializeSize = 1;
        break;
      }
    }

    // 创建node的boundingBox
    const { currentPagePoint } = inputSnapshot;
    const style = getDefaultStyle(this.creationType, this.view);
    initializeSize = style.w ?? initializeSize;
    const boundingBox = {
      x: currentPagePoint.x - initializeSize / 2,
      y: currentPagePoint.y - initializeSize / 2,
      w: initializeSize,
      h: initializeSize,
    };
    // 像素网格对齐处理
    const fixPos = this.getPositionDataByPGA(boundingBox);

    const rt = mat3.create();
    rt[6] = fixPos.x;
    rt[7] = fixPos.y;
    const transform = mat2obj(rt);
    const parentId = parentNode.id;
    const parentPosition = parentNode.parentPosition;
    const element = view.documentExchange.createElement(this.creationType, {
      ...style,
      transform,
      w: boundingBox.w,
      h: boundingBox.h,
      parentIndex: {
        id: parentId,
        position: parentPosition,
      },
    });
    const elementId = element.id;

    view.applyTransaction([
      {
        type: EElementChangeType.Add,
        id: elementId,
        data: element,
      },
    ]);

    const node = view.scene.getNodeById(elementId);
    view.commitHistory();
    // 完成后直接退出状态
    this._clickState.exitToDefault();
    view.eventManager!.selectedNodes = [node];
  };
}
