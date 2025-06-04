import type { Transform } from '@zhgu/type';
import { mat3 } from 'gl-matrix';

export function mat2obj(v: mat3): Transform {
  return {
    m00: v[0],
    m01: v[3],
    m02: v[6],
    m10: v[1],
    m11: v[4],
    m12: v[7],
  };
}

export function obj2mat(t: Transform): mat3 {
  return mat3.fromValues(t.m00, t.m10, 0, t.m01, t.m11, 0, t.m02, t.m12, 1);
}
