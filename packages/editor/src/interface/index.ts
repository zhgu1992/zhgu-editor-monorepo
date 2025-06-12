import type { IRenderNode } from '@zhgu/render';
import type {
  IStrokeProps,
  XYPos,
  XYWH,
  RGBAColor,
  Paint,
  ISizeProps,
  ElementChange,
  RenderCategorySet,
} from '@zhgu/type';
import type { INodeModel } from '@zhgu/data';
import type { mat3, vec2 } from 'gl-matrix';
import type { IMetaData } from './metaData.ts';

export interface IRenderNodeModel extends INodeModel {
  renderOrder: number;
}
type RequiredProps<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type IRenderNodeConfig = RequiredProps<Partial<IRenderNodeModel>, 'id'>;
/**
 * 节点属性，与 INodeModule 相对应
 */
export interface ICustomNode extends IRenderNodeConfig {
  setDefaultStyle: () => void;
  setDefaultPaint: () => void;
  setDefaultStroke: () => void;
  update: () => void;
  hoverTip?: string;
  cursor: string | null;
  setSize: (w: number, h: number) => void;
  isCustomNode: boolean;
  renderNode: IRenderNode;
  setPosition: (x: number, y: number) => void;
  setPath: (x: number, y: number) => void;
  // 节点销毁
  destroy: (keepRenderNode?: boolean) => void;
  updateMatrix: () => void;
  // updateByCategory: (renderCategorySet: RenderCategorySet) => void;
}
export type ICustomStyledOptions = {
  color: RGBAColor;
  strokeWeight: number;
  strokeColor: RGBAColor;
  opacity: number;
  colorEnabled: boolean;
  strokeEnabled: boolean;
  strokeOpacity: number;
  sizeAttenuation: boolean;
};

export interface ICustomCollection extends ICustomNode {
  collection: ICollection;
}

/** 编辑层canvas信息 */
export interface IEditorCanvasData {
  id: string;
  clientWidth: number;
  clientHeight: number;
  height: number;
  width: number;
  clientX: number;
  clientY: number;
}

export interface IBaseNode extends INodeModel {
  renderNode: IRenderNode;
  isVisible: boolean;
  strokeProps: IStrokeProps;
  pick: (pos: XYPos) => boolean;
  showHover: (visible?: boolean) => ICustomNode;
  showSelectBox: (visible?: boolean) => ICustomNode;
  pickByBox: (rect: XYWH, strict?: boolean) => boolean;
  changeAbsolutePos: (pos: XYPos) => ElementChange;
  traverse: (drawSelfLayer: (node: IBaseNode) => void) => void;
  traverseParent: (drawSelfLayer: (node: IBaseNode) => void) => void;
  updateHoverAndSelect: (props?: RenderCategorySet) => void;
  changeRelativePos: (pos: Partial<XYPos>) => ElementChange;
  changeRt: (rt: mat3) => ElementChange;
  changeAt: (at: mat3) => ElementChange;
  changeRotation: (rotation: number, apivot?: vec2) => ElementChange;
  changeSize: (size: Partial<ISizeProps>) => ElementChange;
  changeFillPaintColor: (color: RGBAColor, index?: number) => ElementChange;
  changeFillPaint: (fillPaint: Paint, index: number) => ElementChange;
  addFillPaint: (fillPaint: Paint, index?: number) => ElementChange;
  removeFillPaint: (index: number) => ElementChange;
  // changeParentIndex: (parentId: string, parentIndex?: number) => ElementChange;
  changeAtAndSize: (at: mat3, w: number, h: number) => ElementChange;
  changeRtAndSize: (rt: mat3, w: number, h: number) => ElementChange;
  destroy: () => void;
  getMetaData: () => IMetaData;
}

export type IBaseNodeOrNodeModel = IBaseNode | INodeModel;

// -----------------mode -------------------

/**
 * 事件类型
 * @category jsdEditor
 */
export interface IEventHandles {
  mousedown: (e: MouseEvent) => void;
  mousemove: (e: MouseEvent) => void;
  mouseup: (e: MouseEvent) => void;
  drop: (e: MouseEvent) => void;
  wheel: (e: WheelEvent) => void;
  keydown: (e: KeyboardEvent) => void;
  keyup: (e: KeyboardEvent) => void;
  dblclick: (e: MouseEvent) => void;
}
export type TransEventType = 'dragstart' | 'dragmove' | 'dragend' | 'click' | 'nomoveend';
export type MouseEventType = keyof IEventHandles | TransEventType;

export const mouseEventEnum = [
  'mousedown',
  'mousemove',
  'mouseup',
  'drop',
  'wheel',
  'keydown',
  'keyup',
  'dblclick',
  'click',
  'dragstart',
  'dragmove',
  'dragend',
  'nomoveend',
];
export type AllEventType = TransEventType | MouseEventType | KeyboardEventType;
export type KeyboardEventType = 'keydown' | 'keyup';
export type DomEventType = Exclude<AllEventType, TransEventType>;

export interface ICanvasEdgeMovementCbProps {
  autoChangePos: { autoChangePosX: never; autoChangePosY: never };
  ratio?: number[];
  inputSnapshot: IInputSnapshot;
}
export type TCanvasEdgeMovementCb = (props: ICanvasEdgeMovementCbProps) => void;
/**
 * 编辑层快照信息
 */
export interface IInputSnapshot {
  isDragging: boolean; // 是否为正在拖拽
  originPagePoint: XYPos; // 拖拽下原始画布位置
  originScreenPoint: XYPos; // 拖拽下原始屏幕位置
  currentPagePoint: XYPos; // 当前画布位置
  currentScreenPoint: XYPos; // 当前屏幕位置
  wheelDeltaXY: XYPos; // 滚动屏幕后的位置偏移量
  lastPagePoint: XYPos;
  lastScreenPoint: XYPos;
  shiftKey: boolean; // 是否按住shift键
  cmdKey: boolean; // 是否按住cmd键
  altKey: boolean; // 是否按住alt键
  ctrlKey: boolean; // 是否按住ctrl键
  button: number; // 鼠标按键
  copyMessage: XYPos;
  key: string; // 键盘key
  isCanvas: boolean; // 是否是在canvas上操作
}

export type ICollideMessage = {
  area: ICustomNode | null;
};

/**
 * 事件回调
 * @category jsdEditor
 */
export type EventCallback<T> = (event: T) => void;

/**
 * 监听拖拽
 * @category jsdEditor
 */
export interface DragEventOptions {
  /** drag start 时调用 */
  startCb?: EventCallback<IInputSnapshot>;
  /** drag move 时调用 */
  moveCb: EventCallback<IInputSnapshot>;
  /** drag end 时调用 */
  endCb: EventCallback<IInputSnapshot>;
}

export interface ICollection {
  nodes: IBaseNode[];
  id: string;
  w: number;
  h: number;
  x: number;
  y: number;
  rotation: number;
  absoluteAABB: XYWH;
  at: mat3;
  apoints: vec2[];
  apivot: vec2;
}

export interface ICollectionUIManager extends ICollection {
  update: (props?: RenderCategorySet, ignoreArea?: boolean) => void;
  showArea: (val?: boolean) => void;
  showCustomNode: (val?: boolean) => void;
  updateArea: () => void;
  destroy: () => void;
  isDestroyed: boolean;
  getBehaviorByArea: (area: ICustomCollection) => IBehaviorNode | undefined;
  setAreaRelation: (area: ICustomCollection, behavior: IBehaviorNode) => void;
  pickArea: (position: XYPos) => ICustomCollection[];
  removeArea: (area: ICustomCollection) => void;
  removeCustomNode: (node: ICustomCollection) => void;
  enter: () => void;
  exit: () => void;
  showUI: (delay?: number) => void;
  hideUI: () => void;
  addCustomNode: (node: ICustomCollection) => void;
}

export interface IStateNode {
  enter: () => void;
  exit: () => void;
  readonly id: string;
  showArea: (val?: boolean) => void;
  exitToDefault: () => void;
  collectionUIManager: ICollectionUIManager;
}

export type IPositionMessage = IInputSnapshot;

export type TJsFunction = () => void;

export type TJsPointerEvent = (inputSnapshot: IInputSnapshot) => void;

export type TJsKeyboardEvent = (inputSnapshot: IInputSnapshot) => void;

export type TJsPointerDragEvent = () => DragEventOptions;

export type TJsDragStartEvent = (collideMessage: ICollideMessage, positionMessage: IPositionMessage) => void;

export type TJsDragMoveEvent = TJsDragStartEvent;

export type TJsDragEndEvent = TJsDragMoveEvent;

export interface IJsEventHandlers {
  onPointerDown: TJsPointerEvent;
  onPointerMove: TJsPointerEvent;
  onPointerUp: TJsPointerEvent;
  onPointerDrag: TJsPointerDragEvent;
  onWheel: TJsPointerEvent;
  onClick: TJsPointerEvent;
  onKeyDown: TJsKeyboardEvent;
  onKeyUp: TJsKeyboardEvent;
  onDragStart: TJsDragStartEvent;
  onDragMove: TJsDragMoveEvent;
  onDragEnd: TJsDragEndEvent;
  onDoubleClick: TJsPointerEvent;
}

export interface IBehaviorNode extends Partial<IJsEventHandlers> {
  id: string;
  onEnter: TJsFunction;
  onExit: TJsFunction;
}

export interface IKeyOptions {
  cmdKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}
export * from './metaData.ts';
