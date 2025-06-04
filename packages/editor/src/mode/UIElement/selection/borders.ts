import type { AllDirection } from '../../../utils';
import { BaseResizeEventArea } from './baseSelectPoint';

/**
 * 左边事件热区
 */
export class LBorderResizeEventArea extends BaseResizeEventArea {
  protected _resizeType: AllDirection = 'l';
  get w() {
    return this.borderW;
  }

  get h() {
    return this.collection.h;
  }

  get diffXY() {
    return {
      x: -this.getScreenPixel(6),
      y: 0,
    };
  }
}


export class RBorderResizeEventArea extends BaseResizeEventArea {
  protected _resizeType: AllDirection = 'r';

  get w() {
    return this.borderW;
  }

  get h() {
    return this.collection.h;
  }

  get diffXY() {
    const { screenW, screenH } = this;
    let offset = 6;
    if (screenW < 24 || screenH < 24) {
      offset = 0;
    } else if (screenW < 60) {
      offset = 6 - Math.round((60 - screenW) / 6);
    }

    return {
      x: this.collection.w - this.getScreenPixel(offset),
      y: 0,
    };
  }
}

export class TBorderResizeEventArea extends BaseResizeEventArea {
  protected _resizeType: AllDirection = 't';

  get w() {
    return this.collection.w;
  }

  get h() {
    return this.borderH;
  }

  get diffXY() {
    return {
      x: 0,
      y: -this.getScreenPixel(6),
    };
  }
}

export class BBorderResizeEventArea extends BaseResizeEventArea {
  protected _resizeType: AllDirection = 'b';
  get w() {
    return this.collection.w;
  }

  get screenW() {
    return this.getPixelScreen(this.w) as number;
  }

  get h() {
    return this.borderH as number;
  }

  get diffXY() {
    const { screenH, screenW } = this;
    let offset = 6;
    if (screenH < 24 || screenW < 24) {
      offset = 0;
    } else if (screenH < 60) {
      offset = 6 - Math.round((60 - screenH) / 6);
    }

    return {
      x: 0,
      y: this.collection.h - this.getScreenPixel(offset),
    };
  }
}




