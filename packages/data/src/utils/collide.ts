import type { XYWH } from '@zhgu/type';
import type { vec2 } from 'gl-matrix';

export type IRect = [
  left: number,
  top: number,
  right: number,
  bottom: number,
];

/**
 * 判断点是否在矩形内
 * @param point
 * @param rect
 * @returns
 */
export const isPointInRect = (point: vec2, rect: IRect) => {
  const [x, y] = point;
  return (
    x >= rect[0] &&
    x <= rect[2] &&
    y >= rect[1] &&
    y <= rect[3]
  );
};

/**
 * 判断点是否在多边形内（射线法）
 * @param point
 * @param polygon
 * @returns
 */
export const isPointInPolygon = (point: vec2, polygon: vec2[]) => {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
};

/**
 * 计算方向，0: 共线 1: pqr顺时针 2: pqr逆时针
 * @param p
 * @param q
 * @param r
 * @returns
 */
const orientation = (p: vec2, q: vec2, r: vec2) => {
  const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
  return val === 0 ? 0 : (val > 0 ? 1 : 2);
};

/**
 * 判断点 q 是否在 p 和 r 之间
 * @param p
 * @param q
 * @param r
 * @returns
 */
const onSegment = (p: vec2, q: vec2, r: vec2) => {
  return (
    q[0] <= Math.max(p[0], r[0]) &&
    q[0] >= Math.min(p[0], r[0]) &&
    q[1] <= Math.max(p[1], r[1]) &&
    q[1] >= Math.min(p[1], r[1])
  );
};

/**
 * 判断线段是否相交
 * @param p1
 * @param p2
 * @param p3
 * @param p4
 * @returns
 */
export const isLinesIntersect = (p1: vec2, p2: vec2, p3: vec2, p4: vec2) => {
  const o1 = orientation(p1, p2, p3);
  const o2 = orientation(p1, p2, p4);
  const o3 = orientation(p3, p4, p1);
  const o4 = orientation(p3, p4, p2);

  // 判断线段相交
  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  // 处理共线
  if (o1 === 0 && onSegment(p1, p3, p2)) {
    return true;
  }
  if (o2 === 0 && onSegment(p1, p4, p2)) {
    return true;
  }
  if (o3 === 0 && onSegment(p3, p1, p4)) {
    return true;
  }
  if (o4 === 0 && onSegment(p3, p2, p4)) {
    return true;
  }
  return false;
};

/**
 * 判断矩形是否在多边形内
 * @param rect
 * @param polygon
 * @returns
 */
export const isRectInPolygon = (rect: IRect, polygon: vec2[]) => {
  const points: vec2[] = [
    [rect[0], rect[1]],
    [rect[2], rect[1]],
    [rect[2], rect[3]],
    [rect[0], rect[3]],
  ];
  for (const point of points) {
    if (!isPointInPolygon(point, polygon)) {
      return false;
    }
  }
  return true;
};

/**
 * 判断多边形在矩形内
 * @param polygon
 * @param rect
 * @returns
 */
export const isPolygonInRect = (polygon: vec2[], rect: IRect) => {
  for (const point of polygon) {
    if (!isPointInRect(point, rect)) {
      return false;
    }
  }
  return true;
};

/**
 * 判断多边形和矩形是否有重叠部分
 * @param polygon
 * @param rect
 * @returns
 */
export const isPolygonIntersectRect = (polygon: vec2[], rect: IRect) => {
  const edges: [vec2, vec2][] = [
    [
      [rect[0], rect[1]],
      [rect[2], rect[1]],
    ],
    [
      [rect[2], rect[1]],
      [rect[2], rect[3]],
    ],
    [
      [rect[2], rect[3]],
      [rect[0], rect[3]],
    ],
    [
      [rect[0], rect[3]],
      [rect[0], rect[1]],
    ],
  ];

  // 检查矩形的每条边与多边形的边是否相交
  for (const [p1, p2] of edges) {
    for (let i = 0; i < polygon.length; i++) {
      const p3 = polygon[i];
      const p4 = polygon[(i + 1) % polygon.length];
      if (isLinesIntersect(p1, p2, p3, p4)) {
        return true;
      }
    }
  }

  // 检查多边形的顶点是否在矩形内
  for (const point of polygon) {
    if (isPointInRect(point, rect)) {
      return true;
    }
  }

  // 检查矩形的顶点是否在多边形内
  const points: vec2[] = [
    [rect[0], rect[1]],
    [rect[2], rect[1]],
    [rect[2], rect[3]],
    [rect[0], rect[3]],
  ];
  for (const point of points) {
    if (isPointInPolygon(point, polygon)) {
      return true;
    }
  }

  return false;
};


/**
 * 检查包围框A是否完全包含包围框B
 * @param {Object} rectA - 包含x, y, w, h的对象，表示矩形A
 * @param {Object} rectB - 包含x, y, w, h的对象，表示矩形B
 * @returns {boolean} - 如果矩形A完全包含矩形B，则返回true，否则返回false
 */
export function isRectCompletelyContained(rectA: XYWH, rectB: XYWH) {
  // 确保矩形A的边界完全包含矩形B的边界
  return (
    rectA.x < rectB.x &&
    rectA.y < rectB.y &&
    rectA.x + rectA.w > rectB.x + rectB.w &&
    rectA.y + rectA.h > rectB.y + rectB.h
  );
}

/**
 * 判断两个矩形是否相交
 * @param {Object} rectA - 包含x, y, w, h的对象，表示矩形A
 * @param {Object} rectB - 包含x, y, w, h的对象，表示矩形B
 * @returns {boolean} - 如果两个矩形相交，返回true；否则返回false
 */
export function isRectanglesIntersect(rectA: XYWH, rectB: XYWH) {
  return rectA.x + rectA.w > rectB.x && rectA.x < rectB.x + rectB.w && rectA.y + rectA.h > rectB.y && rectA.y < rectB.y + rectB.h;
}


/**
 * 计算两个矩形的相交区域
 * @param {Object} rectA - 包含x, y, w, h的对象，表示矩形A
 * @param {Object} rectB - 包含x, y, w, h的对象，表示矩形B
 * @returns {Object|null} - 如果有相交区域，返回包含x, y, w, h的对象；否则返回null
 */
export function getIntersectionRect(rectA: XYWH, rectB: XYWH): XYWH | null {
  // 计算相交区域的边界
  const x1 = Math.max(rectA.x, rectB.x);
  const y1 = Math.max(rectA.y, rectB.y);
  const x2 = Math.min(rectA.x + rectA.w, rectB.x + rectB.w);
  const y2 = Math.min(rectA.y + rectA.h, rectB.y + rectB.h);

  // 如果没有相交区域，返回 null
  if (x1 >= x2 || y1 >= y2) {
    return null;
  }

  // 返回相交区域的坐标和宽高
  return {
    x: x1,
    y: y1,
    w: x2 - x1,
    h: y2 - y1
  };
}


/**
 * 判断两个包围盒是否等大小
 * @param {Object} rectA - 包含x, y, w, h的对象，表示矩形A
 * @param {Object} rectB - 包含x, y, w, h的对象，表示矩形B
 * @returns {boolean} - true / false
 */
export function isEqualRectangles(rectA: XYWH, rectB: XYWH): boolean {
  return rectA.x === rectB.x &&
    rectA.y === rectB.y &&
    rectA.w === rectB.w &&
    rectA.h === rectB.h;
}
