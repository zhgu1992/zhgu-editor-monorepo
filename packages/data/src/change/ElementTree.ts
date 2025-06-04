import type { INode } from '../interface';
import type { DocExchange } from './DocExchange';
import { isNullOrUndefined } from '../utils';
import type { Node } from '../nodes';
import type { IElement, IDocumentElement, ElementChange, DocumentData } from '@zhgu/type';
import { EElementChangeType } from '@zhgu/type';
import { isDocument, isInternalPage, ElementData } from '../dataUtil';

class ElementTree<T extends Node> {
  private _docExchange?: DocExchange;
  private _nodeBuilder?: (_: ElementData) => T;
  public version = 0;
  public _rootNode?: T;
  public _internalPageNode?: T;
  public _firstPageNode?: T;
  private nodeRegistry = new Map<string, T>();

  constructor(docExchange?: DocExchange, documentData?: DocumentData, nodeBuilder?: (_: ElementData) => T) {
    if (docExchange && documentData && nodeBuilder) {
      this.buildTree(docExchange, documentData!, nodeBuilder);
    }
  }

  get nodeBuilder(): (_: ElementData) => T {
    return this._nodeBuilder as (_: ElementData) => T;
  }

  get docExchange(): DocExchange {
    return this._docExchange as DocExchange;
  }

  get rootNode(): T {
    return this._rootNode as T;
  }

  setRootNode(node: T) {
    this._rootNode = node;
  }

  get internalPageNode(): T {
    return this._internalPageNode as T;
  }

  setInternalPageNode(node: T) {
    this._internalPageNode = node;
  }

  get firstPageNode(): T {
    return this._firstPageNode as T;
  }

  setFirstPageNode(node: T) {
    this._firstPageNode = node;
  }

  buildTree(docExchange: DocExchange, documentData: DocumentData, nodeBuilder?: (_: ElementData) => T) {
    this._docExchange = docExchange;
    this._nodeBuilder = nodeBuilder;

    for (const element of documentData.elements) {
      const node = this.createNode(element);
      if (isDocument(element.type)) {
        this.setRootNode(node);
      }
      if (isInternalPage(element.type)) {
        this.setInternalPageNode(node);
      }
      this.nodeRegistry.set(node.id, node);
      docExchange.updateElementRegistry(element.id, element);
    }

    const containerNodesMap = new Map<string, INode>();

    for (const element of documentData.elements) {
      if (!isDocument(element.type)) {
        const parentIndex = (element as IElement).parentIndex;
        const parentId = parentIndex.id;
        const parentNode = this.node(parentId);
        const node = this.node(element.id);
        if (parentNode) {
          parentNode.pushChildNode(node);
          if (!containerNodesMap.has(parentNode.id)) {
            containerNodesMap.set(parentNode.id, parentNode);
          }
        }
        // node.updateNodeAt();
      }
    }
  }

  node(id: string): T {
    return this.nodeRegistry.get(id)!;
  }

  nodeOrNull(id: string): T | null {
    const node = this.nodeRegistry.get(id);
    if (isNullOrUndefined(node)) {
      return null;
    } else {
      return node!;
    }
  }

  private createNode(element: IElement | IDocumentElement) {
    return this.nodeBuilder(new ElementData(element));
  }

  private removeNode(id: string) {
    const node = this.node(id);
    node.removeSelfAndInstances();
    this.nodeRegistry.delete(id);
  }

  updateNodeOnChange(elementChange: ElementChange) {
    this.version += 1;
    const nodeChangeId = elementChange.id;
    switch (elementChange.type) {
      case EElementChangeType.Props: {
        const node = this.node(nodeChangeId);
        const changeProps = elementChange.props;
        const elementData = node.elementData;
        const newElement = this.docExchange.element(nodeChangeId);
        elementData.updateElement(newElement);
        node.doOnPropsChanged(changeProps);
        if (!isNullOrUndefined(changeProps.transform)) {
          node.children.forEach(node => node.updateNodeAt());
        }
        return;
      }
      case EElementChangeType.Add: {
        const element = elementChange.data;
        const node = this.createNode(element);
        const parentIndex = (element as IElement).parentIndex;
        const parentId = parentIndex.id;
        const parentNode = this.node(parentId);
        if (parentNode) {
          parentNode.pushChildNode(node);
          node.updateNodeAt();
        }
        this.nodeRegistry.set(node.id, node);
        return;
      }
      case EElementChangeType.Delete: {
        this.removeNode(nodeChangeId);
        return;
      }
      case EElementChangeType.Move: {
        const node = this.node(nodeChangeId);
        const originalParentNode = node.parent;
        originalParentNode && originalParentNode.removeChildNode(node);
        const parentIndex = elementChange.parentIndex;
        const parent = this.node(parentIndex.id);
        const childNodeIndex = parent.findChildNodeIndexByPosition(parentIndex.position);
        parent.addChildNode(node, childNodeIndex);
        node.updateNodeAt();
        const elementData = node.elementData;
        const newElement = this.docExchange.element(nodeChangeId);
        elementData.updateElement(newElement);
        return;
      }
      default: {
        throw new Error();
      }
    }
  }
}

export { ElementTree };
