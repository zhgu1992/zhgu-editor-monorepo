const FLIPX_MAT = mat3.fromValues(-1, 0, 0, 0, 1, 0, 0, 0, 1);
const FLIPY_MAT = mat3.fromValues(1, 0, 0, 0, -1, 0, 0, 0, 1);
import { mat3, vec2 } from 'gl-matrix';

/**
 * 设置某个中心点，基于A位置进行旋转变换再变换到B位置
 * @param aPos
 * @param bPos
 * @param rotateMatrix
 * @param originMatrix
 */
export function getMatrixFromATOB(
  aPos: [number, number],
  bPos: [number, number],
  rotateMatrix: mat3,
  originMatrix: mat3
) {
  const [x, y] = aPos;
  const [x1, y1] = bPos;
  const transformMatrix = mat3.create();
  // 将origin移动至[0,0];
  mat3.mul(transformMatrix, mat3.fromTranslation(mat3.create(), [-x, -y]), originMatrix);
  // 执行旋转变换
  mat3.mul(transformMatrix, rotateMatrix, transformMatrix);
  // 平移回去
  mat3.mul(transformMatrix, mat3.fromTranslation(mat3.create(), [x1, y1]), transformMatrix);
  return transformMatrix;
}

/**
 * 设置某个点为中心点进行矩阵边变换
 * @param center
 */
export function getMatrixFromCenterAndRotate(center: [number, number], rotateMatrix: mat3, originMatrix: mat3) {
  const [x, y] = center;
  return getMatrixFromATOB([x, y], [x, y], rotateMatrix, originMatrix);
}

//-------------------flip--------------------
/**
 * 根据center进行X方向翻转变换
 * @param center
 * @param originMatrix
 */
export function flipXFromCenter(center: [number, number], originMatrix: mat3) {
  return getMatrixFromCenterAndRotate(center, FLIPX_MAT, originMatrix);
}

/**
 * 根据自身中心点进行X方向翻转变换,注意需使用rt,这里相当于简化了操作
 */
export function flipXWithMyself(originMatrix: mat3) {
  const transformMatrix = mat3.create();
  mat3.mul(transformMatrix, originMatrix, FLIPX_MAT);
  return transformMatrix;
}
/**
 * 根据center进行Y方向翻转变换
 * @param center
 * @param originMatrix
 */
export function flipYFromCenter(center: [number, number], originMatrix: mat3) {
  return getMatrixFromCenterAndRotate(center, FLIPY_MAT, originMatrix);
}
/**
 * 根据自身中心点进行Y方向翻转变换,注意需使用rt,这里相当于简化了操作
 */
export function flipYWithMyself(originMatrix: mat3) {
  const transformMatrix = mat3.create();
  mat3.mul(transformMatrix, originMatrix, FLIPY_MAT);
  return transformMatrix;
}

//-------------------形变wh--------------------
/**
 * 基于原始矩阵、原始宽高、通过缩放变换产生形变
 * @param originMatrix
 * @param w
 * @param h
 * @param scaleMat
 */
export function doScale(originMatrix: mat3, w: number, h: number, scaleMat: mat3) {
  const resultMatrix = mat3.create();
  // 计算原 wh 下的变换矩阵
  mat3.mul(resultMatrix, scaleMat, originMatrix);
  // 计算变换后的 wh
  const p0 = vec2.transformMat3(vec2.create(), [0, 0], resultMatrix);
  const p1 = vec2.transformMat3(vec2.create(), [w, 0], resultMatrix);
  const p2 = vec2.transformMat3(vec2.create(), [w, h], resultMatrix);

  const newW = vec2.distance(p0, p1);
  const newH = vec2.distance(p1, p2);

  // 计算变换 wh 后的变换矩阵
  const dscale = vec2.fromValues(w / newW, h / newH);
  const dscaleMat = mat3.fromScaling(mat3.create(), dscale);

  // 抹除scale的影响，再变换回原始位置
  mat3.mul(resultMatrix, resultMatrix, dscaleMat);

  return { w: newW, h: newH, resultMatrix };
}
// 解构X方向单位矩阵
export function getNDirXFromMat(transformMatrix: mat3) {
  const dirX = [transformMatrix[0], transformMatrix[3]];
  return vec2.normalize(vec2.create(), dirX as vec2);
}
// 解构Y方向单位矩阵
export function getNDirYFromMat(transformMatrix: mat3) {
  const dirX = [transformMatrix[1], transformMatrix[4]];
  return vec2.normalize(vec2.create(), dirX as vec2);
}
