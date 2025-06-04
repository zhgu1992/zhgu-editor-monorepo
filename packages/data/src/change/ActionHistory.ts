import type { Transaction } from '@zhgu/type';

interface HistoryItem {
  transaction: Transaction;
}

type LastHistoryItem = HistoryItem | null;

interface ActionHistoryState {
  readonly undos: HistoryItem[];
  readonly redos: HistoryItem[];
  lastUndoRedoItem: LastHistoryItem;
  maxHistorySteps: number;
}

class ActionHistory {
  private maxHistorySteps: number = 200;
  readonly undos: HistoryItem[] = [];
  readonly redos: HistoryItem[] = [];
  public lastUndoRedoItem: LastHistoryItem = null;

  constructor(maxHistorySteps = 200) {
    this.maxHistorySteps = maxHistorySteps;
  }

  getLastUndoRedoItem(): LastHistoryItem {
    return this.lastUndoRedoItem;
  }

  setLastUndoRedoItem(historyItem: LastHistoryItem) {
    this.lastUndoRedoItem = historyItem;
  }

  getMaxHistorySteps(): number {
    return this.maxHistorySteps;
  }

  setMaxHistorySteps(maxHistorySteps: number) {
    this.maxHistorySteps = maxHistorySteps;
  }

  getActionHistoryState(): ActionHistoryState {
    return {
      lastUndoRedoItem: this.lastUndoRedoItem,
      maxHistorySteps: this.maxHistorySteps,
      undos: this.undos,
      redos: this.redos,
    };
  }

  canUndo() {
    return this.undos.length > 0;
  }

  canRedo() {
    return this.redos.length > 0;
  }
}

export { ActionHistory };
export type { HistoryItem, LastHistoryItem, ActionHistoryState };
