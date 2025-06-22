import type {
  EElementType,
  IDocumentElement,
  IFrameElement,
  ISectionElement,
  IGroupElement,
  IPageElement,
  IInternalPageElement,
  IRectangleElement,
  IElementPropsWithoutType,
  IDocumentOrElement,
  ITransformProps,
  ITreeToggleProps,
  IPaintProps,
  FillPaints,
  Paint,
  IParentIndexProps,
  ParentIndex as ParentIndexType,
  ChangeRecipe,
  INamedProps,
  IStrokeBaseProps,
  IStrokePaintsProps,
  IStrokeProps,
  IGuideProps,
  IBlendProps,
  ICornerRadiusProps,
  IRectangleCornerRadiusProps,
  ISizeProps,
  IBackgroundProps,
} from '@zhgu/type';
import {
  ERootElementType,
  EOtherElementType,
  ESceneElementType,
  EBlendMode,
  EPaintType,
  EImageScaleMode,
  EStrokeAlign,
  EStrokeJoin,
} from '@zhgu/type';
import { isNullOrUndefined } from '../utils';
import { create } from 'mutative';

//----ElementData----
export class ElementData {
  private _element: IDocumentOrElement;
  constructor(elementData: IDocumentOrElement) {
    this._element = elementData;
  }
  get element() {
    return this._element;
  }
  updateElement(element: IDocumentOrElement) {
    this._element = element;
  }
  get type() {
    return this._element.type;
  }
  get id(): string {
    return this._element.id;
  }
}

export class shapeElement extends ElementData {}

//----Transform----
namespace TransformProps {
  export const getDefaultProps = (): ITransformProps => ({
    transform: {
      m00: 1,
      m01: 0,
      m02: 0,
      m10: 0,
      m11: 1,
      m12: 0,
    },
  });

  export const keys = ['transform'];
}

export { TransformProps };

//----TreeToggle----
namespace TreeToggleProps {
  export const getDefaultProps = (): ITreeToggleProps => ({
    isVisible: true,
    isLocked: false,
  });

  export const keys = ['isVisible', 'isLocked'];
}

export { TreeToggleProps };

//----Paint----
namespace PaintProps {
  export const getDefaultSolidPaintProps = (): IPaintProps => ({
    fillPaints: [
      {
        type: EPaintType.Solid,
        opacity: 1,
        isEnabled: true,
        blendMode: EBlendMode.Normal,
        color: { r: 217, g: 217, b: 217, a: 1 },
      },
    ],
  });

  export const getDefaultImagePaintProps = (): IPaintProps => ({
    fillPaints: [
      {
        type: EPaintType.Image,
        opacity: 1,
        isEnabled: true,
        blendMode: EBlendMode.Normal,
        imageId: '',
        imageUrl: '',
        imageScaleMode: EImageScaleMode.FILL,
        rotation: 0,
        scale: 0.5,
      },
    ],
  });

  export const changeFillPaint = (fillPaints: FillPaints, fillPaint: Paint, index: number) => {
    const newFillPaints = ([] as FillPaints).concat(fillPaints);
    newFillPaints[index] = fillPaint;
    return newFillPaints;
  };

  export const addFillPaint = (fillPaints: FillPaints, fillPaint: Paint, index?: number) => {
    const newFillPaints = ([] as FillPaints).concat(fillPaints);
    if (isNullOrUndefined(index)) {
      newFillPaints.push(fillPaint);
    } else {
      newFillPaints.splice(index!, 0, fillPaint);
    }
    return newFillPaints;
  };

  export const removeFillPaint = (fillPaints: FillPaints, index: number) => {
    const newFillPaints = ([] as FillPaints).concat(fillPaints);
    newFillPaints.splice(index, 1);
    return newFillPaints;
  };
}

export { PaintProps };

//----ParentIndex----
namespace ParentIndex {
  export const getDefaultProps = (): IParentIndexProps => ({
    parentIndex: {
      id: '',
      position: '',
    },
  });

  export const changeParentIndex = (parentIndex: ParentIndexType, changeRecipe: ChangeRecipe<ParentIndexType>) => {
    const newParentIndex = create(parentIndex, changeRecipe);
    return newParentIndex;
  };
}

export { ParentIndex };

//----Name----
namespace NamedProps {
  export const getDefaultProps = (): INamedProps => ({
    name: '',
  });
}

export { NamedProps };

//----Stroke----
namespace StrokeProps {
  export const getDefaultProps = (): IStrokeProps => ({
    ...defaultBaseProps(),
    ...defaultPaintsProps(),
  });

  export const defaultPaintsProps = (): IStrokePaintsProps => ({
    strokePaints: [],
  });

  export const defaultBaseProps = (): IStrokeBaseProps => ({
    strokeWeight: 1,
    strokeAlign: EStrokeAlign.INSIDE,
    strokeJoin: EStrokeJoin.Miter,
  });

  export const getDefaultPropsBySection = (): IStrokeProps => ({
    strokePaints: [
      {
        type: EPaintType.Solid,
        opacity: 0.13,
        isEnabled: true,
        blendMode: EBlendMode.Normal,
        color: { r: 0, g: 0, b: 0, a: 1 },
      },
    ],
    ...defaultBaseProps(),
  });
}

export { StrokeProps };

//----Guide----
namespace GuideProps {
  export const getDefaultProps = (): IGuideProps => ({
    guide: [],
  });
}

export { GuideProps };

//----BlendMode----
namespace BlendProps {
  export const getDefaultProps = (): IBlendProps => ({
    blendMode: EBlendMode.PassThrough,
    opacity: 1,
  });
}

export { BlendProps };

//----CornerRadius----
namespace CornerRadiusProps {
  export const getDefaultProps = (): ICornerRadiusProps => ({
    cornerRadius: 2,
  });
}

namespace RectangleCornerRadiusProps {
  export const getDefaultProps = (): IRectangleCornerRadiusProps => ({
    rectangleBottomLeftCornerRadius: 4,
    rectangleBottomRightCornerRadius: 4,
    rectangleTopLeftCornerRadius: 4,
    rectangleTopRightCornerRadius: 4,
    rectangleCornerRadiiIndependent: false,
  });
}

export { CornerRadiusProps, RectangleCornerRadiusProps };

//----Size----
namespace SizeProps {
  export const getDefaultProps = (): ISizeProps => ({
    w: 100,
    h: 100,
  });

  export const keys = ['w', 'h'];
}

export { SizeProps };

//----Background----
namespace BackgroundProps {
  export const getDefaultProps = (): IBackgroundProps => ({
    backgroundColor: {
      r: 145,
      g: 145,
      b: 145,
      a: 1,
    },
    backgroundEnabled: true,
  });
}

export { BackgroundProps };

//----creatorUtils----
const createElementInner = (elementType: EElementType): IDocumentOrElement => {
  switch (elementType) {
    case ERootElementType.Document: {
      const document: IDocumentElement = {
        id: '',
        type: ERootElementType.Document,
        name: 'Document',
        documentColorProfile: 'SRGB',
      };
      return document;
    }
    case EOtherElementType.Page: {
      const page: IPageElement = {
        id: '',
        type: EOtherElementType.Page,
        name: 'Page',
        ...GuideProps.getDefaultProps(),
        ...SizeProps.getDefaultProps(),
        ...TransformProps.getDefaultProps(),
        ...ParentIndex.getDefaultProps(),
        ...BackgroundProps.getDefaultProps(),
      };
      return page;
    }
    case EOtherElementType.InternalPage: {
      const page: IInternalPageElement = {
        id: '',
        type: EOtherElementType.InternalPage,
        name: 'Internal Only Page',
        ...GuideProps.getDefaultProps(),
        ...SizeProps.getDefaultProps(),
        ...TransformProps.getDefaultProps(),
        ...ParentIndex.getDefaultProps(),
        ...BackgroundProps.getDefaultProps(),
      };
      return page;
    }
    case ESceneElementType.Frame: {
      const frame: IFrameElement = {
        id: '',
        type: ESceneElementType.Frame,
        name: 'Frame',
        clipContent: false,
        ...BlendProps.getDefaultProps(),
        ...TreeToggleProps.getDefaultProps(),
        ...TransformProps.getDefaultProps(),
        ...PaintProps.getDefaultSolidPaintProps(),
        ...StrokeProps.getDefaultProps(),
        ...SizeProps.getDefaultProps(),
        ...GuideProps.getDefaultProps(),
        ...ParentIndex.getDefaultProps(),
      };
      return frame;
    }
    case ESceneElementType.Section: {
      const section: ISectionElement = {
        id: '',
        type: ESceneElementType.Section,
        name: 'Section',
        ...BlendProps.getDefaultProps(),
        ...TreeToggleProps.getDefaultProps(),
        ...TransformProps.getDefaultProps(),
        ...PaintProps.getDefaultSolidPaintProps(),
        ...StrokeProps.getDefaultPropsBySection(),
        ...SizeProps.getDefaultProps(),
        ...ParentIndex.getDefaultProps(),
        ...CornerRadiusProps.getDefaultProps(),
      };
      return section;
    }
    case ESceneElementType.Rectangle: {
      const rectangle: IRectangleElement = {
        id: '',
        type: ESceneElementType.Rectangle,
        name: 'Rectangle',
        ...BlendProps.getDefaultProps(),
        ...TreeToggleProps.getDefaultProps(),
        ...TransformProps.getDefaultProps(),
        ...PaintProps.getDefaultSolidPaintProps(),
        ...StrokeProps.getDefaultProps(),
        ...SizeProps.getDefaultProps(),
        ...ParentIndex.getDefaultProps(),
      };
      return rectangle;
    }
    default: {
      const document: IDocumentElement = {
        id: '',
        type: ERootElementType.Document,
        name: 'Document',
        documentColorProfile: 'SRGB',
      };
      return document;
    }
  }
};

const createNewElement = (
  elementType: EElementType,
  id: string,
  elementProps: IElementPropsWithoutType
): IDocumentOrElement => {
  const newElement = createElementInner(elementType);
  return {
    ...newElement,
    ...elementProps,
    id,
  };
};

export { createElementInner, createNewElement };
