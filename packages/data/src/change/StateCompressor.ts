import type { ISavingTransaction } from '../interface';
import { isNullOrUndefined } from '../utils';

enum ECompressionType {
  Single = 'Single',
  Continuous = 'Continuous',
}

class StateCompressor {
  enabled: boolean = false;
  compressingTransaction: ISavingTransaction | null = null;
  compressionType: ECompressionType = ECompressionType.Single;

  get isIgnoreRevTransaction() {
    let isIgnoreRevTransaction = false;
    if (this.enabled) {
      if (this.compressionType === ECompressionType.Single) {
        isIgnoreRevTransaction = !isNullOrUndefined(this.compressingTransaction);
      } else {
        isIgnoreRevTransaction = false;
      }
    }
    return isIgnoreRevTransaction;
  }

  get compresOnceTransaction() {
    let compresOnceTransaction = false;
    if (this.enabled && this.compressionType === ECompressionType.Single) {
      compresOnceTransaction = isNullOrUndefined(this.compressingTransaction);
    }
    return compresOnceTransaction;
  }

  get compresAutoTransaction() {
    return this.enabled && this.compressionType === ECompressionType.Continuous;
  }

  get hasCompressingTransaction() {
    return !isNullOrUndefined(this.compressingTransaction);
  }

  setCompressingTransaction(savingTransaction: ISavingTransaction | null) {
    this.compressingTransaction = savingTransaction;
  }

  startCompressOnce() {
    this.enabled = true;
    this.compressingTransaction = null;
    this.compressionType = ECompressionType.Single;
  }

  startCompressAuto() {
    this.enabled = true;
    this.compressingTransaction = null;
    this.compressionType = ECompressionType.Continuous;
  }

  reset() {
    this.enabled = true;
    this.compressingTransaction = null;
    this.compressionType = ECompressionType.Single;
  }
}

export { StateCompressor, ECompressionType };
