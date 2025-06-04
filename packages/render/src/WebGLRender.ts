import { Application, Graphics, Container, Texture, Matrix } from 'pixi.js';
import type { INodeModel } from '@zhgu/data';
import type { IImagePaintProps, ISolidPaintProps, XYPos } from '@zhgu/type';
import { EPaintType } from '@zhgu/type';
import type { IRenderNode } from './interface';
import type { mat3 } from 'gl-matrix';

export class WebGLRender {
  private _app = new Application();
  private _nodeCache = new Map<string, IRenderNode>();
  private _viewPort: Container<IRenderNode> = new Container();
  async init(id: string = 'app') {
    // Create a new application
    const app = this._app;
    const parent = window.document.getElementById(id)!;
    // Initialize the application
    await app.init({ resizeTo: parent });
    // Append the application canvas to the document body
    parent.appendChild(app.canvas);
    app.stage.addChild(this._viewPort);
  }

  createEmptyNode() {
    const graphics = new Graphics();
    this._viewPort.addChild(graphics);
    return graphics;
  }

  setViewPortPosition(pos: XYPos) {
    this._viewPort.position.set(pos.x, pos.y); // 向右下移动内容
  }

  update() {}

  setZoom(value: number) {}

  get app() {
    return this._app;
  }

  get canvas() {
    return this._app.canvas;
  }
  createRenderNode(data: INodeModel) {
    const props = data;
    if (props.type === 'Document' || props.type === 'Page') {
      return null;
    }

    const graphics = this.createEmptyNode();
    this.updateRenderNode(graphics, data);
    return graphics;
  }

  processColor(fill: ISolidPaintProps) {
    const color = fill.color;
    const opacity = fill.opacity;
    return [color.r / 255, color.g / 255, color.b / 255, color.a * opacity];
  }

  updateMatrix(graphics: Graphics, at: mat3) {
    const animMatrix = at;
    // 转换为Pixi矩阵
    const animPixiMatrix = new Matrix(
      animMatrix[0],
      animMatrix[1],
      animMatrix[3],
      animMatrix[4],
      animMatrix[6],
      animMatrix[7]
    );
    graphics.setFromMatrix(animPixiMatrix);
  }

  updateWH(graphics: Graphics, w: number, h: number) {
    graphics.rect(0, 0, w, h);
  }

  setRenderOrder(graphics: Graphics, order: number) {
    graphics.zIndex = order;
  }

  /**
   * todo 后续再看看pixi，感觉性能不行，可能需要换three.js
   * @param graphics
   * @param props
   * @param keySet
   */
  updateRenderNode(graphics: Graphics, props: INodeModel) {
    graphics.clear();
    // Rectangle
    // graphics.rect(props.x, props.y, props.w, props.h);
    graphics.rect(0, 0, props.w, props.h);
    const animMatrix = props.at;
    // 转换为Pixi矩阵
    const animPixiMatrix = new Matrix(
      animMatrix[0],
      animMatrix[1],
      animMatrix[3],
      animMatrix[4],
      animMatrix[6],
      animMatrix[7]
    );
    graphics.setFromMatrix(animPixiMatrix);
    const fillPaints = props.fillPaints ?? [];
    if (fillPaints.length > 0) {
      const fill = props.fillPaints[0] as ISolidPaintProps;
      // @ts-ignore
      if (fill.type === EPaintType.Image) {
        const imageFill = fill as unknown as IImagePaintProps;
        const texture = Texture.from(imageFill.image);
        graphics.fill(texture);
      } else {
        graphics.fill(this.processColor(fill));
      }
    }
    const strokeProps = props.strokeProps;
    const strokes = strokeProps.strokePaints ?? [];
    if (strokes.length > 0) {
      const width = strokeProps.strokeWeight;
      const stroke = strokes[0] as ISolidPaintProps;
      graphics.stroke({ width, color: this.processColor(stroke) });
    }
    // keySet.forEach(key => {
    //     if(key === 'transform'){
    //         // Rectangle
    //         graphics.rect(props.x, props.y, props.w, props.h);
    //     }else if(key === 'fillPaints'){
    //         const fill = props.fillPaints[0] as ISolidPaintProps;
    //         graphics.fill(this.processColor(fill));
    //     }else if(key === 'stroke'){
    //         const strokes = props.strokePaints;
    //         if(strokes.length > 0){
    //             const width = props.strokeWeight;
    //             const stroke = strokes[0] as ISolidPaintProps;
    //             graphics.stroke({width, color:this.processColor(stroke)});
    //         }
    //     }
    // });
  }
}
