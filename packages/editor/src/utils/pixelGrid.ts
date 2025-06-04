/**
 * 根据指定的对齐间距将值与最近的像素网格对齐。
 * @param val
 * @param alignSpacings
 * @returns
 */
export function alignToGrid(val: number, alignSpacings: number) {
  return Math.round(val / alignSpacings) * alignSpacings;
}

// 为了保持向后兼容，保留原函数名
export const getFixPixelGridAlignmentVal = alignToGrid; 