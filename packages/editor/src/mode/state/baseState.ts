import type { BehaviorNode } from '../behavior';
import type { View } from '../../view/';
import type { ICollectionUIManager, IStateNode } from '../../interface';
import { CollectionUIManager } from '../../node';
import { BaseModelNode } from '../base';
import { EStateEvent } from '../../const';
import { CustomCollection } from '../../node';
import { LBPointRenderNode, LTPointRenderNode, RBPointRenderNode, RTPointRenderNode, WHSignRenderNode, BaseSelectBorder } from '../UIElement';

export abstract class ActiveStateNode extends BaseModelNode implements IStateNode{
  private _behaviorCache = new Map<string, BehaviorNode>();
  private _collectionUIManager: ICollectionUIManager;
  private _areaIsVisible = false;
  constructor(view: View, id: string) {
    super(view, id);
    this._collectionUIManager = new CollectionUIManager(id, view);
  }

  registerBehavior(behavior: BehaviorNode) {
    const res = this._behaviorCache.get(behavior.id);
    if(!res){
      this._behaviorCache.set(behavior.id, behavior);
    }else{
      // logHelper.warn(`${behavior.id}:behavior already registered`);
    }
  }

  showArea(val = true){
    this._collectionUIManager.showArea(val);
    this._areaIsVisible = val;
  }

  get areaIsVisible(){
    return this._areaIsVisible;
  }

  get collectionUIManager(){
    return this._collectionUIManager;
  }

  enter(){
    this.onEnter();
  }

  exit(){
    this.onExit();
  }

  exitToDefault(){
    this.onExit();
    this.view.eventManager!.emit(EStateEvent.ToDefaultState, {data: this});
  }

  onEnter(): void {
    super.onEnter();
    if(this._collectionUIManager.isDestroyed){
      this._collectionUIManager = new CollectionUIManager(this.id, this.view);
    }
    this._collectionUIManager.enter();
    this.initBehaviors();
    this.registerCustomNode();
    // 挂载预置行为
    this._behaviorCache.forEach((node) => {
      node.onEnter();
    });
    this.showArea(this._areaIsVisible);
    this.view.eventManager!.emit(EStateEvent.Enter, {data: this});
  }

  onExit(): void {
    super.onExit();
    this.removeBehaviors();
    this._collectionUIManager.exit();
    this._collectionUIManager.destroy();
    this.view.eventManager!.emit(EStateEvent.Exit, {data: this});
  }

  abstract initBehaviors(): void;
  /**
   * 注册自定义渲染节点，目前自定义渲染节点其实都是由select自动触发的
   * @protected
   */
  protected registerCustomNode(): void {
    const selectCustomNodes = [
      new BaseSelectBorder('select',
        this.collectionUIManager,
        this.view,
        {
          colorEnabled: false,
        }),
      new WHSignRenderNode('select-wh-sign',
        this.collectionUIManager,
        this.view,
      ),
      new LBPointRenderNode( 'lb',
        this.collectionUIManager,
        this.view,
      ),
      new LTPointRenderNode( 'lt',
        this.collectionUIManager,
        this.view,
      ),
      new RBPointRenderNode( 'rb',
        this.collectionUIManager,
        this.view,
      ),
      new RTPointRenderNode( 'rt',
        this.collectionUIManager,
        this.view,
      ),
    ];

    selectCustomNodes.forEach(node => {
      this.collectionUIManager.addCustomNode(node);
    });
  }

  removeBehaviors(): void {
    this._behaviorCache.forEach(behavior => {
      behavior.onExit();
    });
    this._behaviorCache.clear();
  }
}
