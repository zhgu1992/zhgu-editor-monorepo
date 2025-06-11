import { ElementTree } from '@zhgu/data';
import type { BaseNode } from './baseNode';

/**
 * 场景树
 */
export class Scene extends ElementTree<BaseNode> {
  get currentPage() {
    return this.rootNode.children[0] as BaseNode;
  }

  get pages() {
    return this.rootNode.children as BaseNode[];
  }

  getNodes() {
    return this.currentPage.children as BaseNode[];
  }

  getNodeById(id: string) {
    return this.node(id);
  }
}
