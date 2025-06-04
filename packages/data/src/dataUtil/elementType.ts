import type { EElementType } from '@zhgu/type';
import { ESceneElementType, EOtherElementType, ERootElementType } from '@zhgu/type';

const isSymbol = (type: EElementType | null) => {
  return type === ESceneElementType.Symbol;
};

const isInstance = (type: EElementType | null) => {
  return type === ESceneElementType.Instance;
};

const isFrame = (type: EElementType | null) => {
  return type === ESceneElementType.Frame;
};

const isPage = (type: EElementType | null) => {
  return type === EOtherElementType.Page;
};

const isInternalPage = (type: EElementType | null) => {
  return type === EOtherElementType.InternalPage;
};

const isFrameLike = (type: EElementType | null) => {
  return type === ESceneElementType.Frame || type === ESceneElementType.Symbol;
};

const isGroupLike = (type: EElementType | null) => {
  return type === ESceneElementType.Group;
};

const isDocument = (type: EElementType | null) => {
  return type === ERootElementType.Document;
};

export { isInternalPage, isDocument, isSymbol, isInstance, isFrame, isPage, isFrameLike, isGroupLike };
