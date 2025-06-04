import { isNullOrUndefined } from '../utils';
import type {
  IElement,
  Transaction,
  ElementChange,
  DocumentData,
  IDocumentOrElement,
  ElementChangeProps,
  ElementChangeKeyof,
  EElementType,
  IElementPropsWithoutType,
} from '@zhgu/type';
import { EElementChangeType } from '@zhgu/type';
import { isDocument, createElementInner } from '../dataUtil';
import { getShortUUID } from '../utils';

interface TransactionResult {
  applied: Transaction;
  reverse: Transaction;
}

namespace TransactionResult {
  // @ts-ignore
  export const empty = (doc: DocExchange): TransactionResult => {
    return { applied: [], reverse: [] };
  };
}

class DocExchange {
  private _version?: number;
  private elementRegistry: Map<string, IDocumentOrElement> = new Map();

  constructor(documentData?: DocumentData, needsValidate: boolean = true) {
    if (!isNullOrUndefined(documentData)) {
      this.loadDocument(documentData!);
      if (needsValidate) {
        this.validate();
      }
    }
  }

  get version(): number {
    return this._version!;
  }

  updateVersion(version: number) {
    this._version = version;
  }

  updateElementRegistry(elementId: string, element: IDocumentOrElement) {
    this.elementRegistry.set(elementId, element);
  }

  loadDocument(documentData: DocumentData) {
    this.updateVersion(documentData.version);
    for (const element of documentData.elements) {
      const elementId = element.id;
      this.elementRegistry = new Map();
      this.elementRegistry.set(elementId, element);
    }
  }

  elementOrNull(id: string): IDocumentOrElement | null {
    const element = this.elementRegistry.get(id);
    if (isNullOrUndefined(element)) {
      return null;
    } else {
      return element!;
    }
  }

  element(id: string): IDocumentOrElement {
    return this.elementRegistry.get(id)!;
  }

  has(id: string): boolean {
    return !isNullOrUndefined(this.elementRegistry.get(id));
  }

  parentId(id: string): string | null {
    const element = this.elementOrNull(id);
    if (isNullOrUndefined(element)) {
      return null;
    }
    if (isDocument(element!.type)) {
      return null;
    } else {
      const parentIndex = (element as IElement).parentIndex;
      const parentId = parentIndex.id;
      return parentId;
    }
  }

  parentElement(id: string): IDocumentOrElement | null {
    return this.element(this.parentId(id)!);
  }

  private validate(): void {}

  tryCommitElementChange(elementChange: ElementChange, isIgnoreRevTransaction = false): TransactionResult | null {
    try {
      return this.commitElementChange(elementChange, isIgnoreRevTransaction);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('tryChange', e);
      return null;
    }
  }

  tryTransact(
    transaction: Transaction,
    follower?: (_: ElementChange) => void,
    isIgnoreRevTransaction = false
  ): [Transaction] | null {
    let revTransaction: Transaction = [];
    let i = 0;
    while (i < transaction.length) {
      const changeRes = this.tryCommitElementChange(transaction[i], isIgnoreRevTransaction);
      if (isNullOrUndefined(changeRes)) {
        for (const revElementChange of revTransaction) {
          this.commitElementChange(revElementChange, true);
          follower && follower(revElementChange);
        }
        return null;
      } else {
        if (!isIgnoreRevTransaction) {
          revTransaction = revTransaction.concat(changeRes!.reverse);
        }
        changeRes!.applied.forEach((elementChange: ElementChange) => follower && follower(elementChange));
      }
      i += 1;
    }
    return [revTransaction];
  }

  private commitElementChange(elementChange: ElementChange, isIgnoreRevTransaction = false): TransactionResult {
    const elementChangeId = elementChange.id;
    switch (elementChange.type) {
      case EElementChangeType.Props: {
        const element = this.element(elementChangeId);
        if (isNullOrUndefined(element)) {
          return TransactionResult.empty(this);
        } else {
          let revElementChange = null;
          const elementChangeProps = elementChange.props;
          const elementChangeKeyof = Object.keys(elementChangeProps) as ElementChangeKeyof[];
          if (!isIgnoreRevTransaction) {
            const props = {} as ElementChangeProps;
            for (const key of elementChangeKeyof) {
              // @ts-ignore
              props[key] = element[key];
            }
            revElementChange = {
              type: EElementChangeType.Props,
              id: elementChangeId,
              props: props,
            };
          }
          const nextElement = { ...element };
          for (let key of elementChangeKeyof) {
            const value = elementChangeProps[key];
            if (!isNullOrUndefined(value)) {
              // @ts-ignore
              nextElement[key] = value;
            }
          }
          this.elementRegistry.set(elementChangeId, nextElement);
          if (isIgnoreRevTransaction) {
            return { applied: [elementChange], reverse: [] };
          } else {
            return { applied: [elementChange], reverse: [revElementChange as ElementChange] };
          }
        }
      }
      case EElementChangeType.Add: {
        const addedElement = elementChange.data;
        if (isNullOrUndefined(addedElement)) {
          return TransactionResult.empty(this);
        } else {
          this.elementRegistry.set(elementChangeId, addedElement!);
          if (isIgnoreRevTransaction) {
            return { applied: [elementChange], reverse: [] };
          } else {
            const revElementChange: ElementChange = {
              type: EElementChangeType.Delete,
              id: elementChangeId,
            };
            return { applied: [elementChange], reverse: [revElementChange] };
          }
        }
      }
      case EElementChangeType.Delete: {
        const element = this.element(elementChangeId);
        if (isNullOrUndefined(element)) {
          return TransactionResult.empty(this);
        } else {
          return this.deleteElementResult(element, isIgnoreRevTransaction);
        }
      }
      case EElementChangeType.Move: {
        const element = this.element(elementChangeId) as IElement;
        if (isNullOrUndefined(element)) {
          return TransactionResult.empty(this);
        } else {
          const parentIndex = elementChange.parentIndex;
          const toElement = this.element(parentIndex.id);
          if (isNullOrUndefined(toElement)) {
            return this.deleteElementResult(toElement, isIgnoreRevTransaction);
          }
          let revElementChange = null;
          if (!isIgnoreRevTransaction) {
            revElementChange = {
              type: EElementChangeType.Move,
              id: elementChangeId,
              parentIndex: { ...element.parentIndex },
            } as ElementChange;
          }
          const nextElement = { ...element };
          nextElement.parentIndex = {
            ...parentIndex,
          };
          this.elementRegistry.set(elementChangeId, nextElement);
          if (isIgnoreRevTransaction) {
            return { applied: [elementChange], reverse: [] };
          } else {
            return { applied: [elementChange], reverse: [revElementChange as ElementChange] };
          }
        }
      }
      default: {
        throw new Error();
      }
    }
  }

  private deleteElementResult(element: IDocumentOrElement, isIgnoreRevTransaction = false): TransactionResult {
    const elementId = element.id;
    this.elementRegistry.delete(elementId);
    if (isIgnoreRevTransaction) {
      return { applied: [{ type: EElementChangeType.Delete, id: elementId }], reverse: [] };
    } else {
      const revElementChange: ElementChange = {
        type: EElementChangeType.Add,
        data: element,
        id: elementId,
      };
      return {
        applied: [{ type: EElementChangeType.Delete, id: elementId }],
        reverse: [revElementChange],
      };
    }
  }

  public createNewId(extra: Set<string> | null = null): string {
    let id = getShortUUID();
    const extraNotNull = !isNullOrUndefined(extra);
    if (extraNotNull && extra!.has(id)) {
      id = getShortUUID();
    }
    if (extraNotNull) {
      extra!.add(id);
    }
    return id;
  }

  public createElement(elementType: EElementType, elementProps: IElementPropsWithoutType) {
    const newElement = createElementInner(elementType);
    const id = this.createNewId();
    return {
      ...newElement,
      ...elementProps,
      id,
    };
  }
}

export { DocExchange };
