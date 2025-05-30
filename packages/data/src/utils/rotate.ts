import { vec2, mat3 } from 'gl-matrix';
import { radians } from './convert';


export function rotate(at: mat3, rotation: number, apivot: vec2) {

  // 移动到旋转中心平移矩阵
  const toPivotMat = mat3.fromTranslation(mat3.create(), vec2.negate(vec2.create(), apivot));
  // 回到原点平移矩阵
  const fromPivotMat = mat3.fromTranslation(mat3.create(), apivot);
  // 旋转矩阵
  const rotationMat = mat3.fromRotation(mat3.create(), radians(rotation));

  const resultAt = mat3.create();
  mat3.mul(resultAt, toPivotMat, at);
  mat3.mul(resultAt, rotationMat, resultAt);
  mat3.mul(resultAt, fromPivotMat, resultAt);
  return resultAt;
};






