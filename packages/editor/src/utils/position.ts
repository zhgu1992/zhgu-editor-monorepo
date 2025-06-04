import type { XYPos, XYWH } from '@zhgu/type';
// import { getAngleByRotate, getDistance } from '@zhgu/data';
import { mat3 } from 'gl-matrix';

// /**
//  * 处理45度角拖拽
//  * @param centerPos 中心点
//  * @param currentPagePoint 当前屏幕点
//  * @returns
//  */
// export function handle45DegreeAngle(centerPos: XYPos, currentPagePoint: XYPos) {
//   const rotation = 360 - getAngleByRotate(centerPos, currentPagePoint);
//   const absorbDeg = Math.round(rotation / 45) * 45;
//   const distance = getDistance(centerPos.x - currentPagePoint.x, centerPos.y - currentPagePoint.y);
//   return {
//     x: centerPos.x + Math.cos(absorbDeg / 180 * Math.PI) * distance,
//     y: centerPos.y + Math.sin(absorbDeg / 180 * Math.PI) * distance,
//   };
// }

/**
 * 处理水平或垂直拖拽
 * @param centerPos 中心点
 * @param currentPagePoint 当前屏幕点
 */
export function handleHorizontalOrVertical(centerPos: XYPos, currentPagePoint: XYPos, originPagePoint: XYPos) {
  const deltaX = currentPagePoint.x - centerPos.x;
  const deltaY = currentPagePoint.y - centerPos.y;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // jsdEditor.setCursorType('cursor-horizontal-move');
    return { x: currentPagePoint.x, y: originPagePoint.y };
  } else {
    // jsdEditor.setCursorType('cursor-vertical-move');
    return { x: originPagePoint.x, y: currentPagePoint.y };
  };
};

/**
 * 通过传入boxXYWH以及固定位置得到宽高比相等结果
 * @param box
 * @param fixedPos
 */
export function handleEqualInAspectRatio(box: XYWH, fixedPos: XYPos) {
  const { x, y, w, h } = box;
  const isEqualX = x === fixedPos.x;
  const isEqualY = y === fixedPos.y;
  const maxVal = Math.max(w, h);
  const resX = w === maxVal ? x : x + w - maxVal;
  const resY = h === maxVal ? y : y + h - maxVal;

  // 以固定位置为原点，判断box的象限
  switch(true) {
    // 第一象限
    case isEqualX && !isEqualY: {
      return { x, y: resY, w: maxVal, h: maxVal };
    }
    // 第二象限
    case !isEqualX && !isEqualY: {
      return { x: resX, y: resY, w: maxVal, h: maxVal};
    }
    // 第三象限
    case !isEqualX && isEqualY: {
      return { x: resX, y, w: maxVal, h: maxVal};
    }
    // 第四象限
    case isEqualX && isEqualY: {
      return { x, y, w: maxVal, h: maxVal };
    }
  }

  return box;
}


/**
 * 通过传入boxXYWH以及中心位置得到从中心调整大小结果
 * @param box
 * @param centerPos
 */
export function handleResizingFromCenter(box: XYWH, centerPos: XYPos) {
  const { x, y, w, h } = box;
  const isEqualX = x === centerPos.x;
  const isEqualY = y === centerPos.y;

  // 以固定位置为原点，判断box的象限
  switch(true) {
    // 第一象限
    case isEqualX && !isEqualY: {
      return { x: x - w, y, w: w * 2, h: h * 2 };
    }
    // 第二象限
    case !isEqualX && !isEqualY: {
      return { x, y, w: w * 2, h: h * 2};
    }
    // 第三象限
    case !isEqualX && isEqualY: {
      return { x, y: y - h, w: w * 2, h: h * 2};
    }
    // 第四象限
    case isEqualX && isEqualY: {
      return { x: x - w, y: y - h, w: w * 2, h: h * 2 };
    }
  }

  return box;
}

/**
 * 通过两个位置信息，获取Box信息
 * @param pos1
 * @param pos2
 * @returns
 */
export function getBoundingByPos(pos1: XYPos, pos2: XYPos) {
  const minX = Math.min(pos1.x, pos2.x);
  const minY = Math.min(pos1.y, pos2.y);

  const w = Math.abs(pos1.x - pos2.x);
  const h = Math.abs(pos1.y - pos2.y);

  return {
    x: minX,
    y: minY,
    w,
    h
  };
}

/**
 * 通过节点中顶点坐标的绝对位置
 * @param vertex
 * @param at
 * @returns
 */
export function getVertexAtPosByNodeAt(vertexPos: XYPos, nodeAt: mat3) {
  const rt = mat3.fromValues(1, 0, 0, 0, 1, 0, vertexPos.x, vertexPos.y, 1);
  const at = mat3.mul(mat3.create(), nodeAt, rt);
  return { x: at[6], y: at[7] };
}

/**
 * 通过节点中顶点坐标的绝对位置，获取顶点在节点坐标系中的位置
 * @param vertexPos 顶点坐标
 * @param nodeAt 节点坐标系
 * @returns
 */
export function getVertexRtPosByNodeInvAt(vertexPos: XYPos, nodeInvAt: mat3) {
  const at = mat3.fromValues(1, 0, 0, 0, 1, 0, vertexPos.x, vertexPos.y, 1);
  const rt = mat3.mul(mat3.create(), nodeInvAt, at);
  return { x: rt[6], y: rt[7] };
}
