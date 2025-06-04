import type { ElementData } from '../dataUtil';
import type { ElementChangeProps, IElement, ParentIndex, RenderCategorySet, INodeElement } from '@zhgu/type';
import type { INode } from '../interface';
import { elementProps2RenderCategorySet } from '../dataUtil';
import { binarySearchParentPosition } from '../utils';

class Node implements INode {
  private _props!: INodeElement;
  // 核心数据
  public elementData: ElementData;
  public children: INode[] = [];
  public parent: INode | null = null;
  public base: INode | null = null;
  public instances: INode[] = [];

  constructor(_elementData: ElementData) {
    this.elementData = _elementData;
  }

  get props() {
    this._props = this.element;
    return this._props;
  }

  get element() {
    return this.elementData.element as INodeElement;
  }

  get id(): string {
    return this.element.id;
  }

  get type(): string {
    return this.element.type;
  }

  get parentIndex(): ParentIndex {
    return this.element.parentIndex;
  }

  get parentId(): string {
    return this.parentIndex.id;
  }

  get parentPosition(): string {
    return this.parentIndex.position;
  }

  get depth(): number {
    const p = this.parent;
    if (p === null) {
      return 0;
    } else {
      return 1 + p.depth;
    }
  }

  up(n: number): INode {
    if (n === 0) {
      return this;
    } else {
      return this.parent!.up(n - 1);
    }
  }

  findChildNodeIndexById(findNodeId: string): number {
    return this.children.findIndex((node: INode) => node.id === findNodeId);
  }

  findChildNodeIndexByPosition(findNodePosition: string): number {
    return binarySearchParentPosition(this.children, findNodePosition);
  }

  addChildNode(node: INode, index: number) {
    node.parent = this;
    this.children.splice(index, 0, node);
  }

  pushChildNode(node: INode) {
    node.parent = this;
    this.children.push(node);
  }

  removeSelfAndInstances() {
    this.removeInner();
  }

  private removeInner() {
    if (this.parent !== null) {
      this.parent!.removeChildNode(this);
      this.parent = null;
    }
  }

  removeChildNode(node: INode) {
    let i = 0;
    const c = this.children;
    while (i < c.length) {
      if (c[i] === node) {
        this.children.splice(i, 1);
        return;
      }
      i++;
    }
    throw new Error('not a child');
  }

  doOnPropsChanged(changeProps: ElementChangeProps) {
    const oldProps = this._props;
    this._props = {
      ...oldProps,
      ...changeProps,
    } as INodeElement;
    const renderCategorySet = elementProps2RenderCategorySet(changeProps);
    this.updateRenderNode(renderCategorySet);
  }

  // @ts-ignore
  updateRenderNode(renderCategorySet: RenderCategorySet) {}
  updateNodeAt() {}
}

export { Node };
