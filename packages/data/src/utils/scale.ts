import type { XYWH } from '@zhgu/type';
import { mat3, vec2 } from 'gl-matrix';
import { aabb, getObbPoints } from './points';

export function constraintBox(w: number, h: number, mat: mat3) {
  const points = getObbPoints({ w, h, mat });
  const box = aabb(points);
  return box;
}
