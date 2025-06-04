import type { IEditorCanvasData, IInputSnapshot } from '../interface';
import EventEmitter from 'eventemitter3';


export interface ICanvasEdgeMovementCbProps {
  autoChangePos: { autoChangePosX: number; autoChangePosY: number };
  ratio?: number[];
  inputSnapshot: IInputSnapshot;
}

export type TCanvasEdgeMovementCb = (props: ICanvasEdgeMovementCbProps) => void;
/**
 * canvas计算管理器
 * todo resize相关的均需要更新结果
 */
export class EditorCanvasManager extends EventEmitter {
  canvasDom: HTMLCanvasElement;
  cache_boundingClientRect: DOMRect;
  private _preUrl: string = '';
  private _cursorConfig: Record<string, string> = {};

  constructor(canvasDom: HTMLCanvasElement) {
    super();
    this.canvasDom = canvasDom;
    this.cache_boundingClientRect = canvasDom.getBoundingClientRect();
  }

  setSize(){

  }

  loadCursorResource() {

  }

  async setCursorType(cursorType = 'default') {
    this.canvasDom.className = cursorType;
  }

  registerPreUrl(preUrl: string){
    this._preUrl = preUrl;
  }

  registerCursorConfig(name: string, width = 64, height = 64, hotSpotX = 4, hotSpotY = 4) {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = this._preUrl + name + '.png';
    return new Promise<string>((res, rej) => {
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.scale(devicePixelRatio, devicePixelRatio);
        ctx.drawImage(image, 0, 0, width * devicePixelRatio, height * devicePixelRatio, 0, 0, width, height);
        const scaledWidth = Math.ceil(width / devicePixelRatio);
        const scaledHeight = Math.ceil(height / devicePixelRatio);
        const cursorUrl = canvas.toDataURL();
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + scaledWidth + 'px" height="' + scaledHeight + 'px">' + '<image xlink:href="' + cursorUrl + '" width="' + width + '" height="' + height + '"/>' + '</svg>';
        res(`url(data:image/svg+xml;base64,${btoa(svg)}) ${hotSpotX / devicePixelRatio} ${hotSpotY / devicePixelRatio}, auto`);
      };

      image.onerror = () => {
        rej();
      };
    });
  }
}
