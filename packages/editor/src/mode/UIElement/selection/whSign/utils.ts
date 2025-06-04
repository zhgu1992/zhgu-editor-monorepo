import type { IBaseNode, ICollection } from '../../../../interface';
import { getTwoDecimal } from '@zhgu/data';
import { vec2, mat3 } from 'gl-matrix';

export function calcWHSignTranslate(containerNode: ICollection) {
  const { apoints } = containerNode;
  //y 值最小的 point
  const { minYPoint, minYPointIndex } = apoints.reduce(
    (acc, cur, index) => {
      if (cur[1] < acc.minYPoint[1]) {
        return { minYPoint: cur, minYPointIndex: index };
      }
      return acc;
    },
    { minYPoint: vec2.fromValues(Infinity, Infinity), minYPointIndex: -1 } // 初始值
  );
  // 两个邻居 point
  const nearPoints = [apoints[(minYPointIndex + 1) % 4], apoints[(minYPointIndex + 3) % 4]];
  // 通过 x 坐标排序，确定左点 (lpt) 和右点 (rpt)
  const [lpt, rpt] = nearPoints.sort((a, b) => a[0] - b[0]);
  // 获取对角点
  const dpt = apoints[(minYPointIndex + 2) % 4];
  // 比斜率

  // 计算点与 minYPoint 的夹角
  const calculateAngle = (point: vec2) =>
    (vec2.angle([0, 1], vec2.fromValues(point[0] - minYPoint[0], point[1] - minYPoint[1])) * 180) / Math.PI;

  // 计算左右点的角度
  const angleLeft = calculateAngle(lpt);
  const angleRight = calculateAngle(rpt);

  // 初始化 textPos 和 rotation
  let textPos = lpt;
  let rotation = 90 - angleRight;
  let d = Math.hypot(rpt[0] - minYPoint[0], rpt[1] - minYPoint[1]);

  // 根据角度比较调整 textPos 和 rotation
  if (angleLeft > angleRight) {
    d = Math.hypot(lpt[0] - minYPoint[0], lpt[1] - minYPoint[1]);
    if (lpt[0] - minYPoint[0] < 0) {
      textPos = dpt;
      rotation = -(90 - angleLeft);
    } else {
      rotation = 90 - angleLeft;
    }
  } else if (rpt[0] - minYPoint[0] < 0) {
    textPos = minYPoint;
    rotation = -(90 - angleRight);
  }
  const rMat = mat3.fromRotation(mat3.create(), (rotation * Math.PI) / 180);
  const at = mat3.mul(mat3.create(), mat3.fromTranslation(mat3.create(), textPos), rMat);
  return { at, d };
}

export function drawSvgPath(
  cxt: OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  multiple: number
): void {
  // 保存上下文状态
  cxt.save();

  // 将画布原点移动到指定位置
  cxt.translate(x, y);
  cxt.strokeStyle = '#ffffff'; // 设置线条颜色
  cxt.lineWidth = 0.5 * multiple; // 设置线条宽度

  // 定义比例值，便于复用
  const p1 = 1.2 * multiple;
  const p2 = 1.6 * multiple;
  const p3 = 6.4 * multiple;
  const p4 = 6.8 * multiple;

  // 绘制第一条路径（菱形）
  drawPath(cxt, [
    [p1, p2],
    [p2, p1],
    [p4, p3],
    [p3, p4],
    [p1, p2],
  ]);

  // 绘制第二条路径（反向菱形）
  drawPath(cxt, [
    [p3, p1],
    [p4, p2],
    [p2, p4],
    [p1, p3],
    [p3, p1],
  ]);

  // 恢复上下文状态
  cxt.restore();
}

// 辅助函数：绘制路径
function drawPath(
  cxt: OffscreenCanvasRenderingContext2D,
  points: [number, number][]
): void {
  cxt.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) {
      cxt.moveTo(x, y); // 移动到起点
    } else {
      cxt.lineTo(x, y); // 连接到下一个点
    }
  });
  cxt.stroke(); // 绘制路径
  cxt.closePath(); // 关闭路径
}


export function getSignText(node: IBaseNode | ICollection, direction: string) {
  let {
    w,
    h,
  } = node as IBaseNode;
  return `${getTwoDecimal(direction === 'hori' ? w : h)}`;
}

export function fillRoundRect(
  cxt: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillColor?: string,
): boolean {
  if (2 * radius > width || 2 * radius > height) {
    return false;
  }
  cxt.save();
  cxt.translate(x, y);
  drawRoundRectPath(cxt, width, height, radius);
  cxt.fillStyle = fillColor || '#000';
  cxt.fill();
  cxt.restore();
  return true;
}

export function drawRoundRectPath(
  cxt: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  radius: number,
): void {
  // 确保 radius 不超过宽高的一半
  radius = Math.min(radius, width / 2, height / 2);

  // 定义常量，避免重复计算
  const PI = Math.PI;
  const PI_2 = PI / 2;
  const PI_3_2 = (PI * 3) / 2;

  // 开始绘制路径
  cxt.beginPath();

  // 定义辅助函数，绘制圆角
  const drawCorner = (
    cx: number,
    cy: number,
    startAngle: number,
    endAngle: number,
  ) => {
    cxt.arc(cx, cy, radius, startAngle, endAngle);
  };

  // 绘制右下角圆角
  drawCorner(width - radius, height - radius, 0, PI_2);

  // 绘制底边
  cxt.lineTo(radius, height);

  // 绘制左下角圆角
  drawCorner(radius, height - radius, PI_2, PI);

  // 绘制左边
  cxt.lineTo(0, radius);

  // 绘制左上角圆角
  drawCorner(radius, radius, PI, PI_3_2);

  // 绘制顶部
  cxt.lineTo(width - radius, 0);

  // 绘制右上角圆角
  drawCorner(width - radius, radius, PI_3_2, 2 * PI);

  // 绘制右边
  cxt.lineTo(width, height - radius);

  // 闭合路径
  cxt.closePath();
}

export const canvasConfig = {
  top: 10,
  height: 12,
  fontSize: 12,
  lineHeight: 12,
  fontFamily: getComputedStyle(document.body).fontFamily,
  fillStyle: '#ffffff',
  multiple: 4,
  fontWeight: '500',
  radius: 2,
  hPadding: 8,
  vPadding: 7,
  svgWidth: 8,
  wordGap: 2,
};