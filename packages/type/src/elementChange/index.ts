import type { IDocumentOrElement, EElementType, IAllElementProps, ParentIndex } from '../element';

type ElementChangeProps = Partial<IAllElementProps> & Partial<{ type: EElementType }>;
type ElementChangeKeyof = keyof ElementChangeProps;
type Transaction = ElementChange[];

// @ts-ignore
enum EElementChangeType {
  Props = 'Props',
  Add = 'Add',
  Delete = 'Delete',
  Move = 'Move',
}

type PropsElementChange = {
  type: EElementChangeType.Props;
  id: string;
  props: ElementChangeProps;
};

type AddElementChange = {
  type: EElementChangeType.Add;
  id: string;
  data: IDocumentOrElement;
};

type DeleteElementChange = {
  type: EElementChangeType.Delete;
  id: string;
};

type MoveElementChange = {
  type: EElementChangeType.Move;
  id: string;
  parentIndex: ParentIndex;
};

type ElementChange = PropsElementChange | AddElementChange | DeleteElementChange | MoveElementChange;

export {
  ElementChangeKeyof,
  ElementChangeProps,
  Transaction,
  EElementChangeType,
  ElementChange,
  PropsElementChange,
  AddElementChange,
  DeleteElementChange,
  MoveElementChange,
};
