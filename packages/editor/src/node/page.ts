import { EOtherElementType } from '@zhgu/type';
import { NodeFactory } from './nodeFactory';
import { NodeModel } from '@zhgu/data';

export class Page extends NodeModel {
  get backgroundColor() {
    return { r: 0, g: 0, b: 0, a: 1 };
  }
}

NodeFactory.register(EOtherElementType.Page, Page);
