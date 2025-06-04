import { mat3, vec2 } from 'gl-matrix';
import { getMaxAABB, getObbPoints } from '@zhgu/data';
import type { IBaseNode, ICollection } from '../../interface';
import type { RenderCategorySet, XYWH } from '@zhgu/type';

/**
 *  集合对象,主要用于多选
 */
export class BaseCollection implements ICollection{
  id: string;
  private _dataNodes: IBaseNode[];
  private _aabb: XYWH|null = null;
  constructor(id: string, nodes: IBaseNode[]) {
    this.id = id;
    this._dataNodes = nodes;
  }

  set nodes(nodes: IBaseNode[]) {
    this._dataNodes = nodes;
  }

  get nodes(){
    return this._dataNodes;
  }

  get type() {
    if (this._dataNodes.length === 1) {
      return this._dataNodes[0].type;
    }

    return '';
  }

  get w() {
    if (this._dataNodes.length === 1) {
      return this._dataNodes[0].w;
    }

    return this.absoluteAABB.w;
  }

  get h() {
    if (this._dataNodes.length === 1) {
      return this._dataNodes[0].h;
    }

    return this.absoluteAABB.h;
  }

  get x() {
    if (this._dataNodes.length === 1) {
      return this._dataNodes[0].x;
    }

    return this.absoluteAABB.x;
  }

  get y() {
    if (this._dataNodes.length === 1) {
      return this._dataNodes[0].y;
    }

    return this.absoluteAABB.y;
  }

  get rotation() {
    if (this._dataNodes.length === 1) {
      return this._dataNodes[0].rotation;
    }

    return 0;
  }

  get strokeWeight() {
    if (this._dataNodes.length === 1) {
      return this._dataNodes[0].strokeProps.strokeWeight;
    }
    return 0;
  }

  get absoluteAABB() {
    if(!this._aabb){
      if(this._dataNodes.length === 0) {
        this._aabb = {
          x: 0,
          y: 0,
          w: 1,
          h: 1,
        };
      }else{
        this._aabb = getMaxAABB(this._dataNodes);
      }
    }
    return this._aabb;
  }

  update(props?: RenderCategorySet){
    this._aabb = null;
    this._dataNodes.forEach(node => {
      node.updateHoverAndSelect(props);
    });
  }

  get at() {
    if (this._dataNodes.length === 1) {
      return this._dataNodes[0].at;
    }

    return mat3.fromValues(1, 0, 0, 0, 1, 0, this.absoluteAABB.x, this.absoluteAABB.y, 1);
  }

  get apoints() {
    if (this._dataNodes.length === 1) {
      return this._dataNodes[0].apoints;
    }

    return getObbPoints({
      w: this.w,
      h: this.h,
      mat: this.at,
    });
  }

  get apivot() {
    if (this._dataNodes.length === 1) {
      return this._dataNodes[0].apivot;
    }

    const aabb = this.absoluteAABB;
    return vec2.fromValues(aabb.x + aabb.w / 2, aabb.y + aabb.h / 2);
  }
}
