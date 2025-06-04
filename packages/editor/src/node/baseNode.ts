import { NodeModel } from '@zhgu/data';
import type { ElementData, GeometryNode } from '@zhgu/data';
import type { RenderManager } from '../render';
import type { IMetaData, IModuleMetaData, ICustomNode, IBaseNode } from '../interface';
import { DEFAULT_META_DATA, DEFAULT_MODULE_META_DATA } from '../interface';
import { cloneDeep } from 'lodash-es';
import type {
  ISizeProps,
  ISolidPaintProps,
  RGBAColor,
  XYPos,
  XYWH,
  IRect,
  PropsElementChange,
  Paint,
  RenderCategorySet,
} from '@zhgu/type';
import { EElementChangeType } from '@zhgu/type';
import { mat3 } from 'gl-matrix';
import { mat2obj, PaintProps, isPolygonInRect, isPolygonIntersectRect, rotate } from '@zhgu/data';
import type { View } from '../view';
import type { IRenderNode } from '@zhgu/render';
import { BaseCustomUnit } from './customNode';

 
const _matCache = {
  m1: mat3.create(),
  m2: mat3.create(),
  mRotate: mat3.create(),
};

export class BaseNode extends NodeModel implements IBaseNode {
  private _renderNode: IRenderNode;
  private _metaData: IMetaData = cloneDeep(DEFAULT_META_DATA);
  private _moduleMetaData: IModuleMetaData = cloneDeep(DEFAULT_MODULE_META_DATA);
  // private _eventManager: EventManager;
  private _hoverNode?: ICustomNode;
  private _selectNode?: ICustomNode;
  private _renderManager: RenderManager;
  private _view: View;

  static HOVERANDSELECT_RENDER_CATEGORY_SET = new Set(['transform']) as RenderCategorySet;

  constructor(elementData: ElementData, view: View) {
    super(elementData);
    this._view = view;
    this._renderNode = this.createRenderNode()!;
    // this._eventManager = eventManager!;
    this._renderManager = this.view.renderManager!;
    this._renderManager.setRenderNode(this.id, this);
  }

  createRenderNode() {
    const { renderManager } = this.view;
    return renderManager!.createRenderNode(this);
  }

  get view() {
    return this._view;
  }

  changeSize(size: Partial<ISizeProps>) {
    const { w, h } = size;
    return {
      id: this.id,
      type: EElementChangeType.Props,
      props: {
        w: w ?? this.w,
        h: h ?? this.h,
      },
    } as PropsElementChange;
  }

  changeRotation(rotation: number, apivot = this.apivot) {
    const at = rotate(this.at, rotation, apivot);
    const { rt } = this;
    mat3.mul(rt, mat3.invert(_matCache.mRotate, (this.parent as GeometryNode).at), at);

    return {
      id: this.id,
      type: EElementChangeType.Props,
      props: {
        transform: mat2obj(rt),
      },
    } as PropsElementChange;
  }

  changeRelativePos(pos: Partial<XYPos>) {
    const trans = { ...this.transform };
    if (pos.x !== undefined) {
      trans.m02 = pos.x;
    }
    if (pos.y !== undefined) {
      trans.m12 = pos.y;
    }
    return {
      id: this.id,
      type: EElementChangeType.Props,
      props: {
        transform: trans,
      },
    } as PropsElementChange;
  }

  changeRt(rt: mat3) {
    return {
      id: this.id,
      type: EElementChangeType.Props,
      props: {
        transform: mat2obj(rt),
      },
    } as PropsElementChange;
  }

  changeRtAndSize(rt: mat3, w: number, h: number) {
    return {
      id: this.id,
      type: EElementChangeType.Props,
      props: {
        transform: mat2obj(rt),
        w,
        h,
      },
    } as PropsElementChange;
  }

  changeAbsolutePos(pos: XYPos) {
    const parentNode = this.parent!;
    const rt = this.rt;
    const at = mat3.clone(this.at);
    const { x, y } = pos;
    at[6] = x;
    at[7] = y;
    mat3.invert(_matCache.m1, (parentNode as GeometryNode).at);
    mat3.mul(rt, _matCache.m1, at);
    const transform = mat2obj(rt);
    return {
      id: this.id,
      type: EElementChangeType.Props,
      props: {
        transform,
      },
    } as PropsElementChange;
  }

  changeAt(at: mat3) {
    const { rt, parent } = this;
    const invAt = mat3.invert(_matCache.m2, (parent as GeometryNode).at);
    mat3.mul(rt, invAt, at);

    return {
      id: this.id,
      type: EElementChangeType.Props,
      props: {
        transform: mat2obj(rt),
      },
    } as PropsElementChange;
  }

  changeAtAndSize(at: mat3, w: number, h: number) {
    const { rt, parent } = this;
    const invAt = mat3.invert(_matCache.m2, (parent as GeometryNode).at);
    mat3.mul(rt, invAt, at);

    return {
      id: this.id,
      type: EElementChangeType.Props,
      props: {
        transform: mat2obj(rt),
        w,
        h,
      },
    } as PropsElementChange;
  }

  changeFillPaintColor(color: RGBAColor, index = 0) {
    const fillPaints = this.fillPaints;
    const currentPaint = fillPaints && fillPaints[index];
    const elementChange = {
      id: this.id,
      type: EElementChangeType.Props,
      props: {},
    } as PropsElementChange;
    if (currentPaint) {
      const newPaint = { ...currentPaint, color } as ISolidPaintProps;
      const newFillPaints = PaintProps.changeFillPaint(fillPaints, newPaint, index);
      elementChange.props = {
        fillPaints: newFillPaints,
      };
    }
    return elementChange;
  }

  changeFillPaint(fillPaint: Paint, index: number) {
    const fillPaints = this.fillPaints;
    const currentPaint = fillPaints && fillPaints[index];
    const elementChange = {
      id: this.id,
      type: EElementChangeType.Props,
      props: {},
    } as PropsElementChange;
    if (currentPaint) {
      const newFillPaints = PaintProps.changeFillPaint(fillPaints, fillPaint, index);
      elementChange.props = {
        fillPaints: newFillPaints,
      };
    }
    return elementChange;
  }

  addFillPaint(fillPaint: Paint, index?: number) {
    const fillPaints = this.fillPaints;
    const elementChange = {
      id: this.id,
      type: EElementChangeType.Props,
      props: {},
    } as PropsElementChange;
    if (fillPaints) {
      const newFillPaints = PaintProps.addFillPaint(fillPaints, fillPaint, index);
      elementChange.props = {
        fillPaints: newFillPaints,
      };
    }
    return elementChange;
  }

  // changeParentIndex(parentId: string, parentIndex: number = -1) {
  //   const parentNode = this.view.scene.getNodeById(parentId);
  //   const position = parentNode.splitParentPosition(parentIndex);
  //   const elementChange = {
  //     id: this.id,
  //     type: EElementChangeType.Move,
  //     parentIndex: {
  //       id: parentId,
  //       position
  //     },
  //   } as MoveElementChange;
  //   return elementChange;
  // }

  removeFillPaint(index: number) {
    const fillPaints = this.fillPaints;
    const elementChange = {
      id: this.id,
      type: EElementChangeType.Props,
      props: {},
    } as PropsElementChange;
    if (fillPaints) {
      const newFillPaints = PaintProps.removeFillPaint(fillPaints, index);
      elementChange.props = {
        fillPaints: newFillPaints,
      };
    }
    return elementChange;
  }

  // @ts-ignore
  updateRenderNode(renderCategorySet: RenderCategorySet) {
    // 这里需要做一层到category的转化，比如w、h对应的是size
    this.renderManager.updateRenderNode(this._renderNode, this);
    this.renderManager.dirty();
  }

  updateHoverAndSelect(props: RenderCategorySet = BaseNode.HOVERANDSELECT_RENDER_CATEGORY_SET) {
    const updateKeys = props;
    if (this._hoverNode) {
      this._hoverNode.update();
      // this.renderManager.updateWH(this._hoverNode.renderNode, this.w, this.h);
      // this.renderManager.updateMatrix(this._hoverNode.renderNode, this.at);
    }
    if (this._selectNode) {
      this._selectNode.update();
      // this.renderManager.updateWH(this._selectNode.renderNode, this.w, this.h);
      // this.renderManager.updateMatrix(this._selectNode.renderNode, this.at);
    }
    this.renderManager.dirty();
  }

  pick(pos: XYPos) {
    const localPoint = this._renderNode.worldTransform.applyInverse(pos);
    return this._renderNode?.containsPoint(localPoint);
  }
  //
  pickByBox(rect: XYWH, strict = false) {
    const points = this.apoints;
    const bounds: IRect = [rect.x, rect.y, rect.x + rect.w, rect.y + rect.h];
    if (strict) {
      return isPolygonInRect(points, bounds);
    } else {
      return isPolygonIntersectRect(points, bounds);
    }
  }

  // get eventManager() {
  //   return this._eventManager;
  // }

  get renderManager() {
    return this._renderManager;
  }

  get renderNode() {
    return this._renderNode;
  }

  get hoverNode() {
    return this._hoverNode;
  }

  get hoverRenderNode() {
    return this._hoverNode?.renderNode ?? null;
  }

  get selectNode() {
    return this._selectNode;
  }

  get selectRenderNode() {
    return this._selectNode?.renderNode ?? null;
  }

  // protected getDefaultRenderStyle(options?: { strokeWeight?: number; strokeColor?: RGBAColor }){
  //   const { strokeWeight = 1.5, strokeColor = COLOR_CONFIG.primary() } = options ?? {};
  //   return {
  //     strokeWeight,
  //     strokeColor,
  //   };
  // }

  /**
   * hover 框
   */
  showHover(visible = true) {
    if (!this._hoverNode) {
      this._hoverNode = new BaseCustomUnit(`hover_${this.id}`, this, this.view, {
        strokeWeight: 3,
        colorEnabled: false,
        // strokeColor: {
        //   r: 255,
        //   g: 0,
        //   b: 0,
        //   a: 1
        // }
      }) as ICustomNode;
    }
    this._hoverNode.isVisible = visible;
    this.renderManager.setHoverRenderNode(this.id, this._hoverNode);
    return this._hoverNode;
  }

  destroy() {
    this.renderNode.clear();
    this.renderManager.removeRenderNode(this.id);
    this._hoverNode?.destroy();
    this._selectNode?.destroy();
  }

  /**
   * 选中
   * @param {boolean} visible
   */
  showSelectBox(visible = true) {
    if (!this._selectNode) {
      this._selectNode = new BaseCustomUnit(`select_${this.id}`, this, this.view, {
        // strokeColor: COLOR_CONFIG['dark/purple/700'],
        strokeWeight: 2,
        colorEnabled: false,
        // strokeColor: {
        //   r: 255,
        //   g: 0,
        //   b: 0,
        //   a: 1
        // }
      }) as ICustomNode;
    }
    this.renderManager.setSelectRenderNode(this.id, this._selectNode);
    // this.renderManager.renderer.update();
    this._selectNode.isVisible = visible;
    return this._selectNode;
  }

  traverse(drawSelfLayer: (node: IBaseNode) => void): void {
    drawSelfLayer(this);
    if (this.children && this.children.length) {
      const childrenNodes = this.children as IBaseNode[];
      childrenNodes.forEach(children => children.traverse(drawSelfLayer));
    }
  }

  traverseParent(callBack: (node: IBaseNode) => boolean | void) {
    const parent = this.parent;
    if (!parent) {
      return;
    }
    callBack(this);
    (parent as IBaseNode).traverseParent(callBack);
  }
}
