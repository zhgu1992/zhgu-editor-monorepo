import { vec2 } from 'gl-matrix';

export type CornerDirection = 'lt' | 'rt' | 'rb' | 'lb' | 'lm' | 'rm';
export type BorderDirection = 'l' | 't' | 'r' | 'b';
export type AllDirection = BorderDirection | CornerDirection;

/**
 * 获取旋转指针
 * @param options
 * @param dr
 * @returns
 */
export function getRotateCursor(options: { apoints: vec2[]; key: CornerDirection }, dr = 0) {
  const angle = (getCornerAngle(options) ?? 0) + 225;
  const thisDeg = roundAngle(Math.floor(((angle + 90 + dr) % 360) / 6) * 6);

  return `cursor-rotate-${Math.floor(thisDeg)}`;
}

/**
 * 获取缩放指针
 * @param options
 * @param dr
 * @returns
 */
export function getResizeCursor(options: { apoints: vec2[]; key: AllDirection }) {
  const angle = getResizeAngle(options);
  let thisDeg = angle >= 180 ? angle - 180 : angle;
  return `cursor-scale-${thisDeg}`;
}

/**
 * 计算包围盒边角的 resize 指针角度
 * @param options
 * @returns
 */
function getResizeAngle(options: { apoints: vec2[]; key: AllDirection }) {
  let angle = getCornerAngle(options as { apoints: vec2[]; key: CornerDirection });
  if (angle !== undefined) {
    return roundAngle(Math.round((angle % 360) / 6) * 6 + 90);
  }

  angle = getBorderAngle(options as { apoints: vec2[]; key: BorderDirection });
  return roundAngle(Math.round((angle % 360) / 6) * 6);
}

function getCornerAngle(options: { apoints: vec2[]; key: CornerDirection }) {
  const { apoints, key } = options;
  // 矩形的四个旋转点
  let i = ['lt', 'rt', 'rb', 'lb'].indexOf(key);
  if (i === -1) {
    // 都没有，再测测直线的两个旋转点
    i = ['lm', 'rm'].indexOf(key);
  }
  if (i === -1) {
    return;
  }

  const pm = apoints[i];
  const pl = apoints[(i + 3) % 4];
  const pr = apoints[(i + 1) % 4];
  const vl = vec2.sub(vec2.create(), pl, pm);
  const vr = vec2.sub(vec2.create(), pr, pm);
  const v = vec2.add(vec2.create(), vec2.normalize(vec2.create(), vl), vec2.normalize(vec2.create(), vr));

  return (Math.atan2(v[1], v[0]) / Math.PI) * 180;
}

function getBorderAngle(options: { apoints: vec2[]; key: BorderDirection }) {
  const { apoints, key } = options;
  if (key === 'l' || key === 'r') {
    return twoPointsToAngle(apoints[0], apoints[3]);
  } else {
    return twoPointsToAngle(apoints[2], apoints[3]);
  }
}

/**
 * [通过两个点的坐标算其线段与水平方向的夹角]
 * @param point1
 * @param point2
 * @returns
 */
function twoPointsToAngle(point1: vec2, point2: vec2) {
  const [x1, y1] = point1;
  const [x2, y2] = point2;
  const radian = Math.atan((y2 - y1) / (x2 - x1));
  const angle = (radian * 180) / Math.PI;

  return angle;
}

/**
 * 将角度标准化为 0-360 范围内
 * @param rotation 输入角度
 * @returns 标准化后的角度
 */
function roundAngle(rotation: number) {
  return ((rotation % 360) + 360) % 360;
}
