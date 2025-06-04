import type { XYPos } from '@zhgu/type';
import { vec2, mat3 } from 'gl-matrix';
import { radians } from './convert';

const _rotateCache = {
  vec2: vec2.create(),
  mat1: mat3.create(),
  mat2: mat3.create(),
  mat3: mat3.create(),
  resultAt: mat3.create(),
};

export function rotate(at: mat3, rotation: number, apivot: vec2) {
  // 移动到旋转中心平移矩阵
  const toPivotMat = mat3.fromTranslation(_rotateCache.mat1, vec2.negate(_rotateCache.vec2, apivot));
  // 回到原点平移矩阵
  const fromPivotMat = mat3.fromTranslation(_rotateCache.mat2, apivot);
  // 旋转矩阵
  const rotationMat = mat3.fromRotation(_rotateCache.mat3, radians(rotation));
  mat3.mul(_rotateCache.resultAt, toPivotMat, at);
  mat3.mul(_rotateCache.resultAt, rotationMat, _rotateCache.resultAt);
  mat3.mul(_rotateCache.resultAt, fromPivotMat, _rotateCache.resultAt);
  return _rotateCache.resultAt;
}

/**
 * [以_centerXY为旋转中心，3点钟方向逆时针获取角度]
 * @param centerXY
 * @param endXY
 */
export function getAngleByRotate(centerXY: XYPos, endXY: XYPos) {
  const endPos = {
    x: endXY.x - centerXY.x,
    y: endXY.y - centerXY.y,
  };
  if (endPos.x == 0 && endPos.y == 0) {
    return 0;
  }
  const angle = getAngleByThreePoint([0, 0], [100, 0], [endPos.x, endPos.y]);

  return endXY.y - centerXY.y > 0 ? 360 - angle : angle;
}

/**
 * 传入任意三个点，获取旋转角度
 *
 * @param {XYPos} centerXY
 * @param {XYPos} startXY
 * @param {XYPos} endXY
 * @returns
 */
export function getAngleByThreePoint(centerXY: vec2, startXY: vec2, endXY: vec2) {
  const [centerX, centerY] = centerXY;
  const [startX, startY] = startXY;
  const [endX, endY] = endXY;
  const maX = startX - centerX;
  const maY = startY - centerY;
  const mbX = endX - centerX;
  const mbY = endY - centerY;
  const v1 = maX * mbX + maY * mbY;
  const maVal = Math.sqrt(maX * maX + maY * maY);
  const mbVal = Math.sqrt(mbX * mbX + mbY * mbY);
  const cosM = v1 / (maVal * mbVal);

  return (Math.acos(cosM) * 180) / Math.PI;
}
