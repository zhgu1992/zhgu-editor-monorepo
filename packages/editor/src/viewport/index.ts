import type { XYPos, XYWH, ZoomAtOptions } from '@zhgu/type';
import type { IEditorCanvasData } from '../interface';
import { clamp } from 'lodash-es';
import BezierEasing from 'bezier-easing';
import { EViewPortEventType } from '../const';
import type { EventBus } from '../event';
import type { RenderManager } from '../render';

export class ViewPort {
  private _zoom = 1;
  private _position = { x: 0, y: 0 };
  private renderManager: RenderManager;
  private canvasDom: HTMLCanvasElement;
  private _eventBus: EventBus;
  cache_boundingClientRect: DOMRect;

  constructor(canvasDom: HTMLCanvasElement, renderManager: RenderManager, eventBus: EventBus) {
    this.canvasDom = canvasDom;
    this.renderManager = renderManager;
    this._eventBus = eventBus;
    this.cache_boundingClientRect = canvasDom.getBoundingClientRect();
  }

  get canvasData(): IEditorCanvasData {
    return {
      id: this.canvasDom.id,
      clientWidth: this.canvasDom.clientWidth,
      clientHeight: this.canvasDom.clientHeight,
      height: this.canvasDom.height,
      width: this.canvasDom.width,
      // 是canvasDom的屏幕位置
      clientX: this.cache_boundingClientRect.x,
      clientY: this.cache_boundingClientRect.y,
    };
  }

  get zoom(): number {
    return this._zoom;
  }

  set zoom(value: number) {
    if (this._zoom === value) {
      return;
    }
    const oldZoom = this._zoom;
    this._zoom = value;
    this.renderManager.setZoom(value);
    this.renderManager.update();
    this.emitZoomChange(value, oldZoom);
  }

  get position(): XYPos {
    return this._position;
  }

  set position(position: XYPos) {
    limitPostion(position, this._zoom, this.canvasDom);

    if (this._position.x === position.x && this._position.y === position.y) {
      return;
    }
    this.renderManager.setViewPortPosition(position);
    this._position = { x: position.x, y: position.y };
    this.renderManager.update();
    this.emitPositionChange(position);
  }

  get canvasViewBox(): XYWH {
    return {
      ...this._position,
      w: this.canvasDom.clientWidth / this._zoom,
      h: this.canvasDom.clientHeight / this._zoom,
    };
  }

  get center(): XYPos {
    const { x, y, w, h } = this.canvasViewBox;
    return {
      x: x + w / 2,
      y: y + h / 2,
    };
  }

  page2screen(pos: number | XYPos): number | XYPos {
    const zoom = this.zoom;
    if (typeof pos === 'number') {
      return pos * zoom;
    }

    return {
      x: (pos.x - this.position.x) * zoom,
      y: (pos.y - this.position.y) * zoom,
    };
  }

  screen2page(pos: number | XYPos): number | XYPos {
    const zoom = this.zoom;
    if (typeof pos === 'number') {
      return pos / zoom;
    }

    return {
      x: pos.x / zoom + this.position.x,
      y: pos.y / zoom + this.position.y,
    };
  }

  /**
   * 将节点 node 放到画布正中心
   * @param node
   * @param noAnimation 是否去掉动画
   * @returns
   */
  zoomIntoView(aabb: XYWH, noAnimation?: boolean) {
    const zoom = this.zoom;
    const { x: maxX, y: maxY, w: maxW, h: maxH } = aabb;
    const sph = 50,
      spv = 50;

    // 当前canvas的尺寸
    const { width, height } = this.canvasDom;
    // 左上角 x、y
    const { x: px, y: py } = this.position;

    // 目标放大倍数（以宽、高最小缩放比为基准）
    let targetZoom = clamp(Math.min((width / 2 - 2 * sph) / maxW, (height / 2 - 2 * spv) / maxH), 0.02, 4);

    // 页面移动的目标位置，调整公式确保是移动到屏幕的正中心
    const targetPos = {
      x: maxX + maxW / 2 - width / (4 * targetZoom),
      y: maxY + maxH / 2 - height / (4 * targetZoom),
    };

    const targetViewPos = { x: targetPos.x * targetZoom, y: targetPos.y * targetZoom };

    const pageViewPos = { x: px * zoom, y: py * zoom };

    const deltaZoom = targetZoom - zoom;
    const deltaX = targetViewPos.x - pageViewPos.x;
    const deltaY = targetViewPos.y - pageViewPos.y;

    if (noAnimation) {
      this.zoom = targetZoom;
      this.position = targetPos;
    } else {
      this.cubicChangeViewport([pageViewPos.x, pageViewPos.y, zoom], [deltaX, deltaY, deltaZoom]);
    }
  }

  /**
   * 在该位置处进行缩放
   */
  zoomAt(position: XYPos, options: ZoomAtOptions) {
    let { state, zoom = this.zoom } = options;
    if (state) {
      zoom = getNextZoom(this.zoom, state);
    }
    const oldZoom = this.zoom;
    this.zoom = zoom;
    const { x: oldX, y: oldY } = this.position;
    const { x, y } = position;
    const currentScreenPointX = (x - oldX) * oldZoom;
    const currentScreenPointY = (y - oldY) * oldZoom;
    const offsetX = currentScreenPointX;
    const offsetY = currentScreenPointY;
    const newX = oldX - offsetX * (1 / zoom - 1 / oldZoom);
    const newY = oldY - offsetY * (1 / zoom - 1 / oldZoom);
    this.position = { x: newX, y: newY };
  }

  private cubicChangeViewport(
    [originX, originY, originZoom]: [number, number, number],
    [deltaX, deltaY, deltaZoom]: [number, number, number]
  ) {
    const ease = BezierEasing(0.42, 0, 0.58, 1);
    const duration = 400;
    let start: number | undefined = undefined;
    const timingHandle: FrameRequestCallback = timestamp => {
      if (start === undefined) {
        start = timestamp;
      }

      const elapsed = timestamp - start;
      const rate = Math.min(elapsed / duration, 1);

      const curZoom = originZoom + deltaZoom * ease(rate);
      const offsetX = originX + deltaX * ease(rate);
      const offsetY = originY + deltaY * ease(rate);

      const finalX = offsetX / curZoom;
      const finalY = offsetY / curZoom;

      this.zoom = curZoom;
      this.position = { x: finalX, y: finalY };

      if (rate < 1) {
        requestAnimationFrame(timingHandle);
      }
    };
    requestAnimationFrame(timingHandle);
  }
  emitZoomChange(value: number, oldZoom: number) {
    this._eventBus.emit(EViewPortEventType.ZoomChange, { data: value });
    if (Math.abs(Math.ceil(value) - Math.ceil(oldZoom)) >= 1) {
      this._eventBus.emit(EViewPortEventType.ZoomLevelChange, { data: value });
    }
  }

  emitPositionChange(position: XYPos) {
    this._eventBus.emit(EViewPortEventType.PositionChange, { data: position });
  }
}

function limitPostion(position: XYPos, zoom: number, canvasDom: HTMLCanvasElement) {
  if (position.x < -256000) {
    position.x = -256000;
  }
  if (position.y < -256000) {
    position.y = -256000;
  }
  const w = canvasDom.clientWidth / zoom;
  const h = canvasDom.clientHeight / zoom;
  if (position.x + w > 256000) {
    position.x = 256000 - w;
  }
  if (position.y + h > 256000) {
    position.y = 256000 - h;
  }
}

/**
 * 根据缩放规则获取下一个zoom
 * @param {number} zoom 要进行缩放的zoom
 * @param {number} state -1；按照缩放规则缩小到下一个zoom，1：按照缩放规则放大到下一个zoom
 */
export function getNextZoom(zoom: number, state: -1 | 1) {
  let maxZoom, minZoom, newZoom;
  zoom = Number(zoom.toFixed(2));
  if (state > 0) {
    newZoom = maxZoom = Number((zoom * 2).toFixed(2));
    minZoom = zoom;
  } else {
    maxZoom = zoom;
    newZoom = minZoom = Number((zoom * 0.5).toFixed(2));
  }
  if (minZoom < 1 && maxZoom > 1) {
    return 1;
  }
  return clamp(newZoom, 0.02, 256);
}
