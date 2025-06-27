import type { IRenderNode } from '../interface';
import type { Graphics } from 'pixi.js';
import type { XYPos } from '@zhgu/type';
import type { mat3 } from 'gl-matrix';

export interface IRenderNodeProps extends IRenderNode {
  graphics: Graphics;
}

export class RenderNode implements IRenderNodeProps {
  graphics: Graphics;
  constructor(graphics: Graphics) {
    this.graphics = graphics;
  }
  containsPoint(pos: XYPos) {
    const localPoint = this.graphics.worldTransform.applyInverse(pos);
    return this.graphics.containsPoint(localPoint);
  }
  clear() {
    this.graphics.clear();
  }

  setSize(w: number, h: number) {
    this.graphics.setSize(w, h);
  }

  setVisible(visible: boolean) {
    this.graphics.visible = visible;
  }

  setTransform(matrix: mat3) {
    // @ts-ignore
    this.graphics.setTransform(matrix);
  }

  setRenderOrder(order: number) {
    this.graphics.zIndex = order;
  }
}
