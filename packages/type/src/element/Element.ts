import {
  IElementBaseProps,
  IPageElementProps,
  ISceneElementBaseProps,
  IGroupElementProps,
  IFrameElementProps,
  IRectangleElementProps,
  IDocumentElementProps,
  ISectionElementProps,
  IShapeElementProps,
} from './ElementProps.ts';

import type { EElementType, ESceneElementType, EOtherElementType, ERootElementType } from './ElementType.ts';

interface IElement extends IElementBaseProps {
  id: string;
  type: EElementType;
}

// doc
interface IDocumentElement extends IDocumentElementProps {
  id: string;
  type: ERootElementType.Document;
}

// 页面
interface IPageElement extends IElement, IPageElementProps {
  id: string;
  type: EOtherElementType.Page;
}

interface IInternalPageElement extends IElement, IPageElementProps {
  id: string;
  type: EOtherElementType.InternalPage;
}

// 节点
interface INodeElement extends IElement, IShapeElementProps {
  id: string;
  type: ESceneElementType;
}

interface IFrameElement extends INodeElement, IFrameElementProps {
  type: ESceneElementType.Frame;
}

interface ISectionElement extends INodeElement, ISectionElementProps {
  type: ESceneElementType.Section;
}

interface IRectangleElement extends INodeElement, IRectangleElementProps {
  type: ESceneElementType.Rectangle;
}

interface IGroupElement extends INodeElement, IGroupElementProps {
  type: ESceneElementType.Group;
}

type IDocumentOrElement = IDocumentElement | IElement;

export {
  IElement,
  IDocumentElement,
  IPageElement,
  IInternalPageElement,
  INodeElement,
  IFrameElement,
  IRectangleElement,
  IGroupElement,
  IDocumentOrElement,
  ISectionElement,
};
