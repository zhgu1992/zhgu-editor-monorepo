import type { Paint } from './Paint.ts';

enum EStrokeCap {
  None = 'NONE',
  Round = 'ROUND',
  Square = 'SQUARE',
  ArrowLines = 'ARROW_LINES',
  ArrowEquilateral = 'ARROW_EQUILATERAL',
  Highlight = 'HIGHLIGHT',
  CircleFilled = 'CIRCLE_FILLED',
  CircleStrokes = 'CIRCLE_STROKES',
  SquareStrokes = 'SQUARE_STROKES',
  SquareFilled = 'SQUARE_FILLED',
  VerticalityLines = 'VERTICALITY_LINES',
}

enum EStrokeAlign {
  CENTER = 'CENTER',
  INSIDE = 'INSIDE',
  OUTSIDE = 'OUTSIDE',
}

enum EStrokeJoin {
  Miter = 'MITER',
  Bevel = 'BEVEL',
  Round = 'ROUND',
}

type StrokePaints = Paint[];

interface IStrokeBaseProps {
  /**
   * 定义绘制线条的粗细，类型为数字。
   * @type {number | undefined}
   */
  strokeWeight: number;

  /**
   * 定义绘制线条的对齐方式。
   * 可选值有：居中 (CENTER)、内部 (INSIDE)、外部 (OUTSIDE)。
   * @type {EStrokeAlign | undefined}
   */
  strokeAlign: EStrokeAlign;

  /**
   * 定义绘制线条的连接方式。
   * 可选值有：斜接 (MITER)、斜切 (BEVEL)、圆角 (ROUND)。
   * @type {EStrokeJoin | undefined}
   */
  strokeJoin?: EStrokeJoin;

  /**
   * 虚线样式
   * @type {number[] | undefined}
   */
  dashPattern?: number[];

  /**
   * 线段端点类型
   * @type {EStrokeCap | undefined}
   */
  strokeCap?: EStrokeCap;

  /**
   * 定义边框的顶部粗细，类型为数字。
   * @type {number | undefined}
   */
  borderTopWeight?: number;

  /**
   * 定义边框的底部粗细，类型为数字。
   * @type {number | undefined}
   */
  borderBottomWeight?: number;

  /**
   * 定义边框的左侧粗细，类型为数字。
   * @type {number | undefined}
   */
  borderLeftWeight?: number;

  /**
   * 定义边框的右侧粗细，类型为数字。
   * @type {number | undefined}
   */
  borderRightWeight?: number;

  /**
   * 是否开启单描边
   * @type {boolean}
   */
  borderStrokeWeightsIndependent?: boolean;

  // /**
  //  * 定义斜接连接的限制比例，类型为数字。
  //  * 即时设计暂时不支持这个功能，先注释
  //  * @type {number | undefined}
  //  */
  strokeMiterLimit?: number;
}

interface IStrokePaintsProps {
  strokePaints: StrokePaints;
}

interface IStrokeProps extends IStrokeBaseProps, IStrokePaintsProps {}

export { EStrokeCap, EStrokeAlign, EStrokeJoin, IStrokeProps, IStrokePaintsProps, IStrokeBaseProps, StrokePaints };
