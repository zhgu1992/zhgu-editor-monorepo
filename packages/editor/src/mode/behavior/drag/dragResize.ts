import { DragBaseBehaviorNode } from './dragBase';
import type {
  IInputSnapshot,
  ICustomCollection,
  ICollectionUIManager,
  TJsDragStartEvent,
  IBaseNode,
  TJsDragEndEvent,
} from '../../../interface';
import type { View } from '../../../view/';
import { mat3, vec2 } from 'gl-matrix';
import { flipXWithMyself, flipYWithMyself, getMaxAABB } from '@zhgu/data';
import type { AllDirection } from '../../../utils';
import type { Transaction } from '@zhgu/type';
import type { BaseResizeEventArea } from '../../UIElement';
import { ENodeChangeType } from '../../../const';

const Vec_Cache = {
  v1: vec2.create(),
  v2: vec2.create(),
  v3: vec2.create(),
};
const Mat_Cache = {
  m1: mat3.create(),
  m2: mat3.create(),
  m3: mat3.create(),
  m4: mat3.create(),
};

export class DragResizeBehavior extends DragBaseBehaviorNode {
  private dragResizeState: DragState | null = null;
  protected needHideUIWhenMoving = false;

  constructor(view: View, collectionUIManager: ICollectionUIManager, areaNodes: ICustomCollection[]) {
    super(view, 'drag-resize', collectionUIManager, areaNodes);
  }

  override shouldDrag(areaNode: ICustomCollection, inputSnapshot: IInputSnapshot) {
    const { view } = this;
    if (view.eventManager?.selectedNodes.length === 0 || inputSnapshot.cmdKey) {
      return false;
    }

    return super.shouldDrag(areaNode, inputSnapshot);
  }

  onDragStart: TJsDragStartEvent = (areaNode, inputSnapshot) => {
    const { area } = areaNode;
    const { originPagePoint } = inputSnapshot;
    const { x, y } = this.getPositionDataByPGA(originPagePoint);
    const {
      resizeType,
      collection: { nodes },
    } = area as BaseResizeEventArea;
    if (nodes.length === 0) {
      return;
    }
    this.dragResizeState = new DragState(nodes, [x, y], resizeType);
    this.view.startCompressTransaction();
    // this.collectionUIManager.hideUI();
  };

  onDragMove: TJsDragStartEvent = (areaNode, inputSnapshot) => {
    const { area } = areaNode;
    if (!this.dragResizeState) {
      return;
    }
    const { currentPagePoint, altKey, shiftKey } = inputSnapshot;

    const { nodes } = this.dragResizeState;
    const nodeLength = nodes?.length ?? 0;
    const isOneNode = nodeLength === 1;
    const isRotate = false,
      isContainer = false,
      whRelation = false;
    if (isOneNode) {
      const node = nodes[0];
      // isRotate = isRotated(node);
      // isContainer = isContainerNotGroup(node);
      // whRelation = node.widthHeightRelation;
    }

    // 对齐像素网格
    // const { x, y } = this.getPositionDataByPGA(currentPagePoint, {
    //   isRotate,
    //   isContainer,
    // });

    this.dragResizeState.moveTo([currentPagePoint.x, currentPagePoint.y], { altKey, shiftKey });

    if (isOneNode) {
      this.singleDragResize();
    } else {
      this.multiDragResize();
    }
    this.collectionUIManager.update(new Set(['transform', 'size']));
    this.view.eventManager?.emit(ENodeChangeType.BaseAttributeChange, { data: nodes });
  };

  onDragEnd: TJsDragEndEvent = (areaNode, inputSnapshot) => {
    const { nodes } = this.dragResizeState!;
  };

  singleDragResize() {
    const { dragResizeState } = this;
    if (!dragResizeState) {
      return;
    }
    const {
      nodes: [node],
      currentDragBounds: bounds,
      needFlipX,
      needFlipY,
    } = dragResizeState!;
    let { w, h } = bounds;
    const { x, y } = bounds;

    w = Math.abs(w);
    h = Math.abs(h);

    let { rt } = node;
    if (needFlipX) {
      rt = flipXWithMyself(rt);
    }
    if (needFlipY) {
      rt = flipYWithMyself(rt);
    }

    dragResizeState.needFlipX = false;
    dragResizeState.needFlipY = false;

    rt[6] = x;
    rt[7] = y;

    const transactions: Transaction = [];
    transactions.push(node.changeRtAndSize(rt, w, h));
    this.view.applyTransaction(transactions);
  }

  multiDragResize() {
    const { dragResizeState } = this;
    if (!dragResizeState) {
      return;
    }
    const { currentDragBounds: bounds, nodes, startDragBounds: startBounds, startDragNodesInfo } = dragResizeState;
    const { x: prevX, y: prevY, w: prevW, h: prevH } = startBounds;
    const { x, y, w, h } = bounds;

    // 算出 整个拖拽框的 缩放矩阵
    const mat = mat3.create();
    mat3.mul(mat, mat3.fromTranslation(Mat_Cache.m2, [-prevX, -prevY]), mat);
    mat3.mul(mat, mat3.fromScaling(Mat_Cache.m2, [w / prevW, h / prevH]), mat);
    mat3.mul(mat, mat3.fromTranslation(Mat_Cache.m2, [prevX, prevY]), mat);
    mat3.mul(mat, mat3.fromTranslation(Mat_Cache.m2, [x - prevX, y - prevY]), mat);

    const transactions: Transaction = [];

    const adjust = (node: IBaseNode, originNodeInfo: { w: number; h: number; at: mat3 }) => {
      const { at: originAt, w: originW, h: originH } = originNodeInfo;
      const transformRt = mat3.mul(Mat_Cache.m3, mat, originAt); // 将整个拖拽框的变换矩阵应用到当前节点的rt
      const ap0 = vec2.transformMat3(Vec_Cache.v1, [0, 0], transformRt); // 左上角在整个拖拽框变换后的坐标
      const ap1 = vec2.transformMat3(Vec_Cache.v2, [originW || 0.01, 0], transformRt); // 右上角在整个拖拽框变换后的坐标
      const ap2 = vec2.transformMat3(Vec_Cache.v3, [originW || 0.01, originH || 0.01], transformRt); // 右下角在整个拖拽框变换后的坐标

      const w = vec2.dist(ap0, ap1);
      const h = vec2.dist(ap1, ap2);
      // const isRotate = isRotated(node);
      // const signX = 1 || Math.sign(node.rt[0]);
      // const signY = 1 || Math.sign(node.rt[3]);
      const scaleMat = mat3.fromScaling(Mat_Cache.m1, [(originNodeInfo.w || 0.01) / w, (originNodeInfo.h || 0.01) / h]);
      const at = mat3.mul(Mat_Cache.m1, transformRt, scaleMat);
      // 旋转node不需要对齐像素格子
      // const { x: pgaX, y: pgaY, w: pgaW, h: pgaH } = this.getFixPixelGridBoundByPGA({ x: at[6], y: at[7], w: signX * w, h: signY * h }, {
      //   isRotate,
      //   isContainer: isContainerNode(node)
      // });
      transactions.push(node.changeAtAndSize(at, Math.abs(w), Math.abs(h)));
    };

    nodes.forEach((node, i) => {
      adjust(node, startDragNodesInfo[i]);
    });

    this.view.applyTransaction(transactions);
  }
}

export type DragBounds = {
  x: number;
  y: number;
  w: number;
  h: number;
  at: mat3;
  invAt: mat3;
};

export type TAllDirection = AllDirection | 'move'; // 还有 move

// 元素坐标系：四个点&四条边
const ALT_XY_RATIO = {
  lt: [0, 0],
  rt: [1, 0],
  rb: [1, 1],
  lb: [0, 1],
  t: [1, 0],
  b: [1, 1],
  l: [0, 1],
  r: [1, 0],
};

// 元素坐标系四个点
const SHIFT_XY_RATIO = {
  lt: [1, 1], // lt
  rt: [0, 1], // rt
  rb: [0, 0], // br
  lb: [1, 0], // bl
};

const cloneBounds = (bounds: DragBounds): DragBounds => {
  return {
    ...bounds,
    at: mat3.clone(bounds.at ?? mat3.create()),
    invAt: mat3.clone(bounds.invAt ?? mat3.create()),
  };
};

export const getCenter = (nodes: IBaseNode[]) => {
  const box = getMaxAABB(nodes);
  return vec2.fromValues(box.x + box.w / 2, box.y + box.h / 2);
};

export class DragState {
  public currentPos: vec2; // 当前鼠标拖拽点 (绝对坐标)
  public startDragBounds: DragBounds; // 起始的拖拽框
  public currentDragBounds: DragBounds; // 当前的拖拽框
  public lastDragBounds: DragBounds; // 上次的拖拽框
  public startDragNodesInfo: Pick<IBaseNode, 'w' | 'h' | 'at'>[]; // 拖拽前的Node信息
  public startPoints: vec2[]; // 起始拖拽框的四个点
  public startPivot: vec2; // 起始的旋转中心
  public ratio: number; // 长宽比
  public rotation: number; // 旋转角

  public dw: number; // 拖拽框宽度变化量
  public dh: number; // 拖拽框高度变化量
  public needFlipX = false;
  public needFlipY = false;

  constructor(
    public nodes: IBaseNode[], // 拖拽需要resize的Nodes
    public startPos: vec2, // 起始鼠标拖拽点 (绝对坐标)
    public cursorKey: TAllDirection // 拖拽点的位置
  ) {
    this.dw = 0; // 拖拽框宽度变化量
    this.dh = 0; // 拖拽框高度变化量
    this.startDragNodesInfo = nodes.map(node => ({ w: node.w, h: node.h, at: mat3.clone(node.at) }));
    if (nodes.length === 1) {
      const { apoints, rotation, at, w, h } = nodes[0];
      const [[x, y]] = apoints;
      this.startDragBounds = {
        x,
        y,
        w,
        h,
        at: mat3.clone(at),
        invAt: mat3.invert(mat3.create(), at),
      };
      this.startPoints = apoints;
      this.rotation = rotation;
    } else {
      // 处理多选
      const { w, h, x, y } = getMaxAABB(nodes);
      const at = mat3.fromTranslation(mat3.create(), [x, y]);
      this.startDragBounds = {
        w,
        h,
        x,
        y,
        at,
        invAt: mat3.invert(mat3.create(), at),
      };
      this.startPoints = [
        vec2.fromValues(x, y),
        vec2.fromValues(x + w, y),
        vec2.fromValues(x + w, y + h),
        vec2.fromValues(x, y + h),
      ];
      this.rotation = 0;
    }
    this.currentPos = vec2.clone(this.startPos); // 当前鼠标拖拽点
    const { w, h } = this.startDragBounds;
    this.ratio = w / h; // 长宽比
    this.currentDragBounds = cloneBounds(this.startDragBounds); // 当前的拖拽框
    this.lastDragBounds = cloneBounds(this.startDragBounds); // 上次的拖拽框 (多选需要用)
    this.startPivot = getCenter(nodes); // 起始中心点
  }

  moveTo(
    pos: vec2,
    options: { altKey: boolean; shiftKey: boolean; noFlip?: boolean } = {
      altKey: false,
      shiftKey: false,
      noFlip: false,
    }
  ) {
    this.currentPos = vec2.clone(pos);
    const { altKey, shiftKey, noFlip } = options;
    this.lastDragBounds = cloneBounds(this.currentDragBounds);

    const { w, h, invAt, at } = this.startDragBounds;
    const [ap0] = this.startPoints;
    // @ts-ignore
    const rStartPos = this.fixDragPoint(vec2.transformMat3(vec2.create(), this.startPos, invAt)); // 相对坐标系的起始拖拽点
    const rCurrentPos = vec2.transformMat3(vec2.create(), this.currentPos, invAt); // 相对坐标系的当前点
    const rpivot = vec2.transformMat3(vec2.create(), this.startPivot, invAt); // 相对坐标系下的旋转中心
    const [dx, dy] = vec2.sub(vec2.create(), rCurrentPos, rStartPos); // 相对坐标系下鼠标的偏移
    const rpos = vec2.transformMat3(vec2.create(), ap0, invAt); // 相对坐标系下的a点(x, y)
    const size = vec2.fromValues(w, h);
    const [sx, sy] = size;

    const resize = (dir: TAllDirection) => {
      const noFlipAndAlt = noFlip && !altKey;
      switch (dir) {
        case 't':
          if (sy - dy < 0 && noFlipAndAlt) {
            rpos[1] = sy;
            size[1] = dy - sy;
          } else {
            rpos[1] += dy;
            size[1] -= dy;
          }
          break;
        case 'b':
          if (sy + dy < 0 && noFlipAndAlt) {
            rpos[1] += sy + dy;
            size[1] = -(dy + sy);
          } else {
            size[1] += dy;
          }
          break;
        case 'l':
          if (sx - dx < 0 && noFlipAndAlt) {
            rpos[0] += sx;
            size[0] = dx - sx;
          } else {
            rpos[0] += dx;
            size[0] -= dx;
          }
          break;
        case 'r':
          if (sx + dx < 0 && noFlipAndAlt) {
            rpos[0] += dx + sx;
            size[0] = -(dx + sx);
          } else {
            size[0] += dx;
          }
          break;
        case 'move': // 移动 拖拽resize过程按住space的时候表现为移动
          rpos[0] += dx;
          rpos[1] += dy;
          break;
        default:
          break;
      }
    };
    const { cursorKey } = this;
    if (cursorKey !== 'move') {
      cursorKey.split('').forEach(dir => {
        resize(dir as 'l');
      });
    } else {
      resize('move');
    }

    if (altKey && !['lm', 'rm'].includes(cursorKey)) {
      const altXY = ALT_XY_RATIO[cursorKey as 'l'];
      rpos[0] -= altXY[0] * (size[0] - w);
      rpos[1] -= altXY[1] * (size[1] - h);
      size[0] = (size[0] - rpivot[0]) * 2;
      size[1] = (size[1] - rpivot[1]) * 2;
    }

    if (shiftKey && !['lm', 'rm'].includes(cursorKey)) {
      const ratio = this.ratio;
      if (['t', 'b'].includes(cursorKey)) {
        // 单边等比缩放只允许一边翻转
        const nw = Math.abs(size[1] * ratio);
        rpos[0] -= (nw - size[0]) / 2;
        size[0] = nw;
      } else if (['l', 'r'].includes(cursorKey)) {
        // 单边等比缩放只允许一边翻转
        const nh = Math.abs(size[0] / ratio);
        rpos[1] -= (nh - size[1]) / 2;
        size[1] = nh;
      } else if (cursorKey !== 'move') {
        const shiftXY = SHIFT_XY_RATIO[cursorKey as 'lb'];
        if (Math.abs(size[0] / size[1]) > ratio) {
          const nh = Math.sign(size[1]) * Math.abs(size[0] / ratio);
          rpos[1] -= altKey ? (nh - size[1]) / 2 : shiftXY[1] * (nh - size[1]);
          size[1] = nh;
        } else {
          const nw = Math.sign(size[0]) * Math.abs(size[1] * ratio);
          rpos[0] -= altKey ? (nw - size[0]) / 2 : shiftXY[0] * (nw - size[0]);
          size[0] = nw;
        }
      }
    }

    const rp0 = vec2.fromValues(rpos[0], rpos[1]); // 变换后的 左上角
    const rp1 = vec2.fromValues(rpos[0] + size[0], rpos[1]); // 变换后的 右上角
    const rp3 = vec2.fromValues(rpos[0], rpos[1] + size[1]); // 变换后的 左下角

    const nap0 = vec2.transformMat3(vec2.create(), rp0, at); // rp0转原始坐标
    const nap1 = vec2.transformMat3(vec2.create(), rp1, at); // rp1转原始坐标
    const nap3 = vec2.transformMat3(vec2.create(), rp3, at); // rp3转原始坐标

    const absW = vec2.dist(nap1, nap0); // 左上角到右上角距离 宽
    const absH = vec2.dist(nap3, nap0); // 左上角到左下角距离 高

    if (size[1] === 0 || size[0] === 0) {
      return;
    }

    const nw = (Math.sign(size[0]) || 1) * absW; // 取符号
    const nh = (Math.sign(size[1]) || 1) * absH;

    this.dw = nw - (this.currentDragBounds.w ?? 0); // 变化的宽度
    this.dh = nh - (this.currentDragBounds.h ?? 0);

    const scale = vec2.fromValues(nw / w, nh / h);
    const scaleMat = mat3.fromScaling(mat3.create(), scale);
    const nat = mat3.mul(mat3.create(), scaleMat, at);
    nat[6] = nap0[0];
    nat[7] = nap0[1];

    this.currentDragBounds = {
      x: nap0[0],
      y: nap0[1],
      w: nw,
      h: nh,
      at: nat,
      invAt: mat3.invert(mat3.create(), nat),
    };

    if (this.lastDragBounds.w * nw < 0) {
      this.needFlipX = true;
    }
    if (this.lastDragBounds.h * nh < 0) {
      this.needFlipY = true;
    }
  }

  /**
   * @name: 拖拽点修正
   * @test: 将拖拽点修正到准确的位置上
   * @return {*}
   */
  fixDragPoint(rStartPos: [number, number]) {
    const { cursorKey } = this;
    const { w, h } = this.startDragBounds;

    switch (cursorKey) {
      case 't':
        rStartPos[1] = 0;
        break;
      case 'b':
        rStartPos[1] = h;
        break;
      case 'l':
        rStartPos[0] = 0;
        break;
      case 'r':
        rStartPos[0] = w;
        break;
      case 'lt':
        rStartPos = [0, 0];
        break;
      case 'rt':
        rStartPos = [w, 0];
        break;
      case 'rb':
        rStartPos = [w, h];
        break;
      case 'lb':
        rStartPos = [0, h];
        break;
    }
    return rStartPos;
  }
}
