type Transform = {
  m00: number;
  m01: number;
  m02: number;
  m10: number;
  m11: number;
  m12: number;
};

export type XYWH = { x: number; y: number; w: number; h: number };

export interface XYPos {
  x: number;
  y: number;
}

interface ITransformProps {
  transform: Transform;
}

export { Transform, ITransformProps };
