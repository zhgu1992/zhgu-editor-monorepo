import { mat3, vec2 } from 'gl-matrix';

import { LazyCache } from './cache';

export class Viewport {
  /**
   * The pixel size of canvas.
   */
  protected _size = vec2.create();

  /**
   * The zoom of canvas.
   */
  protected _zoom = 1.0;

  /**
   * The left top position of canvas.
   */
  protected _position = vec2.create();

  /**
   * Lazy cache of the view matrix of this viewport.
   */
  protected _matrix = new LazyCache(out => {
    /**
     * world space => screen space
     * -----------------------------------------------------------------
     * world_pos = scale(zoom * dpr) x translate(position) x screen_pos
     */
    const canvas = this.canvas;
    const [x, y] = this._position;
    const [w, h] = [canvas.width, canvas.height];
    const zoom = this._zoom;
    const dpr = devicePixelRatio;
    const scaled = zoom * dpr;
    mat3.identity(out);
    mat3.mul(out, mat3.fromTranslation(mat3.create(), [-x, -y]), out);
    mat3.mul(out, mat3.fromScaling(mat3.create(), [scaled, scaled]), out);

    /**
     * screen space => clip space [-1, 1]
     * -----------------------------------------------------------------
     * clip_pos = translate(-1, -1) x scale(2 / w, -2 / h) x world_pos
     */
    // mat3.mul(out, mat3.fromScaling(mat3.create(), [2 / w, -2 / h]), out);
    mat3.mul(out, mat3.fromTranslation(mat3.create(), [1, 1]), out);
    return out;
  }, mat3.create());

  protected _invMatrix = new LazyCache(out => {
    mat3.invert(out, this.matrix);
    return out;
  }, mat3.create());

  get zoom() {
    return this._zoom;
  }

  get position() {
    return [this._position[0], this._position[1]];
  }

  get matrix() {
    return this._matrix.value() as Float32Array;
  }

  get invMatrix() {
    return this._invMatrix.value() as Float32Array;
  }

  constructor(protected canvas: HTMLCanvasElement) {}

  checkResize() {
    const canvas = this.canvas;
    const parent = canvas.parentElement!;
    const screenWidth = parent.clientWidth;
    const screenHeight = parent.clientHeight;
    const dpr = window.devicePixelRatio;
    const pixelWidth = Math.round(screenWidth * dpr);
    const pixelHeight = Math.round(screenHeight * dpr);
    if (pixelWidth === this._size[0] && pixelHeight === this._size[1]) {
      return false;
    }
    canvas.style.width = String(screenWidth) + 'px';
    canvas.style.height = String(screenHeight) + 'px';
    canvas.width = this._size[0] = pixelWidth;
    canvas.height = this._size[1] = pixelHeight;
    this._matrix.update();
    return true;
  }

  /**
   * Set the zoom value of canvas.
   * @param zoom
   * @returns Return true if the data has been modified, false otherwise.
   */
  setZoom(zoom: number): LazyCache<mat3> {
    if (this._zoom !== zoom) {
      this._zoom = zoom;
      this._matrix.update();
    }
    return this._matrix;
  }

  /**
   * Set the left top position of canvas.
   * @param x
   * @param y
   * @returns Return true if the data has been modified, false otherwise.
   */
  setPosition(x: number, y: number): LazyCache<mat3> {
    const arr = [x, y] as const;
    if (!vec2.equals(this._position, arr)) {
      vec2.copy(this._position, arr);
      this._matrix.update();
    }
    return this._matrix;
  }

  /**
   * Screen position to absolute.
   * @param x
   * @param y
   */
  screenToAbsolute(x: number, y: number) {
    const zoom = this._zoom;
    const pos = this._position;
    const result = [x / zoom + pos[0], y / zoom + pos[1]];
    return result;
  }

  /**
   * Screen position to absolute.
   * @param x
   * @param y
   */
  absoluteToScreen(x: number, y: number) {
    const zoom = this._zoom;
    const pos = this._position;
    const result = [(x - pos[0]) * zoom, (y - pos[1]) * zoom];
    return result;
  }
}
