import { ElementTree } from '@zhgu/data';

/**
 * 场景树
 */
export class Scene extends ElementTree<any> {
  private _currentPageId: null | string = null;

  get currentPage() {
    if (this._currentPageId != null) {
      // @ts-ignore
      return this.get(this._currentPageId);
    } else {
      return this.firstPageNode;
    }
  }

  getNodes(){
    return this.currentPage.children;
  }


  get currentPageId(): null | string {
    return this._currentPageId;
  }

  set currentPageId(id: string) {
    this._currentPageId = id;
  }

  getNodeById(id: string) {
    return this.node(id);
  }
}
