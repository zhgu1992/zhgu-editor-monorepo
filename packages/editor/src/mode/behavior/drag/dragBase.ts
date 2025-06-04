import type {
  TJsKeyboardEvent,
  TJsPointerEvent,
  IInputSnapshot,
  ICustomCollection,
  ICollectionUIManager,
} from '../../../interface';
import { BehaviorNode } from '../baseBehavior';
import autobind from 'autobind-decorator';
import type { XYPos } from '@zhgu/type';
import type { EventManager } from '../../../event';
import type { View } from '../../../view';

/**
 * 使用说明：
 * DragBaseBehaviorNode为拖拽处理的专属行为，对拖拽做了统一的封装。
 * 开发同学只需要关注并处理 onDragStart、onDragMove、onDragEnd 三个钩子即可。
 */
export class DragBaseBehaviorNode extends BehaviorNode {
  private _shouldDrag = false;
  // 当前选中的热区信息
  protected areaNodes: ICustomCollection[] = [];
  private _currentAreaNode?: ICustomCollection | null = null;
  // 记录鼠标位置
  private _lastDragPosition: XYPos = { x: 0, y: 0 };
  private _lastDragScreenPosition: XYPos = { x: 0, y: 0 };
  // 超出屏幕是否修改viewPort
  protected viewPortChangeIfOutOfScreen = false;
  // 是否进行数据变更
  protected needUpdateData = true;
  protected needHideUIWhenMoving: boolean = true;

  constructor(
    view: View,
    type: string,
    collectionUIManager: ICollectionUIManager,
    areaNodes: ICustomCollection[] = []
  ) {
    super(view, type, collectionUIManager);
    this.areaNodes = areaNodes;
  }

  onEnter(): void {
    super.onEnter();
    // 进入后构建热区
    this.areaNodes = this.initArea();
    this.collectionUIManager.update(new Set(['transform', 'size']));
  }

  // 初始化自己的热区
  initArea() {
    const { view } = this;
    const collectionUIManager = this.collectionUIManager!;
    this.areaNodes.forEach(area => {
      collectionUIManager.setAreaRelation(area, this);
    });
    return [] as ICustomCollection[];
  }

  onExit(): void {
    super.onExit();
    const { collectionUIManager } = this;
    // 退出销毁热区
    this.areaNodes.forEach(v => {
      collectionUIManager.removeArea(v);
    });
  }

  protected bindDragEvents(eventManager: EventManager) {
    eventManager.on('dragstart', this._onDragStartCb);
    eventManager.on('dragmove', this._onDragMoveCb);
    eventManager.on('dragend', this._onDragEndCb);
  }

  protected removeDragEvents(eventManager: EventManager) {
    eventManager.off('dragstart', this._onDragStartCb);
    eventManager.off('dragmove', this._onDragMoveCb);
    eventManager.off('dragend', this._onDragEndCb);
  }

  /**
   * 判断是否可以拖拽，拖拽前被调用
   * @param areaNodes
   * @param inputSnapshot
   * @returns
   */
  shouldDrag(areaNode: ICustomCollection | null, inputSnapshot: IInputSnapshot) {
    if (!areaNode) {
      return false;
    }
    // 获取碰撞的最上面的热区
    const {
      collection: { nodes },
    } = areaNode;
    this._currentAreaNode = areaNode;
    const behavior = this.collectionUIManager?.getBehaviorByArea(areaNode);
    return behavior?.id === this.id;
  }

  @autobind
  private _onDragStartCb(inputSnapshot: IInputSnapshot) {
    const areaNode = this.collectionUIManager.pickArea(inputSnapshot.originPagePoint)?.[0] ?? null;
    this._shouldDrag = this.shouldDrag(areaNode, inputSnapshot);
    const { currentPagePoint, currentScreenPoint } = inputSnapshot;
    this._lastDragPosition = { ...currentPagePoint };
    this._lastDragScreenPosition = { ...currentScreenPoint };
    if (this._shouldDrag) {
      this.onDragStart?.(
        {
          area: this._currentAreaNode ?? null,
        },
        {
          ...inputSnapshot,
          lastPagePoint: this._lastDragPosition,
          lastScreenPoint: this._lastDragScreenPosition,
        }
      );
      if (this.needHideUIWhenMoving) {
        this.collectionUIManager.hideUI();
      }
      if (this.needUpdateData) {
        this.view.startCompressTransaction();
      }
    }
  }

  @autobind
  private _onDragMoveCb(inputSnapshot: IInputSnapshot) {
    if (this._shouldDrag) {
      if (this.viewPortChangeIfOutOfScreen) {
        const {
          view: { eventManager },
        } = this;
        eventManager!.eventEntry.canvasEdgeMovement(({ inputSnapshot: data }) => {
          const { currentPagePoint, currentScreenPoint } = data;
          this._dragMoveFunc({
            ...inputSnapshot,
            currentPagePoint,
            currentScreenPoint,
          });
        });
      } else {
        this._dragMoveFunc(inputSnapshot);
      }
    }
  }

  @autobind
  private _dragMoveFunc(inputSnapshot: IInputSnapshot) {
    this.onDragMove?.(
      {
        area: this._currentAreaNode!,
      },
      {
        ...inputSnapshot,
        lastPagePoint: this._lastDragPosition,
        lastScreenPoint: this._lastDragScreenPosition,
      }
    );
    // 如果不隐藏UI，因为性能问题，需要自行进行update调用
    this._processLastPosition(inputSnapshot);
  }

  @autobind
  private _onDragEndCb(inputSnapshot: IInputSnapshot) {
    if (this._shouldDrag) {
      this.onDragEnd?.(
        {
          area: this._currentAreaNode!,
        },
        {
          ...inputSnapshot,
          lastPagePoint: this._lastDragPosition,
          lastScreenPoint: this._lastDragScreenPosition,
        }
      );

      // 清空行为信息
      this._processLastPosition(inputSnapshot);
      this._shouldDrag = false;
      this._currentAreaNode = null;
      if (this.needHideUIWhenMoving) {
        this.collectionUIManager.update(new Set(['transform', 'size']));
        this.collectionUIManager.showUI();
      }
      if (this.needUpdateData) {
        this.view.commitHistory();
      }
    }
  }

  // wheel结合拖拽处理
  override onWheel: TJsPointerEvent = inputSnapshot => {
    this._onDragMoveCb(inputSnapshot);
  };

  // keyDown结合拖拽处理
  override onKeyDown?: TJsKeyboardEvent = inputSnapshot => {
    this._onDragMoveCb(inputSnapshot);
  };

  // keyUp结合拖拽处理
  override onKeyUp?: TJsKeyboardEvent = inputSnapshot => {
    this._onDragMoveCb(inputSnapshot);
  };
  // todo 处理lastPosition信息、目前暂时只处理drag相关，后续需要统一处理
  private _processLastPosition(inputSnapshot: IInputSnapshot) {
    const { currentPagePoint, currentScreenPoint } = inputSnapshot;
    // const enabledPGA = this.view!.configManager!.PGAEnabled;
    const enabledPGA = false;
    // pga 模式下通过diff处理对齐像素网格的逻辑，但是最终的结果需要业务侧自行处理
    if (enabledPGA) {
      const { x: diffX, y: diffY } = this._getFixPixelGridPos({
        x: currentPagePoint.x - this._lastDragPosition.x,
        y: currentPagePoint.y - this._lastDragPosition.y,
      });
      if (Math.abs(diffX) >= 1 || Math.abs(diffY) >= 1) {
        this._lastDragPosition = { x: this._lastDragPosition.x + diffX, y: this._lastDragPosition.y + diffY };
        this._lastDragScreenPosition = { ...currentScreenPoint };
      }
    } else {
      this._lastDragPosition = { ...currentPagePoint };
      this._lastDragScreenPosition = { ...currentScreenPoint };
    }
  }
}
