import type { ElementChangeProps, RenderCategorySet, RenderCategory } from '@zhgu/type';

const elementProps2RenderCategorySet = (elementChangeProps: ElementChangeProps): RenderCategorySet => {
  const renderCategory: RenderCategorySet = new Set();
  const propsKeyList = Object.keys(elementChangeProps) as RenderCategory[];
  for (const key of propsKeyList) {
    // @ts-ignore 暂时先这样
    if (key === 'w' || key === 'h') {
      renderCategory.add('size');
    } else {
      renderCategory.add(key);
    }
  }
  return renderCategory;
};

export { elementProps2RenderCategorySet };
