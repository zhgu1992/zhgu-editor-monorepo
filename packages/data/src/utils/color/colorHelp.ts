// 从 JsColor 复制过来，后续整理
// src/editor-core/jsd-render/src/core/JsColor.ts
import isObject from 'lodash-es/isObject';

const REG_HEX = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/;
const REG_RGB = /^rgb\(([\d.]+),([\d.]+),([\d.]+)\)$/;
const REG_RGBA = /^rgba\(([\d.]+),([\d.]+),([\d.]+),([\d.]+)\)$/;
interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * 颜色
 */
export class JsColor {

  protected _data: Float32Array;

  get data(): Readonly<Float32Array> {
    return this._data;
  }

  constructor() {
    this._data = new Float32Array([0, 0, 0, 1]);
  }

  set(str: string): JsColor;
  set(arr: number[]): JsColor;
  set(colorObj: Color): JsColor;
  set(args: string | number[] | Color): JsColor {
    const d = this.reset()._data;
    if (typeof args === 'string') {
      const str = args.replace(/\s/g, '').toLowerCase();
      if (REG_HEX.test(str)) {
        switch(str.length) {
          case 4:
            d[0] = parseInt(str.slice(1, 2).repeat(2), 16) / 255.0;
            d[1] = parseInt(str.slice(2, 3).repeat(2), 16) / 255.0;
            d[2] = parseInt(str.slice(3, 4).repeat(2), 16) / 255.0;
            break;
          case 5:
            d[0] = parseInt(str.slice(1, 2).repeat(2), 16) / 255.0;
            d[1] = parseInt(str.slice(2, 3).repeat(2), 16) / 255.0;
            d[2] = parseInt(str.slice(3, 4).repeat(2), 16) / 255.0;
            d[3] = parseInt(str.slice(4, 5).repeat(2), 16) / 255.0;
            break;
          case 7:
            d[0] = parseInt(str.slice(1, 3), 16) / 255.0;
            d[1] = parseInt(str.slice(3, 5), 16) / 255.0;
            d[2] = parseInt(str.slice(5, 7), 16) / 255.0;
            break;
          case 9:
            d[0] = parseInt(str.slice(1, 3), 16) / 255.0;
            d[1] = parseInt(str.slice(3, 5), 16) / 255.0;
            d[2] = parseInt(str.slice(5, 7), 16) / 255.0;
            d[3] = parseInt(str.slice(7, 9), 16) / 255.0;
            break;
        }
      } else if (REG_RGB.test(str)) {
        const match = REG_RGB.exec(str)!;
        d[0] = Number(match[1]) / 255.0;
        d[1] = Number(match[2]) / 255.0;
        d[2] = Number(match[3]) / 255.0;
      } else if (REG_RGBA.test(str)) {
        const match = REG_RGBA.exec(str)!;
        d[0] = Number(match[1]) / 255.0;
        d[1] = Number(match[2]) / 255.0;
        d[2] = Number(match[3]) / 255.0;
        d[3] = Number(match[4]);
      }
    } else if (Array.isArray(args)) {
      d[0] = args[0];
      d[1] = args[1];
      d[2] = args[2];
      if (args.length > 3) {
        d[3] = args[3];
      }
    } else if (isObject(args)) {
      d[0] = args.r;
      d[1] = args.g;
      d[2] = args.b;
      d[3] = args.a;
    }
    return this;
  }

  reset() {
    const d = this._data;
    d[0] = 0;
    d[1] = 0;
    d[2] = 0;
    d[3] = 1;
    return this;
  }

  toHex() {
    const [r, g, b, a] = this._data;
    const rr = Math.round(r * 255).toString(16).padStart(2, '0');
    const gg = Math.round(g * 255).toString(16).padStart(2, '0');
    const bb = Math.round(b * 255).toString(16).padStart(2, '0');
    const aa = Math.round(a * 255).toString(16).padStart(2, '0');
    return `#${rr}${gg}${bb}${aa}`;
  }

  toRGBA(): [r: number, g: number, b: number, a: number] {
    const [r, g, b, a] = this._data;
    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
      a,
    ];
  }

  toRGBAObject(): Color {
    const [r, g, b, a] = this._data;
    return {
      r, g, b, a
    };
  }
}
