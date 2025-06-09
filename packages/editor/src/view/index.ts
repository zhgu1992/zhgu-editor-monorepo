import type { DocumentData, ElementChange, Transaction } from '@zhgu/type';
import { EElementChangeType } from '@zhgu/type';
import type { ElementData } from '@zhgu/data';
import { DataSync, DocExchange } from '@zhgu/data';
import type { IBaseNodeOrNodeModel, IBaseNode } from '../interface';
import { NodeFactory, Scene } from '../node';
import { RenderManager } from '../render';
import { EditorCanvasManager, EventManager } from '../event';
import { Picker } from '../picker';
import { ModeManager } from '../mode';
import { EHistoryEvent } from '../const';

export class View {
  private _documentExchange: DocExchange;
  private _syncClient: DataSync;
  private _scene = new Scene();
  private _renderManager: RenderManager;
  private _eventManager?: EventManager;
  private _canvas?: HTMLCanvasElement;
  private _canvasManager?: EditorCanvasManager;
  private _picker: Picker;
  private _modeManager: ModeManager;

  constructor() {
    this._renderManager = new RenderManager();
    this._picker = new Picker(this._renderManager, this._scene);
    this._modeManager = new ModeManager();
    this._documentExchange = new DocExchange();
    this._syncClient = new DataSync(this._documentExchange);
    this._syncClient.follower = {
      transactionFollower: (c: ElementChange): void => {
        this._scene.updateNodeOnChange(c);
      },
    };
  }

  async init(id?: string) {
    await this._renderManager.init(id);
    const canvas = this._renderManager.canvas;
    this._canvas = canvas;
    this._canvasManager = new EditorCanvasManager(canvas);
    // todo eventManager
    this._eventManager = new EventManager(canvas, this._renderManager);
  }

  public get modeManager() {
    return this._modeManager;
  }

  public get canvas() {
    return this._canvas;
  }

  public get viewPort() {
    return this._eventManager?.viewPort;
  }

  public get canvasManager() {
    return this._canvasManager;
  }

  public get eventManager() {
    return this._eventManager;
  }

  public get picker(): Picker {
    return this._picker;
  }

  public get documentExchange() {
    return this._documentExchange!;
  }

  public get syncClient() {
    return this._syncClient!;
  }

  public get renderManager() {
    return this._renderManager!;
  }

  public get scene() {
    return this._scene!;
  }

  public loadFile(documentData: DocumentData) {
    this.documentExchange.updateVersion(documentData.version);
    // @ts-ignore
    this._scene.buildTree(this.documentExchange, documentData, (elementData: ElementData): IBaseNodeOrNodeModel => {
      const node = NodeFactory.transform(elementData, this);
      return node;
    });
    // // 设置首页
    // this.scene.currentPageId = this.scene.firstPageNode.id;
  }

  public applyTransaction(transaction: Transaction) {
    this.syncClient.transactLocal(transaction);
    this.renderManager?.dirty();
  }

  public commitHistory() {
    this.syncClient.commitHistory();
  }

  public startCompressTransaction() {
    this.syncClient.startCompression();
  }

  public stopCompressTransaction() {
    this.syncClient.stopCompression();
  }

  public redoHistory() {
    const trans = this.syncClient.redoLocal();
    trans.forEach(v => {
      if (v.type === EElementChangeType.Delete) {
        const renderNode = this.renderManager.getRenderNode(v.id);
        renderNode?.destroy();
      }
    });
    this.processUpdate();
    this.eventManager!.emit(EHistoryEvent.UndoRedo, { data: this });
  }

  public undoHistory() {
    const trans = this.syncClient.undoLocal();
    trans.forEach(v => {
      if (v.type === EElementChangeType.Delete) {
        const renderNode = this.renderManager.getRenderNode(v.id);
        renderNode?.destroy();
      }
    });
    this.processUpdate();
    this.eventManager!.emit(EHistoryEvent.UndoRedo, { data: this });
  }

  /**
   * todo 暂时这样处理，后续需要将select记录到数据上,便于可以撤回到对应情况到select状态
   */
  processUpdate() {
    const currentSelectedNodes = this.eventManager!.selectedNodes;
    let isChanged = false;
    const result: IBaseNode[] = [];
    for (let i = 0, len = currentSelectedNodes.length; i < len; i++) {
      const node = currentSelectedNodes[i];
      const isExisted = this.scene.getNodeById(node.id);
      if (!isExisted) {
        isChanged = true;
      } else {
        result.push(node);
      }
    }
    if (isChanged) {
      this.eventManager!.selectedNodes = result;
    }
    this.renderManager?.dirty();
  }

  render() {}
}
