
/**
 * 根据指定的对齐间距将值与最近的像素网格对齐。
 * @param val
 * @param alignSpacings
 * @returns
 */
export function getFixPixelGridAlignmentVal(val: number, alignSpacings: number) {
  return Math.round(val / alignSpacings) * alignSpacings;
}