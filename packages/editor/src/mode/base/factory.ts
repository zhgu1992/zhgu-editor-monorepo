import type { View } from '../../view';
import { EEditorStateName } from '../../const';
import type { IStateNode } from '../../interface';
import type { Mode } from '../mode';

type StateNodeConstructor = new (...args: any) => IStateNode;
export class StateFactory {
  static map = new Map<EEditorStateName, StateNodeConstructor>();

  static register(id: EEditorStateName, constructor: StateNodeConstructor) {
    this.map.set(id, constructor);
  }

  static init(view: View, mode: Mode) {
    this.map.forEach((constructor, id)=>{
      const state =  new constructor(view, id);
      mode.registerState(state, id === EEditorStateName.Default);
    });
  }
}
