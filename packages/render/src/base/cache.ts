/**
 * 惰性缓存
 *
 * 标脏后，拿值时才会进行计算，尽可能在旧值基础上进行原地修改，避免GC
 */
export class LazyCache<T> {
  protected _value: T;

  protected _dirty: boolean;

  protected _compute: (old: T) => T;

  constructor(compute: (old: T) => T, initial: T, dirty = true) {
    this._compute = compute;
    this._value = initial;
    this._dirty = dirty;
  }

  value(): Readonly<T> {
    if (!this._dirty && this._value !== undefined) {
      return this._value;
    }
    this._value = this._compute(this._value);
    this._dirty = false;
    return this._value;
  }

  update() {
    this._dirty = true;
  }
}
