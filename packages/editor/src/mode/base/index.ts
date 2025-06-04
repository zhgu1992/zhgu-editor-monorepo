import type { IJsEventHandlers, DomEventType } from '../../interface';
import type { View } from '../../view';
import type { EventManager } from '../../event';

/**
 * 基础模板
 */
export class BaseModelNode {
  // 活动名称
  readonly id: string;
  private _view: View;

  isPermanent?: boolean; // 是否是常驻行为

  onPointerDown?: IJsEventHandlers['onPointerDown'];
  onPointerMove?: IJsEventHandlers['onPointerMove'];
  onPointerUp?: IJsEventHandlers['onPointerUp'];

  onClick?: IJsEventHandlers['onClick'];
  onKeyDown?: IJsEventHandlers['onKeyDown'];
  onKeyUp?: IJsEventHandlers['onKeyUp'];
  onWheel?: IJsEventHandlers['onWheel'];
  onDoubleClick?: IJsEventHandlers['onDoubleClick'];

  onDragStart?: IJsEventHandlers['onDragStart'];
  onDragMove?: IJsEventHandlers['onDragMove'];
  onDragEnd?: IJsEventHandlers['onDragEnd'];

  // 对齐像素网格最小值
  protected pga = 1;

  constructor(view: View, id: string) {
    this.id = id;
    this._view = view;
  }

  public get view() {
    return this._view;
  }

  onEnter() {
    this.initEvent();
  }

  onExit() {
    this.removeEvent();
  }

  initEvent() {
    const eventManager = this.view.eventManager!;
    this.onPointerDown && eventManager.on('mousedown', this.onPointerDown);
    this.onPointerMove && eventManager.on('mousemove', this.onPointerMove);
    this.onPointerUp && eventManager.on('mouseup', this.onPointerUp);
    this.onWheel && eventManager.on('wheel', this.onWheel);
    this.onKeyDown && eventManager.on('keydown', this.onKeyDown);
    this.onKeyUp && eventManager.on('keyup', this.onKeyUp);
    this.onDoubleClick && eventManager.on('dblclick', this.onDoubleClick);
    this.onClick && eventManager.on('click', this.onClick);

    this.bindDragEvents(eventManager);
    // todo drag event
    const newDocumentEvents = eventManager.eventEntry.getMouseEvents();
    eventManager.eventEntry.handleChangedEvents(new Set<DomEventType>(), newDocumentEvents);
  }

  removeEvent() {
    const eventManager = this.view.eventManager!; // if(!eventManager) {
    this.onPointerDown && eventManager.off('mousedown', this.onPointerDown);
    this.onPointerMove && eventManager.off('mousemove', this.onPointerMove);
    this.onPointerUp && eventManager.off('mouseup', this.onPointerUp);
    this.onWheel && eventManager.off('wheel', this.onWheel);
    this.onKeyDown && eventManager.off('keydown', this.onKeyDown);
    this.onKeyUp && eventManager.off('keyup', this.onKeyUp);
    this.onDoubleClick && eventManager.off('dblclick', this.onDoubleClick);
    this.onClick && eventManager.off('click', this.onClick);

    this.removeDragEvents(eventManager);
  }

  protected bindDragEvents(eventManager: EventManager) {
    // todo drag event
    this.onDragStart && eventManager.on('dragstart', this.onDragStart);
    this.onDragMove && eventManager.on('dragmove', this.onDragMove);
    this.onDragEnd && eventManager.on('dragend', this.onDragEnd);
  }

  protected removeDragEvents(eventManager: EventManager) {
    this.onDragStart && eventManager.off('dragstart', this.onDragStart);
    this.onDragMove && eventManager.off('dragmove', this.onDragMove);
    this.onDragEnd && eventManager.off('dragend', this.onDragEnd);
  }
}
