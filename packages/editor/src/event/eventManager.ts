import type { IInputSnapshot, IBaseNode, MouseEventType } from '../interface';
import { mouseEventEnum } from '../interface';
import { EventEntry } from './eventEntry';
import { ViewPort } from '../viewport';
import type { IEventArgs, CustomEventType } from '../const';
import { EventBus } from './eventBus.ts';
import { Hover} from './hover';
import  {Select} from './select';
import type {RenderManager} from "../render";
/**
 * 事件管理器，管理事件和快照
 * 最底层方法，可以在上层所有业务复用，viewport除外
 */
export class EventManager {
  eventEntry: EventEntry;
  eventBus = new EventBus();
  hover: Hover;
  select: Select;
  private _viewPort: ViewPort;
  constructor(canvasWrapper: HTMLCanvasElement, renderManager: RenderManager) {
    this._viewPort = new ViewPort(canvasWrapper, renderManager, this.eventBus);
    this.eventEntry = new EventEntry(document, canvasWrapper, this._viewPort);
    this.select = new Select(this.eventBus);
    this.hover = new Hover(this.eventBus, this.select);
  }

  resetEventEntry(){
    this.eventEntry.reset();
  }

  get viewPort() {
    return this._viewPort;
  }

  get hoverNode(){
    return this.hover.getHoverNode();
  }

  set hoverNode(value: IBaseNode | null){
    this.hover.setHoverNode(value);
  }

  get selectedNodes(){
    return this.select.getSelectNodes();
  }

  getSelectIds() {
    return this.select.getSelectIds();
  }

  set selectedNodes(value: IBaseNode[]) {
    this.select.setSelectNodes(value);
  }


  get snapshot(){
    return this.eventEntry.snapshot;
  }

  get customListeners(){
    return this.eventBus.listeners;
  }

  get eventEntryListeners(){
    return this.eventEntry.eventListener;
  }

  // 关键方法，可能会修改全局变量，谨慎使用
  setConfig(config: IInputSnapshot): void {
    this.eventEntry.setConfig(config);
  }

  /**
   *  这里直接统一分发即可,便于我们把控完整的事件链路
   *  目前系统级事件管理可以不考虑事件冒泡的设计,不需要一直抛事件
   * @param {string} type
   * @param {(...args: any[]) => any} cb
   */
  on(type: CustomEventType | MouseEventType, cb: (...args: any[]) => any) {
    if(mouseEventEnum.includes(type)){
      this.eventEntry.addMouseEvent(type as MouseEventType, cb);
    }else{
      this.eventBus.on(type, cb);
    }
  }

  off(type: CustomEventType | MouseEventType,  cb: (...args: any[]) => any){
    if(mouseEventEnum.includes(type)){
      this.eventEntry.removeMouseEvent(type as MouseEventType, cb);
    }else{
      this.eventBus.off(type, cb);
    }
  }

  emit(type: string, data: IEventArgs){
    this.eventBus.emit(type, data);
  }

  destroy(): void {
    this.hover.setHoverNode(null);
    this.select.setSelectNodes([]);
    this.eventEntry.clearEventModeListener();
    this.eventBus.removeAllListeners();
  }
}


