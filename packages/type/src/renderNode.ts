type RenderCategory =
  | 'size'
  | 'fillPaints'
  | 'isVisible'
  | 'opacity'
  | 'stroke'
  | 'transform'
  | 'strokePaints'
  | 'strokeWeight';

type RenderCategorySet = Set<RenderCategory>

const AllRenderCategorySet: RenderCategorySet = new Set(['transform', 'size', 'fillPaints', 'isVisible', 'opacity','stroke', 'strokePaints', 'strokeWeight']);

export { RenderCategory, RenderCategorySet, AllRenderCategorySet };
