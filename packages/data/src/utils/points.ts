import { vec2 } from 'gl-matrix';

import type { mat3} from 'gl-matrix';


type Geometry = {
  w: number;
  h: number;
  mat: mat3
}
export const getObbPoints = function ({ w, h, mat }: Geometry) {
  const p0 = vec2.fromValues(0, 0);
  const p1 = vec2.fromValues(w, 0);
  const p2 = vec2.fromValues(w, h);
  const p3 = vec2.fromValues(0, h);

  vec2.transformMat3(p0, p0, mat);
  vec2.transformMat3(p1, p1, mat);
  vec2.transformMat3(p2, p2, mat);
  vec2.transformMat3(p3, p3, mat);
  return [p0, p1, p2, p3];
};

type XYWH = {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function aabb(points: ([number, number] | vec2)[]): XYWH {
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;

  points.forEach((p: vec2, _index: number): void => {
    if (_index === 0) {
      minX = maxX = p[0];
      minY = maxY = p[1];
    } else {
      if (p[0] < minX) {
        minX = p[0];
      } else if (p[0] > maxX) {
        maxX = p[0];
      }
      if (p[1] < minY) {
        minY = p[1];
      } else if (p[1] > maxY) {
        maxY = p[1];
      }
    }
  });

  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}