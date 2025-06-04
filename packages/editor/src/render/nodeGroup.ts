import type { ICustomNode } from '../interface';

export class NodeGroup {
  private readonly _id: string;
  private _nodes: ICustomNode[] = [];

  constructor(id: string, renderOrder = 0) {
    this._id = id;
  }

  clear() {
    this._nodes.length = 0;
  }

  addNode(node: ICustomNode) {
    this._nodes.push(node);
  }

  removeNode(node: ICustomNode) {
    const indexToRemove = this._nodes.indexOf(node);
    if (indexToRemove > -1) {
      this._nodes.splice(indexToRemove, 1);
    }
  }

  getNodeById(id: string) {
    return this._nodes.find((element: ICustomNode) => element.id === id);
  }

  removeNodeById(id: string) {
    const indexToRemove = this._nodes.findIndex((element: ICustomNode) => element.id === id);
    if (indexToRemove > -1) {
      this._nodes.splice(indexToRemove, 1);
    }
  }

  getAllNodes() {
    return this._nodes;
  }

  get id() {
    return this._id;
  }
}
