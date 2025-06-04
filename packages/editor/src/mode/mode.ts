import type { IStateNode } from '../interface';
import { BaseModelNode } from './base';
import type { View } from '../view';
import { EStateEvent } from '../const';
/**
 * 定义模式，后续编辑器可以加载不同的模式，目前只有编辑模式
 */
export class Mode extends BaseModelNode{
  currentStateId?: string;
  lastStateId?: string;
  defaultStateId = '';
  private _cache: Map<string, IStateNode> = new Map();

  constructor(view: View, type: string) {
    super(view, type);
    this.view.eventManager!.on(EStateEvent.ToDefaultState, ()=>{
      this.changeState(this.defaultStateId);
    });
  }

  registerState(state: IStateNode, isDefault = false) {
    if(isDefault){
      this.defaultStateId = state.id;
    }
    this._cache.set(state.id, state);
  }

  changeState(stateId: string){
    const state = this.getState(stateId);
    if(state){
      const currentId = this.currentStateId;
      if(currentId){
        this.lastStateId = currentId;
        this.getState(currentId)?.exit();
      }
      this.currentStateId = stateId;
      state.enter();
    }
  }

  prev(){
    this.changeState(this.lastStateId ?? this.defaultStateId);
  }

  enter(){
    this.changeState(this.defaultStateId);
  }

  getState(stateId: string){
    return this._cache.get(stateId);
  }

  getCurrentState(){
    const stateId = this.currentStateId ?? this.defaultStateId;
    return this.getState(stateId);
  }

  exit(){
    this._cache.forEach((state: IStateNode) => {
      state.exit();
    });
    this._cache.clear();
  }
}
