import {CustomCollection} from '../../../../node';
import type {IBaseNode, ICollection} from '../../../../interface';
import {mat3} from 'gl-matrix';
import {EImageScaleMode, EPaintType} from '@zhgu/type';
import {COLOR_CONFIG} from '../../../../const';
import {calcWHSignTranslate, canvasConfig, drawSvgPath, fillRoundRect, getSignText} from './utils';
import type {View} from '../../../../view';

export class WHSignRenderNode extends CustomCollection {
  private _ctx?: OffscreenCanvasRenderingContext2D;
  private cacheCanvas?: OffscreenCanvas;
  constructor(id: string, collection: ICollection, view: View) {
    super(id, collection, view, {
      strokeEnabled: false,
    });
    this._createCTX();
  }

  calcLineSignTranslate(containerNode: IBaseNode, signWidth: number, top: number) {
    const { apoints, w, rotation } = containerNode;
    const [startPoint, endPoint] = apoints;
    //y 值最小的 point

    if (startPoint[0] < endPoint[0]) {
      const rMat = mat3.fromRotation(mat3.create(), rotation * Math.PI / 180);
      const at = mat3.mul(mat3.create(), mat3.fromTranslation(mat3.create(), startPoint), rMat);
      return mat3.translate(mat3.create(), at, [
        w / 2 - signWidth / 2,
        this.eventManager.viewPort.screen2page(top) as number,
      ]);
    } else {
      const rMat = mat3.fromRotation(mat3.create(), (rotation + 180) * Math.PI / 180);
      const newAt = mat3.mul(mat3.create(), mat3.fromTranslation(mat3.create(), endPoint), rMat);
      return mat3.translate(mat3.create(), newAt, [
        w / 2 - signWidth / 2,
        this.eventManager.viewPort.screen2page(top) as number,
      ]);
    }
  }

  get w() {
    const word = `${getSignText(this.collection, 'hori')}${getSignText(this.collection, 'vertical')}`;
    const width = this._ctx?.measureText(word).width || this.collection.w;
    const { multiple } = canvasConfig;
    const lastWidth = width / multiple;
    return this.eventManager.viewPort.screen2page(
        lastWidth +
        canvasConfig.hPadding +
        canvasConfig.wordGap +
        canvasConfig.svgWidth,
    ) as number;
  }

  get h() {
    return this.eventManager.viewPort.screen2page(
        canvasConfig.height + canvasConfig.vPadding,
    ) as number;
  }

  get at() {
    const { top } = canvasConfig;
    const { nodes } = this.collection;
    this.isVisible = nodes.length > 0;
    const { at, d } = calcWHSignTranslate(this.collection);
    return mat3.translate(mat3.create(), at, [
      d / 2 - this.w / 2,
      this.eventManager.viewPort.screen2page(top) as number,
    ]);
  }

  private _createCTX() {
    const canvas = new OffscreenCanvas(1, 1);
    const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    this.cacheCanvas = canvas;
    this._ctx = ctx;

    this.updateCTX();
  }

  private updateCTX() {
    if (this._ctx && this.cacheCanvas) {
      const { fillStyle, fontSize, fontFamily, fontWeight, multiple } = canvasConfig;
      this._ctx.font = `${fontWeight} ${fontSize * multiple}px ${fontFamily}`;
      this.cacheCanvas.width = this.w * this.eventManager.viewPort.zoom * multiple;
      // 默认高度 * 倍图
      this.cacheCanvas.height = this.h * this.eventManager.viewPort.zoom * multiple;
      this._ctx.fillStyle = fillStyle;
      // 设置默认颜色
      this._ctx.font = `${fontWeight} ${fontSize * multiple}px ${fontFamily}`;
      this._ctx.textBaseline = 'middle';
    }
  }

  renderSign() {
    const { nodes } = this.collection;
    const node = nodes[0];
    const useSymbolColor = false;
    const { r, g, b, a } = COLOR_CONFIG['light/purple/500'];
    const fillColor = useSymbolColor ? `rgba(${r}, ${g}, ${b}, ${a})` : 'rgba(0, 142, 250, 1)';
    if (this._ctx && this.cacheCanvas) {
      // 判断是否改变颜色
      const { multiple } = canvasConfig;
      fillRoundRect(
        this._ctx,
        0,
        0,
        this.cacheCanvas.width,
        this.cacheCanvas.height,
        canvasConfig.radius * multiple,
        fillColor,
      );
      const sumWidth =
        this._ctx?.measureText(
          `${getSignText(this.collection, 'hori')}${getSignText(this.collection, 'vertical')}`,
        ).width +
        (canvasConfig.wordGap + canvasConfig.svgWidth) *
          canvasConfig.multiple;
      const startX = (this.cacheCanvas?.width - sumWidth) / 2;
      const horiWord = `${getSignText(this.collection, 'hori')}`;
      const horiWidth = this._ctx?.measureText(horiWord).width;
      this._ctx.fillText(horiWord, startX, this.cacheCanvas?.height / 2);
      drawSvgPath(
        this._ctx,
        startX +
          horiWidth +
          (canvasConfig.wordGap / 2) * canvasConfig.multiple,
        ((canvasConfig.height +
          canvasConfig.vPadding -
          canvasConfig.svgWidth) /
          2) *
          canvasConfig.multiple,
        canvasConfig.multiple,
      );
      const verticalWord = `${getSignText(this.collection, 'vertical')}`;
      this._ctx.fillText(
        verticalWord,
        startX +
          horiWidth +
          canvasConfig.svgWidth * canvasConfig.multiple +
          canvasConfig.wordGap * canvasConfig.multiple,
        this.cacheCanvas?.height / 2,
      );
    }
  }

  update(): void {
    this.setDefaultPaint();
    super.update();
  }

  setDefaultPaint() {
    if (!this.cacheCanvas) {
      return;
    }
    this.updateCTX();
    this.renderSign();

    const bitmap = this.cacheCanvas!.transferToImageBitmap();
    this.fillPaints = [{
      type: EPaintType.Image,
      image: bitmap,
      imageScaleMode: EImageScaleMode.FIT,
      isEnabled: true,
    }] as any;
  }

}
