import { isNull, isUndefined } from 'lodash-es';

const isNullOrUndefined = (value: any): boolean => {
  return isNull(value) || isUndefined(value);
};


const binarySearchParentPosition = (list: readonly any[], value: string) => {
  let first = 0;
  let last = list.length - 1;
  let position = -1;
  let found = false;
  let middle;

  if (list.length === 0) {
    found = true;
    position = 0;
    return position;
  }

  if (list[first].parentIndex.position > value) {
    found = true;
    position = 0;
    return position;
  }
  if (list[last].parentIndex.position < value) {
    found = true;
    position = list.length;
    return position;
  }

  while (!found && first <= last) {
    middle = Math.floor((first + last) / 2);
    if (list[middle].parentIndex.position === value) {
      found = true;
      position = middle;
    } else if (list[middle].parentIndex.position < value) {
      if (middle + 1 <= last && list[middle + 1].parentIndex.position > value) {
        found = true;
        position = middle + 1;
      } else {
        last = middle - 1;
      }
    } else {
      if (middle - 1 >= first && list[middle - 1].parentIndex.position < value) {
        found = true;
        position = middle - 1;
      } else {
        first = middle + 1;
      }
    }
  }
  return position;
};

const comparator = (a: any, b: any): number => {
  const z = b.z - a.z;
  if (z !== 0) {
    return z;
  } else {
    return a.id < b.id ? -1 : Number(a.id > b.id);
  }
};

const orderByPosition = (
  { parentIndex: { position: a } }: any,
  { parentIndex: { position: b } }: any,
): any => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

export {
  isNullOrUndefined,
  binarySearchParentPosition,
  comparator,
  orderByPosition,
};

/**
 * [对某个数值设置区间]
 * @param {number} value [需要被设置区间的值]
 * @param {number} min   [最小值]
 * @param {number} max   [最大值]
 * @return {number}      [被限定后的值]
 */
export function setRegion(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function getTwoDecimal(_num: number | string) {
  if (_num === undefined) {
    return _num;
  }
  return Math.round((_num as number) * 100) / 100;
}

/**
 * 误差范围内值是否相等
 * @param {number} number 比较值
 * @param {number} theNumber   被比较值
 * @param {number} err   误差范围，默认0.001
 * @return {boolean} 是否相等
 */
export function isEqualNumber(number: number, theNumber: number, err: number = 0.001) {
  return Math.abs(theNumber - number) <= err;
}


export * from './convert.ts';
export * from './points.ts';
export * from './rotate.ts';
export * from './scale.ts';
export * from './uuid.ts';
export * from './system';
export * from './color';
export * from './bounding';
export * from './matrix';
export * from './collide';
