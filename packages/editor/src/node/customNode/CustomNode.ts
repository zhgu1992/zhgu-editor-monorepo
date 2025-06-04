import type { FillPaints, IStrokeProps, RenderCategorySet } from '@zhgu/type';
import { EPaintType } from '@zhgu/type';
import { mat3 } from 'gl-matrix';
import type { RenderManager } from '../../render';
import { COLOR_CONFIG } from '../../const';
import type { ICustomNode, ICustomStyledOptions } from '../../interface';
import type { View } from '../../view';
import type { EventManager } from '../../event';
import { IRenderNode } from '@zhgu/render';
import {Matrix} from "pixi.js";

// const pathCache = new Map<string, PxPath>();

/**
 * 自定义渲染节点
 */
export class CustomNode implements ICustomNode{
  id: string;
  private _isVisible = true;
  private _renderOrder = 0;
  private _renderManager: RenderManager;
  private _eventManager: EventManager;
  fillPaints?: FillPaints;
  strokeProps?: IStrokeProps;
  private _at = mat3.fromValues(1, 0, 0, 0, 1, 0, 0, 0, 1);
  private _renderNode: IRenderNode;
  private _cursor: string|null = null;
  private _view: View;
  hoverTip?: string;
  private _options: ICustomStyledOptions;

  constructor(id: string, view: View, options: Partial<ICustomStyledOptions> = {}) {
    this.id = id;
    this._view = view;
    this._renderManager = view.renderManager!;
    this._eventManager = view.eventManager!;
    this._options = {
      strokeWeight : 1.5,
      strokeColor:COLOR_CONFIG.primary(),
      color: COLOR_CONFIG['light/purple/500'],
      opacity: 0.1,
      colorEnabled: true,
      strokeEnabled: true,
      strokeOpacity: 1,
      sizeAttenuation: false,
      ...options
    };
    this._renderNode = view.renderManager!.createEmptyNode();
  }

  get x(){
    return 0;
  }

  get y(){
    return 0;
  }

  get w(){
    return 0;
  }

  get h(){
    return 0;
  }

  get options(): ICustomStyledOptions {
    return this._options;
  }

  get view(){
    return this._view;
  }

  setDefaultPaint() {
    const { color, opacity, colorEnabled } = this.options;
    if(!colorEnabled){
      this.fillPaints = [];
    }else{
      this.fillPaints = [
        {
          type: EPaintType.Solid,
          opacity,
          isEnabled: colorEnabled,
          color: color ,
        },
      ] as FillPaints;
    }

  }

  setDefaultStroke(){
    const { strokeWeight, strokeColor, strokeEnabled, strokeOpacity } = this.options;
    if(!strokeEnabled){
      this.strokeProps = {} as IStrokeProps;
    }else{
      this.strokeProps = {
        strokeWeight,
        strokePaints: [
          {
            type: EPaintType.Solid,
            opacity: strokeOpacity,
            isEnabled: strokeEnabled,
            color: strokeColor,
          },
        ] as FillPaints
      } as IStrokeProps;
    }
  }
  /**
   * 定义自定义节点的默认样式，自定义节点的样式基本不需要修改，但是matrix需要跟随node而变化
   */
  setDefaultStyle(){
    this.setDefaultPaint();
    this.setDefaultStroke();
    this.renderManager.updateRenderNode(this.renderNode, this as any);
  }

  get renderManager() {
    return this._renderManager;
  }

  get eventManager() {
    return this._eventManager;
  }

  get cursor(): string | null {
    return this._cursor;
  }

  setSize(w: number, h: number) {
    this.renderNode.setSize([w, h]);
  }

  get isCustomNode() {
    return true;
  }

  get renderNode(){
    return this._renderNode;
  }

  set renderNode(renderNode: any) {
    this._renderNode = renderNode;
  }

  set isVisible(value: boolean) {
    this._isVisible = value;
    this.renderNode.visible = value;
    // this.renderManager.renderer.update();
  }

  get isVisible() {
    return this._isVisible;
  }

  /**
   * 渲染队列，renderOder大的在上面
   * @returns {number}
   */
  get renderOrder(){
    return this._renderOrder;
  }

  set renderOrder(renderOrder: number) {
    this._renderOrder = renderOrder;
  }

  setPosition(x: number, y: number) {
    this._at = mat3.fromValues(1, 0, 0, 0, 1, 0, x, y, 1);
    // const animMatrix = this._at;
    // // 转换为Pixi矩阵
    // const animPixiMatrix = new Matrix(
    //     animMatrix[0], animMatrix[1], animMatrix[3],
    //     animMatrix[4], animMatrix[6], animMatrix[7]
    // );
    // this.renderNode.setFromMatrix(animPixiMatrix);
  }

  setPath(){
    // this.renderManager.updateRenderNode(this, this.renderNode, new Set(['size']));
  }

  get at() {
    return this._at;
  }

  update(){
    // this.renderNode.setDirty();
    this.renderManager.updateRenderNode(this.renderNode, this as any);
  }

  updateByCategory(renderCategorySet: RenderCategorySet){
    // this.renderManager.updateRenderNode(this, this.renderNode, renderCategorySet);
  }

  updateMatrix(){

  }

  destroy(){
    this.renderManager.removeHoverRenderNode(this.id);
    this.renderManager.removeSelectNode(this.id);
    this.renderNode.clear();
  }
}
