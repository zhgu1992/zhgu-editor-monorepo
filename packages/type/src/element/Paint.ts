import type { EBlendMode } from './BlendMode.ts';
import type { RGBAColor, ColorStop } from './Color.ts';
import type { Transform } from './Transform.ts';

enum EPaintType {
  Solid = 'SOLID',
  GradientLinear = 'GRADIENT_LINEAR',
  GradientRadial = 'GRADIENT_RADIAL',
  GradientAngular = 'GRADIENT_ANGULAR',
  GradientDiamond = 'GRADIENT_DIAMOND',
  Image = 'IMAGE',
}

enum EImageScaleMode {
  STRETCH = 'STRETCH',
  FIT = 'FIT',
  FILL = 'FILL',
  TILE = 'TILE',
}

type GradientPaintType =
  | EPaintType.GradientLinear
  | EPaintType.GradientRadial
  | EPaintType.GradientAngular
  | EPaintType.GradientDiamond;

interface IPaintFilter {
  exposure?: number;
  contrast?: number;
  vibrance?: number;
  temperature?: number;
  tint?: number;
  hue?: number;
  highlights?: number;
  shadows?: number;
}

interface IPaintBaseProps {
  opacity: number;
  isEnabled: boolean;
  blendMode: EBlendMode;
}

interface ISolidPaintProps extends IPaintBaseProps {
  type: EPaintType.Solid;
  color: RGBAColor;
}

interface IGradientPaintProps extends IPaintBaseProps {
  type: GradientPaintType;
  stops: ColorStop[];
  transform: Transform;
}

interface IImageCrop {
  x: number;
  y: number;
  w: number;
  h: number;
  deg: number;
  rotation: number;
}

interface IImagePaintProps extends IPaintBaseProps {
  type: EPaintType.Image;
  transform?: Transform;
  imageId: string;
  imageUrl: string;
  image?: any;
  imageScaleMode: EImageScaleMode;
  rotation: number;
  scale: number;
  paintFilter?: IPaintFilter;
  imageCrop?: IImageCrop;
}

type Paint = ISolidPaintProps | IGradientPaintProps | IImagePaintProps;

type FillPaints = Paint[];

interface IPaintProps {
  fillPaints: FillPaints;
}

export {
  EPaintType,
  EImageScaleMode,
  GradientPaintType,
  IPaintFilter,
  IPaintBaseProps,
  ISolidPaintProps,
  IGradientPaintProps,
  IImageCrop,
  IImagePaintProps,
  FillPaints,
  IPaintProps,
  Paint,
};
