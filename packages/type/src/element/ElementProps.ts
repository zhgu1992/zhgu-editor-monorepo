import type { IBackgroundProps } from './Background.ts';
import type { IBlendProps } from './BlendMode.ts';
import type { IPaintProps } from './Paint.ts';
import type { IStrokeProps, IStrokePaintsProps } from './Stroke.ts';
import type { ISizeProps } from './Size.ts';
import type { ITransformProps } from './Transform.ts';
import type { IGuideProps } from './Guide.ts';
import type { ITreeToggleProps } from './TreeToggle.ts';
import type { EElementType } from './ElementType.ts';
import type { IParentIndexProps } from './ParentIndex.ts';
import type { IRectProps } from './Rect.ts';
import type { ICornerRadiusProps, IRectangleCornerRadiusProps } from './CornerRadius.ts';

export interface INamedProps {
  name: string;
}

// base:
interface IHasGeometryProps extends IBlendProps, IPaintProps, IStrokeProps, IStrokePaintsProps {}
interface IElementBaseProps extends IParentIndexProps, INamedProps {}
interface ITransformSizeProps extends ITransformProps, ISizeProps {}

interface IDocumentElementProps extends INamedProps {
  documentColorProfile: string;
}

interface IPageElementProps extends IElementBaseProps, ITransformSizeProps, IBackgroundProps, IGuideProps {}

interface ISceneElementBaseProps extends IElementBaseProps, ITreeToggleProps, ITransformSizeProps {}

type IGroupElementProps = IElementBaseProps;

interface IShapeElementProps extends ISceneElementBaseProps, IHasGeometryProps {}

interface IRectangleElementProps extends IShapeElementProps, IRectangleCornerRadiusProps {}

interface IFrameElementProps extends ISceneElementBaseProps, IHasGeometryProps, IGuideProps {
  clipContent: boolean;
}

interface ISectionElementProps
  extends ISceneElementBaseProps,
    IHasGeometryProps,
    ICornerRadiusProps,
    IRectangleCornerRadiusProps {}

type IDerivedDataProps = ITransformProps & ISizeProps;

interface IVectorBaseProps extends ISceneElementBaseProps, IHasGeometryProps {}

interface IRectElementProps extends IVectorBaseProps, IRectProps {}

type IAllElementProps = IDocumentElementProps &
  IPageElementProps &
  IGroupElementProps &
  IRectangleElementProps &
  IFrameElementProps;

type IElementProps = Partial<IAllElementProps> & IElementBaseProps & { type: EElementType };

type IElementPropsWithoutType = Partial<IAllElementProps>;

export {
  IHasGeometryProps,
  IElementBaseProps,
  ISectionElementProps,
  IFrameElementProps,
  IDerivedDataProps,
  IRectangleElementProps,
  IShapeElementProps,
  IGroupElementProps,
  ISceneElementBaseProps,
  IDocumentElementProps,
  IPageElementProps,
  IAllElementProps,
  IRectElementProps,
  IElementProps,
  IElementPropsWithoutType,
};
