import type { EventBus } from './eventBus';
import type { IBaseNode } from '../interface';
import { EHoverEventType } from '../const';
import type { Select } from './select';

export class Hover {
  private _eventBus: EventBus;
  private _hoverNode: IBaseNode | null = null;
  private _selectManager: Select;

  constructor(eventBus: EventBus, select: Select) {
    this._eventBus = eventBus;
    this._selectManager = select;
  }

  getHoverNode() {
    return this._hoverNode;
  }

  setHoverNode(value: IBaseNode | null) {
    const hoverNode = this._hoverNode;
    if (hoverNode) {
      hoverNode.showHover(false);
    }
    if (value) {
      value.showHover(true);
    }
    this._hoverNode = value;
    this._eventBus.emit(EHoverEventType.HoverChange, { data: value });
  }
}
