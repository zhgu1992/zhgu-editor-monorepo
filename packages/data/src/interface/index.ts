import type {
  StrokePaints,
  FillPaints,
  IStrokeProps,
  IStrokeBaseProps,
  XYWH,
  IElement,
  INodeElement,
  Transform,
  ParentIndex,
  ElementChangeProps,
  RenderCategorySet,
  ElementChange,
  Transaction,
} from '@zhgu/type';
import type { ElementData } from '../dataUtil';
import type { mat3, vec2 } from 'gl-matrix';

interface INode {
  elementData: ElementData;
  parent: INode | null;
  children: INode[];
  props: INodeElement;
  element: INodeElement;
  id: string;
  type: string;
  parentIndex: ParentIndex;
  parentId: string;
  parentPosition: string;
  depth: number;
  base: INode | null;
  up: (n: number) => INode;
  addChildNode: (node: INode, index: number) => void;
  pushChildNode: (node: INode) => void;
  removeChildNode: (node: INode) => void;
  doOnPropsChanged: (elementChangeProps: ElementChangeProps) => void;
  updateRenderNode: (renderCategorySet: RenderCategorySet) => void;
  updateNodeAt: () => void;
}

interface IGeometryNode extends INode {
  rt: mat3;
  at: mat3;
  transform: Transform;
  apoints: vec2[];
  absoluteAABB: XYWH;
  relativeAABB: XYWH;
  rpoints: vec2[];
  apivot: vec2;
  w: number;
  h: number;
  x: number;
  y: number;
  rotation: number;
}

interface INodeModel extends IGeometryNode {
  name: string;
  isVisible: boolean;
  fillPaints: FillPaints;
  strokePaints: StrokePaints;
  strokeWeight: number | undefined;
  strokeProps: IStrokeProps;
  opacity: number;
}

interface ISyncClientFollower {
  transactionFollower: (elementChange: ElementChange) => void;
  transactionSaving?: () => void;
}

interface ISavingTransaction {
  readonly transaction: Transaction;
  readonly reverse: Transaction;
  time: number;
}

export { INode, INodeModel, IGeometryNode, ISyncClientFollower, ISavingTransaction };
