export enum EBlendMode {
  Normal = 'NORMAL',
  PassThrough = 'PASS_THROUGH',
  Darken = 'DARKEN',
  Multiply = 'MULTIPLY',
  ColorBurn = 'COLOR_BURN',
  Lighten = 'LIGHTEN',
  Screen = 'SCREEN',
  ColorDodge = 'COLOR_DODGE',
  Overlay = 'OVERLAY',
  SoftLight = 'SOFT_LIGHT',
  HardLight = 'HARD_LIGHT',
  Difference = 'DIFFERENCE',
  Exclusion = 'EXCLUSION',
  Hue = 'HUE',
  Saturation = 'SATURATION',
  Color = 'COLOR',
  Luminosity = 'LUMINOSITY',
}

export interface IBlendProps {
  blendMode: EBlendMode.PassThrough;
  opacity: number;
}
