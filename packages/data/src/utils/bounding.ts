import type { XYWH } from '@zhgu/type';

interface IBox {
  absoluteAABB: XYWH;
}

/**
 * 获取最大包围盒
 */
export function getMaxAABB(boxes: IBox[]) {
  if (boxes.length === 1) {
    return { ...boxes[0].absoluteAABB };
  }

  const maxPosition: [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity];

  boxes.forEach(box => {
    if (!box) {
      return;
    }

    updateMaxPosition(maxPosition, box.absoluteAABB);
  });

  return {
    x: maxPosition[0],
    y: maxPosition[1],
    w: maxPosition[2] - maxPosition[0],
    h: maxPosition[3] - maxPosition[1],
  };
}

// 直接更新现有数组，避免大量 GC
function updateMaxPosition(position: [number, number, number, number], { x, y, w, h }: XYWH) {
  position[0] = Math.min(position[0], x);
  position[1] = Math.min(position[1], y);
  position[2] = Math.max(position[2], x + w);
  position[3] = Math.max(position[3], y + h);
}
