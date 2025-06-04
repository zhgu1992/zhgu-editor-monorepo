import type { RGBAColor } from '@zhgu/type';

const colorVals: {[key: string]: string} = {
  blue: '64, 128, 223',
  lineRed: '245, 100, 100',
  // 'elementBaseColor': '230, 230, 230',
  elementBaseColor: '204, 204, 204',
  white: '255, 255, 255',
  gray: '128, 128, 128',
  borderColor: '0, 0, 0',
  // 'symbolBlue': '93, 194, 255'
  symbolBlue: '89, 164, 255',
  distanceSize: '157, 122, 240',
  red: '255, 0, 0',
  canvasSymbolTip: '71, 184, 245',
  black: '0, 0, 0'
};
/**
 * [获取系统存入的一些基础颜色值]
 *
 * @export
 * @param {string} [type='blur'] 颜色的key
 * @param {string} [opacity='1'] 是否需要调整透明度
 * @returns {string} 返回rgbaStr
 */
export function getColor(type = 'blur', opacity = '1') {
  const baseColor = colorVals[type] || '255, 255, 255';

  return `rgba(${baseColor}, ${opacity})`;
}

/**
 * 随机生成RGBA
 * @returns
 */
export function getRandomRGBA() {
  const r = Math.floor(Math.random() * 256); // 随机生成红色分量 (0-255)
  const g = Math.floor(Math.random() * 256); // 随机生成绿色分量 (0-255)
  const b = Math.floor(Math.random() * 256); // 随机生成蓝色分量 (0-255)
  const a = Number(Math.random().toFixed(2)); // 随机生成透明度 (0-1)，保留两位小数

  return { r: r, g: g, b: b, a: a };
}

export const rgba2hex = ({ r, g, b }: RGBAColor) => {
  const fn = (v: number) => (v * 255).toString(16).padStart(2, '0').toUpperCase();
  return `${fn(r)}${fn(g)}${fn(b)}`;
};

export const rgba2css = ({ r, g, b, a }: RGBAColor) => {
  return `rgba(${r * 255},${g * 255},${b * 255},${a})`;
};

export const hex2rgba = (str: string, alpha?: number): RGBAColor => {
  const r = parseInt(str.slice(0, 2), 16);
  const g = parseInt(str.slice(2, 4), 16);
  const b = parseInt(str.slice(4, 6), 16);
  return { r, g, b, a: alpha ?? 1 };
};

/**
 * 计算给定 RGBA 颜色的 HSL 亮度值
 * @param r - 红色通道值 (0-255)
 * @param g - 绿色通道值 (0-255)
 * @param b - 蓝色通道值 (0-255)
 * @param a - 透明度 (0-1), 默认为 1
 * @returns HSL 亮度值 (0-1)
 */
export function getHSLLightness(r: number, g: number, b: number): number {
  // 将 RGB 值归一化到 0-1 范围
  const normalizedR = r / 255;
  const normalizedG = g / 255;
  const normalizedB = b / 255;

  // 找出最大和最小的 RGB 分量
  const cmax = Math.max(normalizedR, normalizedG, normalizedB);
  const cmin = Math.min(normalizedR, normalizedG, normalizedB);

  // 计算亮度 L
  const lightness = (cmax + cmin) / 2;

  // 确保亮度值在 0-1 范围内
  if (lightness < 0 || lightness > 1) {
    throw new Error('亮度值应该在 0 到 1 之间');
  }

  return lightness;
}
