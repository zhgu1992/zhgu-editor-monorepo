import { BaseCollection } from './collection';
import type { View } from '../../view';
import type { IEventArgs } from '../../const';
import { EHistoryEvent, ESelectEventType, EViewPortEventType } from '../../const';
import type { ICollectionUIManager, IBehaviorNode, ICustomCollection } from '../../interface';
import autobind from 'autobind-decorator';
import type { XYPos } from '@zhgu/type';
import { type RenderCategorySet } from '@zhgu/type';

/**
 * 热区管理类，用户可以通过该类进行热区绑定和更新操作
 */
export class CollectionUIManager extends BaseCollection implements ICollectionUIManager {
  areas: ICustomCollection[] = [];
  isDestroyed = false;
  customNodes: ICustomCollection[] = [];
  private _view: View;
  private _cache: WeakMap<ICustomCollection, IBehaviorNode> = new WeakMap();
  private timerId: number | null = null;

  constructor(id: string, view: View, type = 'collectionArea') {
    super(`${id}-${type}`, []);
    this._view = view;
  }

  addCustomNode(node: ICustomCollection) {
    this.customNodes.push(node);
  }

  enter() {
    this.bindEvents();
  }

  exit() {
    this.removeEvents();
  }

  // 设置热区和behavior的关系
  setAreaRelation(area: ICustomCollection, behavior: IBehaviorNode) {
    this.areas.push(area);
    this._cache.set(area, behavior);
  }

  removeArea(area: ICustomCollection) {
    this._removeNode(area, this.areas);
  }

  removeCustomNode(node: ICustomCollection) {
    this._removeNode(node, this.customNodes);
  }

  private _removeNode(area: ICustomCollection, queue: ICustomCollection[]) {
    const indexToRemove = queue.indexOf(area);
    if (indexToRemove > -1) {
      queue.splice(indexToRemove, 1);
    }
    area.destroy();
  }

  pickArea(position: XYPos) {
    const nodes = this.areas;
    const results: ICustomCollection[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const areaNode = nodes[i];
      const renderNode = areaNode.renderNode;
      const localPoint = renderNode.worldTransform.applyInverse(position);
      // todo 判定热区是否开启
      const flag = renderNode.containsPoint(localPoint);
      if (flag && areaNode) {
        results.push(areaNode);
      }
    }
    results.sort((a, b) => (b.renderOrder ?? 0) - (a.renderOrder ?? 0));
    return results;
  }

  getBehaviorByArea(area: ICustomCollection) {
    return this._cache.get(area);
  }

  get view() {
    return this._view;
  }

  bindEvents() {
    this.view.eventManager!.on(ESelectEventType.SelectChange, this.changeSelect);
    this.view.eventManager!.on(EHistoryEvent.UndoRedo, this.updateUndoRedo);
    this.view.eventManager!.on(EViewPortEventType.ZoomChange, this.updateZoom);
  }

  removeEvents() {
    this.view.eventManager!.off(ESelectEventType.SelectChange, this.changeSelect);
    this.view.eventManager!.off(EHistoryEvent.UndoRedo, this.updateUndoRedo);
    this.view.eventManager!.off(EViewPortEventType.ZoomChange, this.updateZoom);
  }

  @autobind
  changeSelect(ev: IEventArgs) {
    const selectNodes = ev.data;
    this.view.renderManager!.forceHideArea = selectNodes.length <= 0;
    this.nodes = selectNodes;
    this.update();
  }

  showArea(val: boolean = true) {
    this.areas.forEach(area => {
      area.isVisible = val;
    });
  }

  @autobind
  showCustomNode(val: boolean = true) {
    this.customNodes.forEach(node => {
      node.isVisible = val;
    });
    this.view.renderManager!.forceHideHoverAndSelect = !val;
  }

  /**
   * Canvas UI 延时展示规则：相应操作行为结束后，判断光标在 canvas 内 {是否发生位移}
   * 发生位移：UI 提示内容立即渲染显示；
   * 未发生位移：1s 后自动展示 UI 提示内容；
   */
  showUI(delay = 1000) {
    this.showCustomNode();
  }

  hideUI() {
    this.showCustomNode(false);
  }

  private addListener = () => {
    const eventManager = this.view.eventManager!;
    eventManager.on('mousemove', this.showCustomNode);
    eventManager.on('mousedown', this.showCustomNode);
    this.timerId = window.setTimeout(this.showCustomNode, 1000);
  };

  private removeListener = () => {
    if (this.timerId) {
      window.clearTimeout(this.timerId);
      const eventManager = this.view.eventManager!;
      eventManager.off('mousemove', this.showCustomNode);
      eventManager.off('mousedown', this.showCustomNode);
      this.timerId = null;
    }
  };

  @autobind
  updateUndoRedo() {
    this.update(new Set(['transform', 'size']));
  }

  @autobind
  updateZoom() {
    this.update(new Set(['transform']), true);
  }

  @autobind
  update(props?: RenderCategorySet, ignoreArea = false) {
    super.update(props);
    if (!ignoreArea) {
      this.updateArea();
    }
    this.updateArea();
    this.updateCustomNode();
    this.view.renderManager?.dirty();
  }

  updateArea() {
    this.areas.forEach(area => {
      area.update();
    });
  }

  updateCustomNode() {
    this.customNodes.forEach(node => {
      node.update();
    });
  }

  // 切换状态后必须销毁热区
  destroy() {
    this.areas.forEach(v => {
      v.destroy();
    });
    this.customNodes.forEach(v => {
      v.destroy();
    });
    this.removeListener();
    this.removeEvents();
    this.areas = [];
    this.customNodes = [];
    this.isDestroyed = true;
  }
}
