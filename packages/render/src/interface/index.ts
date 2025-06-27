import type { XYPos } from '@zhgu/type';
import type { mat3 } from 'gl-matrix';

export interface IRenderNode {
  containsPoint: (point: XYPos) => boolean;
  clear: () => void;
  setSize: (w: number, h: number) => void;
  setVisible: (val: boolean) => void;
  setTransform: (matrix: mat3) => void;
  setRenderOrder: (order: number) => void;
}
