export type CustomEventType =
  | EViewPortEventType
  | EHoverEventType
  | ESelectEventType
  | EConfigEventType
  | EStateEvent
  | EHistoryEvent
  | ENodeChangeType;

export type IEventArgs = {
  // todo 后续定义类型
  data: any;
};

export enum EViewPortEventType {
  ZoomChange = 'ZoomChange',
  ZoomLevelChange = 'ZoomLevelChange',
  PositionChange = 'PositionChange',
}

export enum EHoverEventType {
  HoverChange = 'HoverChange',
}

export enum ESelectEventType {
  SelectChange = 'SelectChange',
}

export enum EConfigEventType {
  PixelGridChange = 'PixelGridChange',
}

export enum ENodeChangeType {
  BaseAttributeChange = 'BaseAttributeChange',
}

/**
 * 矢量编辑器事件
 */
export enum EVectorEditor {
  EditorChange = 'vectorEditorChange',
  SelectedChange = 'vectorEditorSelectedChange',
  HoverChange = 'vectorEditorHoverChange',
  BezierShowIdChange = 'vectorEditorBezierShowIdChange',
  CenterPointShowStateChange = 'vectorEditorCenterPointShowStateChange',
  AloneBezierChange = 'aloneBezierChange',
}

export enum EVectorEditType {
  Vertex = 'vertex',
  Bezier = 'bezier',
  Segment = 'segment',
}

export enum EStateEvent {
  ToDefaultState = 'toDefaultState',
  Exit = 'exit',
  Enter = 'enter',
}

export enum EHistoryEvent {
  UndoRedo = 'undoRedo',
}
