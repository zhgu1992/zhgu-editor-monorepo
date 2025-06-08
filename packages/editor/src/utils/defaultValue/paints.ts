import type { FillPaints, IElementPropsWithoutType, RGBAColor, StrokePaints } from '@zhgu/type';
import { EBlendMode, EPaintType, ESceneElementType, EStrokeAlign } from '@zhgu/type';
import { getHSLLightness, hex2rgba } from '@zhgu/data';
import type { View } from '../../view';

/**
 * 获取初始渐变颜色
 * @param color
 * @returns
 */
function getLinearPaints(): FillPaints {
  return [
    {
      type: EPaintType.GradientLinear,
      stops: [
        { position: 0, color: { r: 255, g: 255, b: 255, a: 1 } },
        { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
      ],
      transform: {
        m00: 1,
        m01: 0,
        m02: 0,
        m10: 0,
        m11: 1,
        m12: 0,
      },
      opacity: 1,
      isEnabled: true,
      blendMode: EBlendMode.Normal,
    },
  ];
}

/**
 * 获取初始填充颜色
 * @param color
 * @returns
 */
function getFillPaints(color: RGBAColor): FillPaints {
  return [
    {
      type: EPaintType.Solid,
      color: color,
      opacity: 1,
      isEnabled: true,
      blendMode: EBlendMode.Normal,
    },
  ];
}

/**
 * 获取初始描边颜色
 * @param color
 * @returns
 */
export function getStrokePaints(color: RGBAColor): StrokePaints {
  return [
    {
      type: EPaintType.Solid,
      color: color,
      opacity: 1,
      isEnabled: true,
      blendMode: EBlendMode.Normal,
    },
  ];
}

/**
 * 获取所有类型的基础样式
 * @param type
 * @returns
 */
export function getDefaultStyle(type: ESceneElementType, view: View): Partial<IElementPropsWithoutType> {
  switch (type) {
    case ESceneElementType.Section: {
      const { r, g, b, a } = view.scene.currentPage.backgroundColor;
      const lightness = getHSLLightness(r, g, b);
      const isLight = lightness > 0.62;
      const zoom = view.viewPort!.zoom;

      const size = {
        w: 512,
        h: 512,
      };
      if (zoom > 1.5) {
        const height = view.viewPort!.canvasViewBox.h;
        const max = Math.max(Math.floor(height), 16);
        size.w = max;
        size.h = max;
      }
      return {
        ...size,
        fillPaints: getFillPaints(isLight ? { r: 237, g: 237, b: 237, a: 1 } : { r: 51, g: 51, b: 51, a: 1 }),
        strokeWeight: 1,
        strokeAlign: EStrokeAlign.INSIDE,
        strokePaints: [
          {
            type: EPaintType.Solid,
            color: isLight ? { r: 0, g: 0, b: 0, a: 1 } : { r: 255, g: 255, b: 255, a: 1 },
            opacity: isLight ? 0.13 : 0.25,
            isEnabled: true,
            blendMode: EBlendMode.Normal,
          },
        ],
        // @ts-ignore 暂时不处理
        cornerRadius: 4,
        blendMode: EBlendMode.PassThrough,
      };
    }
    case ESceneElementType.Frame: {
      return {
        fillPaints: getFillPaints(hex2rgba('FFFFFF')),
        blendMode: EBlendMode.PassThrough,
      };
    }
    case ESceneElementType.RichText: {
      return {};
    }
    case ESceneElementType.Arrow: {
      return { strokeWeight: 2, blendMode: EBlendMode.PassThrough };
    }
    case ESceneElementType.Line: {
      return { strokePaints: getStrokePaints(hex2rgba('000000')), blendMode: EBlendMode.PassThrough };
    }
    case ESceneElementType.Vector: {
      return { strokePaints: getStrokePaints(hex2rgba('000000')), blendMode: EBlendMode.PassThrough };
    }
    default: {
      const fillPaints = getFillPaints(hex2rgba('D9D9D9'));
      return { fillPaints };
    }
  }
}
