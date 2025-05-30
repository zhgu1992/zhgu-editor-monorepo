import type { ElementChange, Transaction } from '@zhgu/type';
import { EElementChangeType } from '@zhgu/type';

const noopElementChange = (): ElementChange => {
  return {
    type: EElementChangeType.Props,
    id: '',
    props: {},
  };
};

const harmlessElementChange = (change: ElementChange): boolean => {
  return change.type === EElementChangeType.Props && change.props.type === undefined;
};

const interchangeableElementChange = (base: ElementChange, more: ElementChange): boolean => {
  if (base.type === EElementChangeType.Props && more.type === EElementChangeType.Props) {
    if (base.id !== more.id) {
      return base.props.type === undefined && more.props.type === undefined;
    } else {
      return false;
    }
  } else if (harmlessElementChange(base)) {
    return true;
  } else if (harmlessElementChange(more)) {
    return true;
  } else {
    return false;
  }
};

const coversElementChange = (base: ElementChange, more: ElementChange): boolean => {
  if (base.type === EElementChangeType.Props && more.type === EElementChangeType.Props) {
    if (base.id === more.id) {
      for (let baseKey in base.props) {
        if ((more.props as any)[baseKey] === undefined) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  } else if (base.type === EElementChangeType.Delete && more.type === EElementChangeType.Delete) {
    return base.id === more.id;
  } else if (base.type === EElementChangeType.Props && more.type === EElementChangeType.Delete) {
    return base.id === more.id;
  } else {
    return false;
  }
};

const fastMergeTransaction = (base: Transaction, more: Transaction): number => {
  let i = 0;
  for (; i < base.length && i < more.length; i++) {
    if (!coversElementChange(base[i], more[i])) {
      break;
    }
  }
  return i;
};

const mergeTransaction = (base: Transaction, more: Transaction): Transaction => {
  let i = fastMergeTransaction(base, more);
  if (i === base.length) {
    return more;
  } else {
    const bs: ElementChange[] = [];
    for (; i < base.length; i++) {
      const b = base[i];
      if (!more.some((m) => coversElementChange(b, m))) {
        bs.push(b);
      }
    }
    bs.push(...more);
    return bs;
  }
};

const interchangeableTransaction = (a: Transaction, b: Transaction): boolean => {
  return a.every((aa) => b.every((bb) => interchangeableElementChange(aa, bb)));
};

export {
  noopElementChange,
  harmlessElementChange,
  interchangeableElementChange,
  coversElementChange,
  fastMergeTransaction,
  mergeTransaction,
  interchangeableTransaction,
};
