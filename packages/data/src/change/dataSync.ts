import type { ISyncClientFollower, ISavingTransaction } from '../interface';
import type { ElementChange, Transaction } from '@zhgu/type';
import type { DocExchange } from './DocExchange';
import { isNullOrUndefined } from '../utils';
import { mergeTransaction } from '../dataUtil';
import { ActionHistory } from './ActionHistory';
import { StateCompressor } from './StateCompressor';

class PendingChange implements ISavingTransaction {
  constructor(
    readonly transaction: Transaction,
    readonly reverse: Transaction,
    public time = -1
  ) {}
}

class DataSync {
  private stateCompressor: StateCompressor = new StateCompressor();
  public docExchange: DocExchange;
  public follower?: ISyncClientFollower;
  private readonly pendingChanges: PendingChange[] = [];
  public actionHistory: ActionHistory = new ActionHistory();

  constructor(docExchange: DocExchange) {
    this.docExchange = docExchange;
  }

  unsavedChanges(): number {
    return this.pendingChanges.length;
  }

  //@ts-ignore
  protected addNewPendingChange(change: PendingChange) {
    const transactionSaving = this?.follower?.transactionSaving;
    transactionSaving && transactionSaving();
  }

  private processTransaction(transaction: Transaction, isIgnoreRevTransaction = false) {
    return this.docExchange.tryTransact(transaction, this.follower?.transactionFollower, isIgnoreRevTransaction);
  }

  transactLocal(transaction: Transaction) {
    const isIgnoreRevTransaction = this.stateCompressor.isIgnoreRevTransaction;
    const [reverse] = this.processTransaction(transaction, isIgnoreRevTransaction)!;
    let pendingChange = new PendingChange(transaction, reverse);

    if (this.stateCompressor.enabled) {
      if (this.stateCompressor.compresOnceTransaction) {
        this.stateCompressor.setCompressingTransaction(pendingChange);
        const historyItem = { transaction: reverse };
        this.actionHistory.setLastUndoRedoItem(historyItem);
      }

      if (this.stateCompressor.compresAutoTransaction) {
        let historyItem: any = null;
        if (this.stateCompressor.hasCompressingTransaction) {
          let newTransaction: Transaction = transaction;
          let newReverse: Transaction = reverse;
          const compressingTransaction = this.stateCompressor.compressingTransaction;
          newTransaction = mergeTransaction(compressingTransaction!.transaction, transaction);
          newReverse = mergeTransaction(reverse, compressingTransaction!.reverse);
          pendingChange = new PendingChange(newTransaction, newReverse);
          this.stateCompressor.setCompressingTransaction(pendingChange);

          const lastHistoryItem = this.actionHistory.getLastUndoRedoItem();
          historyItem = { transaction: mergeTransaction(reverse, lastHistoryItem!.transaction) };
        } else {
          this.stateCompressor.setCompressingTransaction(pendingChange);
          historyItem = { transaction: reverse };
        }
        this.actionHistory.setLastUndoRedoItem(historyItem);
      }
    } else {
      const historyItem = { transaction: reverse };
      this.actionHistory.setLastUndoRedoItem(historyItem);
    }

    this.addNewPendingChange(pendingChange);
  }

  startCompression() {
    this.stateCompressor.startCompressOnce();
  }

  stopCompression() {
    this.commitHistory();
  }

  resetCompression() {
    this.stateCompressor.reset();
  }

  commitHistory() {
    const lastHistoryItem = this.actionHistory.getLastUndoRedoItem();
    if (!isNullOrUndefined(lastHistoryItem)) {
      this.actionHistory.undos.push(lastHistoryItem!);
    }
    this.resetCompression();
    this.actionHistory.setLastUndoRedoItem(null);
  }

  undoLocal(): ElementChange[] {
    let currentRes: ElementChange[] = [];
    this.resetCompression();
    if (this.actionHistory.canUndo()) {
      const trans = this.actionHistory.undos.pop()!;
      currentRes = trans.transaction;
      const [reverse] = this.processTransaction(trans.transaction) ?? [[]];
      const redoItem = { transaction: reverse };
      this.addNewPendingChange(new PendingChange(trans.transaction, reverse));
      this.actionHistory.redos.push(redoItem);
    }
    return currentRes;
  }

  redoLocal(): ElementChange[] {
    let currentRes: ElementChange[] = [];
    this.resetCompression();
    if (this.actionHistory.canRedo()) {
      const trans = this.actionHistory.redos.pop()!;
      currentRes = trans.transaction;
      const [reverse] = this.processTransaction(trans.transaction) ?? [[]];
      const undoItem = { transaction: reverse };
      this.addNewPendingChange(new PendingChange(trans.transaction, reverse));
      this.actionHistory.undos.push(undoItem);
    }
    return currentRes;
  }
}

export { DataSync };
