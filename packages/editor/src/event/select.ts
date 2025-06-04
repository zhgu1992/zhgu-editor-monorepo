import type { EventBus } from './eventBus';
import type { IBaseNode } from '../interface';
import { ESelectEventType } from '../const';

export class Select{
  private _eventBus: EventBus;
  private _selectNodes: IBaseNode[] = [];


  constructor(eventBus: EventBus) {
    this._eventBus = eventBus;
  }

  getSelectNodes() {
    return this._selectNodes;
  }

  getSelectIds() {
    return this._selectNodes.map(v=> v.id);
  }

  setSelectNodes(value: IBaseNode[], isForce = false) {
    this._selectNodes.forEach(v =>{
      v.showSelectBox(false);
    });
    value.forEach(v =>{
      v.showSelectBox(true);
    });
    this._selectNodes = value;
    this._eventBus.emit(ESelectEventType.SelectChange, { data: value });
  }
}
