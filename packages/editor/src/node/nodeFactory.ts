import type { ElementData } from '@zhgu/data';
import type { EInstancedType } from '@zhgu/type';
import { BaseNode } from './baseNode';
import type { IBaseNodeOrNodeModel } from '../interface';
import type { View } from '../view';

type JsNodeConstructor = new (...args: never) => IBaseNodeOrNodeModel;

export class NodeFactory {
  static map = new Map<EInstancedType, JsNodeConstructor>();

  static register(type: EInstancedType, constructor: JsNodeConstructor) {
    this.map.set(type, constructor);
  }

  static transform(state: ElementData, view: View) {
    const type = state.type;
    const constructor = this.map.get(type);
    if (constructor) {
      // @ts-ignore 暂时不处理
      return new constructor(state, view);
    } else {
      return new BaseNode(state, view);
    }
  }
}
