import type { IRenderNode } from '@zhgu/render';
import type { IStrokeProps, XYPos, XYWH, RGBAColor, Paint, ISizeProps, ElementChange } from '@zhgu/type';
import type { INodeModel } from '@zhgu/data';
import type { mat3, vec2 } from 'gl-matrix';


export interface IRenderNodeModel extends INodeModel{
    renderOrder: number;
}
type RequiredProps<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type IRenderNodeConfig = RequiredProps<Partial<IRenderNodeModel>, 'id'>;
/**
 * 节点属性，与 INodeModule 相对应
 */
export interface ICustomNode extends IRenderNodeConfig{
    setDefaultStyle: () => void;
    setDefaultPaint: () => void;
    setDefaultStroke: () => void;
    update: () => void;
    hoverTip?: string;
    cursor: string|null;
    setSize: (w: number, h: number) => void;
    isCustomNode: boolean;
    renderNode: IRenderNode;
    setPosition: (x: number, y: number) => void;
    setPath: (x: number, y: number) => void;
    // 节点销毁
    destroy: (keepRenderNode?: boolean) => void;
    // updateByCategory: (renderCategorySet: RenderCategorySet) => void;
}

export interface IBaseNode extends INodeModel {
    renderNode: IRenderNode;
    isVisible: boolean;
    strokeProps: IStrokeProps;
    // pick: (pos: XYPos) => boolean;
    // showHover: (visible?: boolean) => ICustomNode;
    // showSelectBox: (visible?: boolean) => ICustomNode;
    // pickByBox:(rect: XYWH, strict?: boolean) => boolean;
    changeAbsolutePos: (pos: XYPos) => ElementChange;
    traverse: (drawSelfLayer: (node: IBaseNode)=> void) => void;
    traverseParent: (drawSelfLayer: (node: IBaseNode)=> void) => void;
    walkNode: (worker: (node: IBaseNode)=> void | { shouldBreak: boolean }) => void;
    // updateHoverAndSelect: (props?: RenderCategorySet) => void;
    changeRelativePos:(pos: Partial<XYPos>) => ElementChange;
    changeRt: (rt: mat3) => ElementChange;
    changeAt: (at: mat3) => ElementChange;
    // changeRotation: (rotation: number, apivot?: vec2) => ElementChange;
    changeSize: (size: Partial<ISizeProps>) => ElementChange;
    changeFillPaintColor: (color: RGBAColor, index?: number) => ElementChange;
    changeFillPaint: (fillPaint: Paint, index: number) => ElementChange;
    addFillPaint: (fillPaint: Paint, index?: number) => ElementChange;
    removeFillPaint: (index: number) => ElementChange;
    // changeParentIndex: (parentId: string, parentIndex?: number) => ElementChange;
    changeAtAndSize: (at: mat3, w: number, h: number) => ElementChange;
    changeRtAndSize: (rt: mat3, w: number, h: number) => ElementChange;
}

export type IBaseNodeOrNodeModel = IBaseNode | INodeModel;

export * from './metaData.ts';
