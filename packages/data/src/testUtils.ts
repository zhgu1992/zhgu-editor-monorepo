import { ERootElementType, EOtherElementType, ESceneElementType } from '@zhgu/type';
import { createElementInner } from './dataUtil';
import { isNullOrUndefined } from './utils';

const testDocument = (id: number | string, children: any) => {
  const element = createElementInner(ERootElementType.Document);
  return {
    ...element,
    id: id.toString(),
    _children: children,
  };
};

const testInternalPage = (id: number | string, children: any) => {
  const element = createElementInner(EOtherElementType.InternalPage);
  return {
    ...element,
    id: id.toString(),
    name: 'Page ' + id,
    _children: children,
  };
};

const testPage = (id: number | string, children: any) => {
  const element = createElementInner(EOtherElementType.Page);
  return {
    ...element,
    id: id.toString(),
    name: 'Page ' + id,
    _children: children,
  };
};

const testFrame = (id: number | string, children: any, props?: any) => {
  const element = createElementInner(ESceneElementType.Frame);
  return {
    ...element,
    ...props,
    id: id.toString(),
    name: 'Frame ' + id,
    _children: children,
  };
};

const testRectangle = (id: number | string, props?: any) => {
  const element = createElementInner(ESceneElementType.Rectangle);
  return {
    ...element,
    ...props,
    id: id.toString(),
    name: 'Rectangle ' + id,
  };
};

const testGroup = (id: number | string, children: any, props?: any) => {
  const element = createElementInner(ESceneElementType.Group);
  return {
    ...element,
    ...props,
    id: id.toString(),
    name: 'Group ' + id,
    _children: children,
  };
};

const testSection = (id: number | string, children: any, props?: any) => {
  const element = createElementInner(ESceneElementType.Section);
  return {
    ...element,
    ...props,
    id: id.toString(),
    name: 'Section ' + id,
    _children: children,
  };
};

const travelDocument = (element: any, parentId: any, parentPosition: any, travelCallBack: any) => {
  const hasChildrenElements = element._children && element._children.length > 0;
  const childrenElements = hasChildrenElements ? [...element._children] : [];
  travelCallBack && travelCallBack(element, parentId, parentPosition);

  if (childrenElements.length) {
    const count = childrenElements.length;
    // const keys = generateNKeysBetween(null, null, count);
    childrenElements.forEach((childrenElement: any, index: any) => {
      const parentId = element.id;
      const parentPosition = index;
      travelDocument(childrenElement, parentId, parentPosition, travelCallBack);
    });
  }
};

const buildFileDataFromDocument = (doc: any) => {
  const fileDataList: any = [];
  travelDocument(doc, null, null, (element: any, parentId: any, parentPosition: any) => {
    const newElement = { ...element };
    delete newElement._children;
    if (!isNullOrUndefined(parentId) && !isNullOrUndefined(parentPosition)) {
      newElement.parentIndex = {
        id: parentId,
        position: parentPosition,
      };
    }
    fileDataList.push(newElement);
  });
  return fileDataList;
};

export {
  testGroup,
  testRectangle,
  testFrame,
  testPage,
  testInternalPage,
  testDocument,
  testSection,
  buildFileDataFromDocument,
};
