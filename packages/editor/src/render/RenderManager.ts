import { CustomNode, Scene } from '../node';
import { IRenderNode, WebGLRender } from '@zhgu/render';
import { ERenderGroupKey } from '../const';
import { NodeGroup } from './nodeGroup.ts';
import { type IBaseNode, ICustomNode } from '../interface';

export class RenderManager extends WebGLRender {
  private group: Map<ERenderGroupKey, NodeGroup> = new Map();
  // 系统group，会自动更新内容
  private groupKeys = [ERenderGroupKey.Render, ERenderGroupKey.Hover, ERenderGroupKey.Select];
  // 自定义group，需要用户手动更新内容
  private customGroupKeys = [ERenderGroupKey.Custom, ERenderGroupKey.Top];

  private _dirty = true;
  private _forceRender = false;
  private _forceHideHoverAndSelect = false;
  private _forceHideArea = true;
  // hover节点
  private _hoverCache = new Map<string, ICustomNode>();
  // 选中节点
  private _selectCache = new Map<string, ICustomNode>();
  // 当前渲染节点
  private _renderNodeCache = new Map<string, IBaseNode>();
  private _customNodeCache = new Map<string, ICustomNode>();

  public constructor() {
    super();
    [...this.groupKeys, ...this.customGroupKeys].forEach(v => {
      this.group.set(v, new NodeGroup(v));
    });
  }

  setRenderNode(id: string, node: IBaseNode) {
    const renderNodeGroup = this.group.get(ERenderGroupKey.Render)!;
    renderNodeGroup.addNode(node as any as ICustomNode);
  }

  getRenderNode(id: string): ICustomNode | undefined {
    const renderNodeGroup = this.group.get(ERenderGroupKey.Render)!;
    return renderNodeGroup.getNodeById(id);
  }

  removeRenderNode(id: string) {
    const renderNodeGroup = this.group.get(ERenderGroupKey.Render)!;
    renderNodeGroup.removeNodeById(id);
  }

  getAllNodeGroups() {
    return this.group;
  }

  setHoverRenderNode(id: string, node: ICustomNode) {
    const hoverGroup = this.group.get(ERenderGroupKey.Hover)!;
    hoverGroup.addNode(node);
  }

  removeHoverRenderNode(id: string) {
    const hoverGroup = this.group.get(ERenderGroupKey.Hover)!;
    hoverGroup.removeNodeById(id);
  }

  setSelectRenderNode(id: string, node: ICustomNode) {
    const selectGroup = this.group.get(ERenderGroupKey.Hover)!;
    selectGroup.addNode(node);
  }

  removeSelectNode(id: string) {
    const selectGroup = this.group.get(ERenderGroupKey.Hover)!;
    selectGroup.removeNodeById(id);
  }

  // @ts-ignore
  render(scene: Scene) {}

  getNodeGroup(key: ERenderGroupKey) {
    return this.group.get(key);
  }

  resetSystemGroup() {
    this.groupKeys.forEach(v => {
      const nodeGroup = this.group.get(v)!;
      nodeGroup.clear();
    });
  }

  set forceRender(val: boolean) {
    this._forceRender = val;
  }

  get forceHideHoverAndSelect() {
    return this._forceHideHoverAndSelect;
  }

  set forceHideHoverAndSelect(val: boolean) {
    const hoverGroup = this.group.get(ERenderGroupKey.Hover)!;
    hoverGroup.getAllNodes().forEach(v => {
      v.isVisible = false;
    });

    const selectGroup = this.group.get(ERenderGroupKey.Select)!;
    selectGroup.getAllNodes().forEach(v => {
      v.isVisible = false;
    });
    this.dirty();
  }

  get forceHideArea() {
    return this._forceHideArea;
  }

  set forceHideArea(val: boolean) {
    this._forceHideArea = val;
    // todo @zhgu
    this.dirty();
  }

  dirty() {
    this._dirty = true;
  }

  reset() {
    this.group.forEach((nodeGroup: NodeGroup) => {
      nodeGroup.clear();
    });
    this._dirty = true;
    this._forceRender = false;
    this._forceHideHoverAndSelect = false;
  }
}
