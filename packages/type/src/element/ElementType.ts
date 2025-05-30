enum ESceneElementType {
  Frame = 'Frame',
  Section = 'Section',
  Symbol = 'Symbol',
  Group = 'Group',
  RichText = 'RichText',
  Vector = 'Vector',
  Rectangle = 'Rectangle',
  Circle = 'Circle',
  Pentagram = 'Pentagram',
  Polygon = 'Polygon',
  Arrow = 'Arrow',
  Line = 'Line',
  Instance = 'Instance',
  Slice = 'Slice',
}

enum EOtherElementType {
  Page = 'Page',
  InternalPage = 'InternalPage'
}

enum ERootElementType {
  Document = 'Document',
}

type EElementType = ESceneElementType | EOtherElementType | ERootElementType;

type EInstancedType = EElementType

export {
  ESceneElementType,
  EOtherElementType,
  ERootElementType,
  EElementType,
  EInstancedType,
};
