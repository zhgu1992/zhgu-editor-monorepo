import type { NodeModel } from '@zhgu/data';
import { ElementTree } from '@zhgu/data';
import type { BaseNode } from './baseNode';

/**
 * 场景树
 */
export class Scene extends ElementTree<BaseNode> {
  get currentPage() {
    return this.rootNode.children[0];
  }

  get pages() {
    return this.rootNode.children;
  }

  getNodes() {
    return this.currentPage.children;
  }

  getNodeById(id: string) {
    return this.node(id);
  }
}
