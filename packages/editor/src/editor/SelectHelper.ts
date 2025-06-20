import type { IBaseNode, IMetaData, IModuleMetaData } from '../interface';
import { EMPTY_SELECTION_META_DATA } from '../interface';
import { DEFAULT_META_DATA, DEFAULT_MODULE_META_DATA } from '../interface';
import { cloneDeep } from 'lodash-es';
import type { ElementChange, ISizeProps, XYPos } from '@zhgu/type';
import { getMaxAABB, getObbPoints } from '@zhgu/data';
/**
 * 帮助处理选中对象
 */
export class SelectHelper {
  private _moduleMetaData: IModuleMetaData = cloneDeep(DEFAULT_MODULE_META_DATA);
  private _metaData: IMetaData = cloneDeep(DEFAULT_META_DATA);
  getMetaDataByNodes(nodes: IBaseNode[]) {
    if (nodes.length === 0) {
      return {
        moduleConfig: EMPTY_SELECTION_META_DATA,
        metaDataConfig: DEFAULT_META_DATA,
      };
    }
    if (nodes.length === 1) {
      return {
        metaDataConfig: nodes[0].getMetaData(),
        moduleConfig: nodes[0].getModuleConfig(),
      };
    }

    this.resetModuleData();
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const moduleData = node.getModuleConfig();
      // 处理moduleData
      Object.keys(moduleData).forEach(key => {
        // @ts-ignore
        if (moduleData[key] === 0) {
          // @ts-ignore
          this._moduleMetaData[key] = 0;
        }
      });
    }
    // @ts-ignore
    if (this._moduleMetaData.baseAttribute === 1) {
      Object.keys(this._metaData).forEach(key => {
        // @ts-ignore
        this._metaData[key].mixed = !this.isPropertyUniform(nodes, key);
        // todo isEnable isVisible 一个有这个属性一个没有这些先不处理
      });
    }

    return {
      metaDataConfig: this._metaData,
      moduleConfig: this._moduleMetaData,
    };
  }

  changeAbsolutePosition(nodes: IBaseNode[], pos: XYPos) {
    const aabb = getMaxAABB(nodes);
    const diffX = pos.x - aabb.x;
    const diffY = pos.y - aabb.y;
    const transactions: ElementChange[] = [];
    nodes.forEach((node, i) => {
      const { x: beginX, y: beginY } = node;
      const pos = {
        x: beginX + diffX,
        y: beginY + diffY,
      };
      const change = node.changeAbsolutePos(pos);
      transactions.push(change);
    });
    return transactions;
  }

  changeSize(nodes: IBaseNode[], size: Partial<ISizeProps>) {
    const transactions: ElementChange[] = [];
    nodes.forEach(node => {
      const change = node.changeSize(size);
      transactions.push(change);
    });
    return transactions;
  }

  changeRotation(nodes: IBaseNode[], rotation: number) {
    const transactions: ElementChange[] = [];
    nodes.forEach(node => {
      const deltaRotation = rotation - node.rotation;
      const change = node.changeRotation(deltaRotation);
      transactions.push(change);
    });
    return transactions;
  }

  private resetModuleData() {
    Object.keys(this._moduleMetaData).forEach(key => {
      // @ts-ignore
      this._moduleMetaData[key] = DEFAULT_MODULE_META_DATA[key];
    });
  }

  private isPropertyUniform(arr: IBaseNode[], prop: string) {
    if (arr.length === 0) return true; // 空数组视为相同
    // @ts-ignore
    const firstValue = arr[0][prop];
    // @ts-ignore
    return arr.every(item => item[prop] === firstValue);
  }
}
