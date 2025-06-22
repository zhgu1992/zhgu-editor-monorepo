import {
  EElementChangeType,
  EOtherElementType,
  type PropsElementChange,
  type RenderCategorySet,
  type RGBAColor,
  type IPageElement,
} from '@zhgu/type';
import { NodeFactory } from './nodeFactory';
import { type ElementData, mat2obj, NodeModel } from '@zhgu/data';
import type { View } from '../view';
import type { RenderManager } from '../render';

export class Page extends NodeModel {
  private _view: View;
  private _renderManager: RenderManager;
  constructor(elementData: ElementData, view: View) {
    super(elementData);
    this._view = view;
    // this._eventManager = eventManager!;
    this._renderManager = this._view.renderManager!;
    this._renderManager.setBackgroundColor(this.backgroundColor);
  }

  get view() {
    return this._view;
  }

  get renderManager() {
    return this._renderManager;
  }

  get backgroundColor() {
    // 从props中读取backgroundColor，如果没有则返回默认值
    const pageProps = this.props as unknown as IPageElement;
    return pageProps.backgroundColor;
  }

  setBackgroundColor(color: RGBAColor) {
    return {
      id: this.id,
      type: EElementChangeType.Props,
      props: {
        backgroundColor: color,
      },
    } as PropsElementChange;
  }
  // @ts-ignore
  updateRenderNode(renderCategorySet: RenderCategorySet) {
    this.renderManager.setBackgroundColor(this.backgroundColor);
  }
}

NodeFactory.register(EOtherElementType.Page, Page);
