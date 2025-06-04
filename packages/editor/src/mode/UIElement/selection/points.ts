import type { CornerDirection } from '../../../utils';
import { BaseRectangleResizePoint, BaseRectangleRotatePoint, BaseRenderPoint } from './baseSelectPoint';

/**
 * 选中框四个角的渲染节点
 */
export class LBPointRenderNode extends BaseRenderPoint {
  protected _resizeType: CornerDirection = 'lb';

  get diffXY() {
    return {
      x: -this.diffSize,
      y: this.collection.h - this.diffSize
    };
  }
}

export class LTPointRenderNode extends BaseRenderPoint {
  protected _resizeType: CornerDirection = 'lt';

  get diffXY() {
    const { diffSize } = this;

    return {
      x: -diffSize,
      y: -diffSize
    };
  }
}

export class RBPointRenderNode extends BaseRenderPoint {
  protected _resizeType: CornerDirection = 'rb';

  get diffXY() {
    return {
      x: this.collection.w - this.diffSize,
      y: this.collection.h - this.diffSize
    };
  }
}


export class RTPointRenderNode extends BaseRenderPoint {
  protected _resizeType: CornerDirection = 'rt';

  get diffXY() {
    return {
      x: this.collection.w - this.diffSize,
      y: -this.diffSize
    };
  }
}

/**
 * 选中框四个渲染Resize热区
 */


export class LTPointResizeEventArea extends BaseRectangleResizePoint {
  protected _resizeType: CornerDirection = 'lt';

  get diffXY() {
    return {
      x: -this.diffSize,
      y: -this.diffSize
    };
  }
}

export class RTPointResizeEventArea extends BaseRectangleResizePoint {
  protected _resizeType: CornerDirection = 'rt';

  get diffXY() {
    const { offset, collection, diffSize } = this;
    return {
      x: collection.w - diffSize + offset,
      y: -diffSize
    };
  }
}

export class RBPointResizeEventArea extends BaseRectangleResizePoint {
  protected _resizeType: CornerDirection = 'rb';

  get diffXY() {
    const { offset, collection, diffSize } = this;

    return {
      x: collection.w - diffSize + offset,
      y: collection.h - diffSize + offset
    };
  }
}

export class LBPointResizeEventArea extends BaseRectangleResizePoint {
  protected _resizeType: CornerDirection = 'lb';

  get diffXY() {
    const { offset, collection, diffSize } = this;
    return {
      x: -diffSize,
      y: collection.h - diffSize + offset
    };
  }
}




/**
 * 选中框四个Rotate热区
 */
export class LTPointRotateEventArea extends BaseRectangleRotatePoint {
  protected _rotateType: CornerDirection = 'lt';

  get diffXY() {
    return {
      x: -this.rectSize + this.diffSize,
      y: -this.rectSize + this.diffSize
    };
  }
}

export class RTPointRotateEventArea extends BaseRectangleRotatePoint {
  protected _rotateType: CornerDirection = 'rt';

  get diffXY() {
    const { rectSize, diffSize, collection, offset } = this;
    return {
      x: collection.w - diffSize,
      y: -rectSize + diffSize
    };
  }
}

export class RBPointRotateEventArea extends BaseRectangleRotatePoint {
  protected _rotateType: CornerDirection = 'rb';

  get diffXY() {
    const { collection, diffSize } = this;
    return {
      x: collection.w - diffSize,
      y: collection.h - diffSize
    };
  }
}


export class LBPointRotateEventArea extends BaseRectangleRotatePoint {
  protected _rotateType: CornerDirection = 'lb';

  get diffXY() {
    const { rectSize, diffSize, collection, offset } = this;
    return {
      x: -rectSize + diffSize,
      y: collection.h - diffSize
    };
  }
}
