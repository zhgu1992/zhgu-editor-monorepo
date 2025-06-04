import { ElementTree } from '@zhgu/data';

/**
 * 场景树
 */
export class Scene extends ElementTree<any> {

  get currentPage() {
     return this.rootNode.children[0];
  }

  getNodes(){
    return this.currentPage.children;
  }

  getNodeById(id: string) {
    return this.node(id);
  }
}
