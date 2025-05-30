import { Node } from './Node';
import { mat3, vec2 } from 'gl-matrix';
import { obj2mat } from '../utils';
import { aabb, getObbPoints } from '../utils';
import type {
  Transform,
  XYWH,
  XYPos,
  RenderCategorySet,
} from '@zhgu/type';
import type { IGeometryNode } from '../interface';
import { TransformProps } from '../dataUtil';

const AT_RENDERCATEGORYSET = new Set([...TransformProps.keys]) as RenderCategorySet;

class GeometryNode extends Node implements IGeometryNode {

  private _relative: mat3 = mat3.create();
  private _at: mat3 = mat3.create();


  get rt(): mat3 {
    if (this.props.transform) {
      this._relative = obj2mat(this.props.transform, this._relative);
    }
    return this._relative;
  }

  get at(): mat3 {
    const parent = this.parent;
    if (parent) {
      this._at = mat3.mul(this._at, (parent as GeometryNode).at, this.rt);
    } else {
      this._at = mat3.clone(this.rt);
    }
    return this._at;
  }

  get transform(): Transform {
    return this.props.transform!;
  }

  /**
   * @description 绝对坐标系下OBB包围盒的4个点
   */
  get apoints(): vec2[] {
    return getObbPoints({
      w: this.w,
      h: this.h,
      mat: this.at,
    });
  }

  /** 绝对坐标系下的 AABB */
  get absoluteAABB(): XYWH {
    return aabb(this.apoints);
  }

  /**
   * @description 绝对坐标系下rpoints的AABB包围盒
   */
  get relativeAABB(): XYWH {
    return aabb(this.rpoints);
  }

  /**
   * @description 相对坐标系下OBB包围盒的4个点
   */
  get rpoints(): vec2[] {
    return getObbPoints({
      w: this.w,
      h: this.h,
      mat: this.rt,
    });
  }

  /**
   * @description 旋转中心点
   */
  get apivot(): vec2 {
    const aabb = this.absoluteAABB;
    return vec2.fromValues(aabb.x + aabb.w / 2, aabb.y + aabb.h / 2);
  }

  get w(): number {
    return this.props.w!;
  }

  get h(): number {
    return this.props.h!;
  }

  /**
   * @description 获取节点 x 坐标 (相对坐标)
   * @return {number}
   */
  get x(): number {
    return this.transform.m02;
  }

  /**
   * @description 获取节点 y 坐标(相对坐标)
   * @return {number}
   */
  get y(): number {
    return this.transform.m12;
  }

  /**
   * @description 获取节点 rotation
   * @return {number}
   */
  get rotation(): number {
    const mat = this.rt;
    return (Math.atan2(mat[1], mat[0]) * 180) / Math.PI;
  }

  get absolutePosition(): XYPos {
    const { at } = this;
    return {
      x: at[6],
      y: at[7],
    };
  }

  get isFlipHorizontal() {
    return Boolean(this.rt[0] < 0);
  }

  get isFlipVertical() {
    return Boolean(this.rt[4] < 0);
  }

  updateNodeAt() {
    this.updateRenderNode(AT_RENDERCATEGORYSET);
    this.children.forEach((node) => node.updateNodeAt());
  }
}

export { GeometryNode };
