
const edgeRange = [15, 5]; // 距离边缘15px匀加速至5px，距离边缘<=5px速度最大并匀速更新viewport
const speedRange = [0.1, 1]; // px/ms，表示15px-100px/s,5px-1000px/s
const [maxDis, minDis] = edgeRange;
const [minSp, maxSp] = speedRange;

/**
 * [边缘速度获取]
 *
 * @param {number} distance 距离边缘距离
 * @returns {number} 速度
 */
export function getSpeed(distance: number) {
  if (distance > maxDis) {
    return 0;
  }
  if (distance <= minDis) {
    return maxSp;
  }
  const ratio = (maxDis- distance) / (maxDis - minDis);
  return (maxSp - minSp) * ratio + minSp;
}

