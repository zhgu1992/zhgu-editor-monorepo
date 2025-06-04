import type { IInputSnapshot, TransEventType, MouseEventType, IEventHandles, DomEventType } from '../interface';
import { UserEnvironment } from '@zhgu/data';
import type { XYPos } from '@zhgu/type';
import type { ViewPort } from '../viewport';
import type { TCanvasEdgeMovementCb } from './canvasManager';
import type { AllEventType } from '../interface';
import { getSpeed } from './utils';
import autobind from 'autobind-decorator';

/**
 * dom原生事件封装
 * 因为snapShot需要全局使用，因此我们需要考虑如何设置，snapshot非特殊情况禁止修改
 */
export class EventEntry {
  // 事件监听器
  domWrapper: HTMLElement|Document;
  // 画布，我们需要根据事件和画布来自动地进行计算，用户无需感知具体细节
  canvasDom: HTMLCanvasElement;
  private _snapshot: IInputSnapshot = getDefaultSnapshot();
  private _viewPort: ViewPort;
  private _handledEventCache: Set<MouseEventType> = new Set();

  // 拖拽的阈值，当 x 或 y 的位移大于这个值时，识别为拖拽，否则识别为点击
  static DRAG_THRESHOLD = 4;
  // 事件管理器、用户事件函数
  private _eventListener = new Map<MouseEventType, Set<Function>>();
  // 最终的完整事件执行函数
  private _eventHandlers?: IEventHandles;
  // 鼠标按下事件信息存储
  private firstDocumentMousedownEvent: null | {
    nativeEvent: MouseEvent,
  } = null;
  // 拖拽信息封装，处理边缘case
  dragAutoChangePosSet: any = {
    autoChangeFunc: undefined,   // 获取滚动方向方法
    interval: 15,                // 单位ms,定时器频率
    autoScroll: undefined,       // 自动滚动方法
    speed: [0, 0],               // 滚动方向
    autoChangePos: {
      autoChangePosX: 0,         // 记录x轴滚动距离
      autoChangePosY: 0,         // 记录y轴滚动距离
    },
    ratio: [1, 1],
  };
  // todo drag
  // api 中的 event 实际添加到 dom 上的事件
  static API_EVENT_2_MOUSE_EVENT: Record<TransEventType, DomEventType[]> = {
    click: ['mousedown', 'mouseup'],
    dragstart: ['mousemove'],
    dragmove: ['mousedown', 'mousemove'],
    dragend: ['mouseup'],
    nomoveend: ['mouseup'],
  };

  constructor(domWrapper: HTMLElement|Document, canvasWrapper: HTMLCanvasElement, viewPort: ViewPort) {
    this.canvasDom = canvasWrapper;
    this.domWrapper = domWrapper;
    this._viewPort = viewPort;
    this.initEventHandlers();
  }

  // 关键方法，可能会修改全局变量，谨慎使用
  setConfig(config: Partial<IInputSnapshot>): void {
    this._snapshot = {
      ...this._snapshot,
      ...config
    };
  }

  get snapshot() {
    return this._snapshot;
  }


  get canvasDomId() {
    return this.canvasDom.id;
  }


  get eventListener(){
    return this._eventListener;
  }

  /**
   * 获取 eventMap 对应的 mouseEvent
   * @returns
   */
  getMouseEvents() {
    const mouseEvents = new Set<DomEventType>();
    const eventMap = this.eventListener;
    eventMap.forEach((value, key: AllEventType) => {
      (EventEntry.API_EVENT_2_MOUSE_EVENT[key as TransEventType] ?? [key])?.forEach(
        (event) => mouseEvents.add(event),
      );
    });
    return mouseEvents;
  }


  /**
   * @category jsdEditor
   * @namespace jsdEditor.EventAPI
   */
  handleChangedEvents(
    oldEvents: Set<MouseEventType>,
    newEvents: Set<MouseEventType>,) {
    // 处理删除的鼠标事件
    oldEvents.forEach((eventName) => {
      this.removeNativeMouseEvent(eventName);
    });

    // 处理新增的鼠标事件
    newEvents.forEach((eventName) => {
      if (!oldEvents.has(eventName)) {
        this.addNativeMouseEvent(eventName);
      }
    });
  }

  /**
   * 添加事件 暴露给业务使用的关键方法
   * @param type
   * @param cb
   */
  addMouseEvent<T extends Function>(
    type: MouseEventType,
    cb: T,
  ) {
    const eventMap = this.eventListener;
    const event = eventMap.get(type);
    if (!event) {
      eventMap.set(type, new Set([cb]));
      this.addNativeMouseEvent(type);
    } else {
      event.add(cb);
    }
  }

  /**
   * 移除事件 暴露给业务使用的关键方法
   * @param type
   * @param cb
   */
  removeMouseEvent<T extends Function>(
    type: MouseEventType,
    cb: T,
  ) {
    const eventMap = this.eventListener;
    const res =  eventMap.get(type);
    res?.delete(cb);
    if(!res || res.size === 0) {
      this.removeNativeMouseEvent(type);
    }
  }

  private addNativeMouseEvent(mouseEvent: MouseEventType, targetDom: HTMLElement | Document = this.domWrapper) {
    if(this._handledEventCache.has(mouseEvent)){
      return;
    }

    this._handledEventCache.add(mouseEvent);
    // @ts-ignore
    targetDom.addEventListener(mouseEvent, this._eventHandlers?.[mouseEvent] as EventListener);
  }


  private removeNativeMouseEvent(mouseEvent: MouseEventType, targetDom: HTMLElement | Document = this.domWrapper) {
    this._handledEventCache.delete(mouseEvent);
    // @ts-ignore
    targetDom.removeEventListener(mouseEvent, this._eventHandlers?.[mouseEvent] as EventListener);
  }

  reset(){
    this.clearEventModeListener();
  }

  /**
   * 移除当前模式下的所有监听
   */
  clearEventModeListener() {
    this.eventListener.clear();
    this._handledEventCache.forEach((type) => {
      this.removeNativeMouseEvent(type);
    });
    this._handledEventCache.clear();
  }

  initEventHandlers(){
    this._eventHandlers = {
      mousedown: this.handleMouseDownEvent,
      mousemove: this.handleMouseMoveEvent,
      mouseup:this.handleMouseUpEvent,
      drop: this.handleDropEvent,
      wheel: this.handleWheelEvent,
      keydown: this.handleKeyDownEvent,
      keyup: this.handleKeyUpEvent,
      dblclick: this.handleDblClickEvent,
    };
  }

  @autobind
  handleMouseDownEvent(e: MouseEvent) {
    const { x, y } = this.getEventPagePos(e);
    this.setConfig({
      originPagePoint: { x, y },
      originScreenPoint: { x: e.clientX, y: e.clientY },
      currentPagePoint: { x, y },
      currentScreenPoint: { x: e.clientX, y: e.clientY },
      shiftKey: e[UserEnvironment.hotkeyMap.shiftKey],
      cmdKey: e[UserEnvironment.hotkeyMap.cmdKey],
      altKey: e[UserEnvironment.hotkeyMap.altKey],
      ctrlKey: e['ctrlKey'],
      button: e.button,
    });
    if ((e.target as HTMLElement)?.id !== this.canvasDom.id) {
      return;
    }

    this.firstDocumentMousedownEvent = {
      nativeEvent: e,
    };

    this.triggerEvent('mousedown',this.snapshot);
  }
  @autobind
  handleMouseMoveEvent(e: MouseEvent) {
    const { x, y } = this.getEventPagePos(e);
    this.setConfig({
      currentPagePoint: { x, y },
      currentScreenPoint: { x: e.clientX, y: e.clientY },
      shiftKey: e[UserEnvironment.hotkeyMap.shiftKey],
      cmdKey: e[UserEnvironment.hotkeyMap.cmdKey],
      altKey: e[UserEnvironment.hotkeyMap.altKey],
      ctrlKey: e['ctrlKey'],
      button: e.button,
    });

    // 没有进行拖拽并且再canvas画布上触发
    if (e.buttons === 0 && (e.target as HTMLElement)?.id === this.canvasDom.id) {
      // 没有按住鼠标时，触发 mouseMove
      this.triggerEvent('mousemove', this.snapshot);
      return;
    }

    // 如果未点击到屏幕canvas上面，则视为无效拖拽
    if (!this.firstDocumentMousedownEvent) {
      return;
    }

    if (this.snapshot.isDragging) {
      this.triggerEvent('dragmove', this.snapshot);
    } else {
      // 事件防抖，小于DRAG_THRESHOLD物理像素，则视为非拖拽情况
      const { clientX, clientY } = e;
      const { clientX: oldClientX, clientY: oldClientY } = this.firstDocumentMousedownEvent.nativeEvent;
      const DRAG_THRESHOLD = EventEntry.DRAG_THRESHOLD;

      if (
        Math.abs(clientX - oldClientX) > DRAG_THRESHOLD ||
        Math.abs(clientY - oldClientY) > DRAG_THRESHOLD
      ) {
        this.setConfig({
          isDragging: true,
        });
        this.triggerEvent('dragstart',this.snapshot);
      }
    }
  }
  @autobind
  handleMouseUpEvent(e: MouseEvent) {
    const { x, y } = this.getEventPagePos(e);
    // 数据初始化
    this.setConfig({
      currentPagePoint: { x, y },
      currentScreenPoint: { x: e.clientX, y: e.clientY },
      shiftKey: e[UserEnvironment.hotkeyMap.shiftKey],
      cmdKey: e[UserEnvironment.hotkeyMap.cmdKey],
      altKey: e[UserEnvironment.hotkeyMap.altKey],
      ctrlKey: e['ctrlKey'],
      button: e.button,
    });

    if (!this.firstDocumentMousedownEvent) {
      // 执行mouseup事件
      (e.target as HTMLElement)?.id === this.canvasDom.id && this.triggerEvent('mouseup', this.snapshot);
      return;
    }

    if (this.snapshot.isDragging) {
      // uninstallCanvasEdgeMovement();
      this.triggerEvent('dragend', this.snapshot);
    } else {
      this.triggerEvent('click', this.snapshot);
    }
    // 执行mouseup事件
    this.triggerEvent('mouseup', this.snapshot);
    this.setConfig({
      isDragging: false,
    });
    this.firstDocumentMousedownEvent = null;
  }
  @autobind
  handleDropEvent(e: MouseEvent) {
    if ((e.target as HTMLElement)?.id === this.canvasDom.id) {
      this.triggerEvent('drop', this.snapshot);
    }
  }
  @autobind
  handleWheelEvent(e: WheelEvent) {
    if ((e.target as HTMLElement)?.id === this.canvasDom.id) {
      const { x, y } = this.getEventPagePos(e);
      this.setConfig({
        currentPagePoint: { x, y },
        currentScreenPoint: { x: e.clientX, y: e.clientY },
        wheelDeltaXY: { x: e.deltaX, y: e.deltaY },
        ctrlKey: e['ctrlKey']
      });
      this.triggerEvent('wheel', this.snapshot);
    }
  }
  @autobind
  handleKeyDownEvent(e: KeyboardEvent) {
    this.setConfig({
      shiftKey: e[UserEnvironment.hotkeyMap.shiftKey],
      cmdKey: e[UserEnvironment.hotkeyMap.cmdKey],
      altKey: e[UserEnvironment.hotkeyMap.altKey],
      ctrlKey: e['ctrlKey'],
      key: e.key,
    });

    this.triggerEvent('keydown', this.snapshot);
  }
  @autobind
  handleKeyUpEvent(e: KeyboardEvent) {
    this.setConfig({
      shiftKey: e[UserEnvironment.hotkeyMap.shiftKey],
      cmdKey: e[UserEnvironment.hotkeyMap.cmdKey],
      altKey: e[UserEnvironment.hotkeyMap.altKey],
      ctrlKey: e['ctrlKey'],
      key: e.key,
    });
    this.triggerEvent('keyup', this.snapshot);
  }
  @autobind
  handleDblClickEvent(e: MouseEvent) {
    // 没有点击在画布上, 则不触发dblclick事件
    if ((e.target as HTMLElement)?.id !== this.canvasDom.id) {
      return;
    }

    this.triggerEvent('dblclick', this.snapshot);
  }

  /**
   * 触发事件
   * @param eventType 事件类型
   * @param originEvent 原始 event
   * @param firstEvent 首次触发的事件（当前仅在 dragMove 时使用）
   */
  private triggerEvent(
    eventType: AllEventType,
    cbArg: IInputSnapshot,
  ) {
    const cbList = this.eventListener.get(eventType as MouseEventType);
    if (cbList) {
      cbList.forEach((cb) => {
        cb(cbArg);
      });
    }
  }

  /**
   * 获取事件在 page 上的坐标
   * @param {MouseEvent} e
   * @returns {XYPos}
   */
  private getEventPagePos(e: MouseEvent): XYPos {
    const pos = this.getPixelPosByEvent(e);

    return this._viewPort.screen2page(pos) as XYPos;
  }
  // todo 最好是少一个概念
  public getPixelPosByEvent(event: MouseEvent) {
    const canvasData = this._viewPort.canvasData;

    const x = event.clientX - canvasData.clientX;
    const y = event.clientY - canvasData.clientY;
    return { x, y };
  }



  /**
   * 画布平移
   * @param e
   * @param moveCallback
   */
  @autobind
  canvasEdgeMovement(moveCallback: TCanvasEdgeMovementCb) {
    const { dragAutoChangePosSet } = this;
    const {
      autoChangeFunc = this.autoChangeBaseFunc,
      interval,
      autoChangePos,
    } = dragAutoChangePosSet;

    // 已经存在定时器时，清空
    if (dragAutoChangePosSet.autoScroll) {
      clearInterval(dragAutoChangePosSet.autoScroll);
      dragAutoChangePosSet.autoScroll = undefined;
    }

    // 获取滚动方向
    dragAutoChangePosSet.ratio = autoChangeFunc(this.snapshot.currentScreenPoint);
    const [speedX, speedY] = dragAutoChangePosSet.ratio;
    const { x: pageX, y: pageY } = this._viewPort.canvasViewBox;
    const getPosRange = (pos: number) => {
      return pos < 246000 && pos > -246000;
    };

    // 滚动方向为0时表示不滚动
    if (speedX !== 0 || speedY !== 0) {
      // 定义定时器
      dragAutoChangePosSet.autoScroll = setInterval(() => {
        // 累加x轴滚动距离
        if (speedX !== 0 && getPosRange(pageX)) {
          autoChangePos.autoChangePosX += interval * speedX;
        }
        // 累加y轴滚动距离
        if (speedY !== 0 && getPosRange(pageY)) {
          autoChangePos.autoChangePosY += interval * speedY;
        }
        this.autoChangePagePos(this._viewPort);

        // 回调
        if (moveCallback) {
          moveCallback({
            autoChangePos,
            ratio: dragAutoChangePosSet.ratio,
            inputSnapshot: this.snapshot,
          });
        }
      }, interval);
    } else {
      // 清空定时器
      if (dragAutoChangePosSet.autoScroll) {
        clearInterval(dragAutoChangePosSet.autoScroll);
        dragAutoChangePosSet.autoScroll = undefined;
      }
    }

    // 回调
    if (moveCallback) {
      moveCallback({
        autoChangePos,
        ratio: dragAutoChangePosSet.ratio,
        inputSnapshot:this.snapshot,
      });
    }
  }
  @autobind
  uninstallCanvasEdgeMovement() {
    // 已经存在定时器时，清空
    if (this.dragAutoChangePosSet.autoScroll) {
      clearInterval(this.dragAutoChangePosSet.autoScroll);
      this.dragAutoChangePosSet.autoScroll = undefined;
    }
  }



  /**
   * [通过获取事件对象，拿到当前指针触发自动滚动的偏移值]
   * @param {XYPos} currentScreenPoint
   * @returns {number[]}
   */
  @autobind
  autoChangeBaseFunc(currentScreenPoint: XYPos) {
    const box = this._viewPort.canvasData;
    const { clientX: canvasX, clientY: canvasY, clientWidth: width, clientHeight: height } = box;

    const {
      x: clientX,
      y: clientY,
    } = currentScreenPoint;
    let speedX = - getSpeed(clientX - canvasX);
    if (speedX == 0) {
      speedX = getSpeed(width + canvasX - clientX);
    }
    let speedY = - getSpeed(clientY - canvasY);
    if (speedY == 0) {
      speedY = getSpeed(height + canvasY - clientY);
    }

    return [speedX, speedY];
  }


  /**
   * [在触发自动滚动的时候，让当前页面完成位置的跟随移动]
   */
  @autobind
  autoChangePagePos(viewPort: ViewPort) {
    const {
      interval,
      ratio: [speedX, speedY]
    } = this.dragAutoChangePosSet;
    const zoom = viewPort.zoom;
    const position = viewPort.position;
    // 更新快照
    const oldPosition = {...viewPort.position};
    viewPort.position = {
      x: speedX !== 0 ? position.x + interval * speedX / zoom : position.x,
      y: speedY !== 0 ? position.y + interval * speedY / zoom : position.y
    };
    const currentPosition = viewPort.position;
    const posDiff = { x: currentPosition.x - oldPosition.x, y: currentPosition.y - oldPosition.y };
    const currentPagePoint = this.snapshot.currentPagePoint;
    this.setConfig({
      currentPagePoint: { x: currentPagePoint.x + posDiff.x, y: currentPagePoint.y + posDiff.y },
    });
  }
}


function getDefaultSnapshot(){
  return  {
    isDragging: false,
    originPagePoint: { x: 0, y: 0 },
    originScreenPoint: { x: 0, y: 0 },
    currentPagePoint: { x: 0, y: 0 },
    currentScreenPoint: { x: 0, y: 0 },
    lastScreenPoint: { x: 0, y: 0 },
    lastPagePoint: { x: 0, y: 0 },
    wheelDeltaXY: { x: 0, y: 0 },
    shiftKey: false,
    cmdKey: false,
    altKey: false,
    ctrlKey: false,
    button: -1,
    copyMessage: { x: 0, y: 0 },
    key: '',
  };
}
