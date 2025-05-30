import type { DocumentData, Transaction, ElementChange } from '@zhgu/type';
import type { ElementData } from '@zhgu/data';
import { DocExchange, DataSync } from '@zhgu/data';
import type { IBaseNodeOrNodeModel } from '../interface';
import { Scene, NodeFactory } from '../node';
import { RenderManager } from '../render';


export class View {
    private _documentExchange: DocExchange;
    private _syncClient: DataSync;
    private _scene = new Scene();
    private _renderManager = new RenderManager();

    constructor() {
        this._documentExchange = new DocExchange();
        this._syncClient = new DataSync(this._documentExchange);
        this._syncClient.follower = {
            transactionFollower: (c: ElementChange): void => {
                this._scene.updateNodeOnChange(c);
            }
        };
    }

    async init() {
        await this._renderManager.init();
    }

    public get documentExchange() {
        return this._documentExchange!;
    }

    public get syncClient() {
        return this._syncClient!;
    }

    public get renderManager(){
        return this._renderManager!;
    }

    public get scene(){
        return this._scene!;
    }

    public loadFile(documentData: DocumentData) {
        this.documentExchange.updateVersion(documentData.version);
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
        this.syncClient.redoLocal();
        this.processUpdate();
        // this.eventManager.emit(EHistoryEvent.UndoRedo, {data: this});
    }

    public undoHistory() {
        this.syncClient.undoLocal();
        this.processUpdate();
        // this.eventManager.emit(EHistoryEvent.UndoRedo, {data: this});
    }

    /**
     * todo 暂时这样处理，后续需要将select记录到数据上,便于可以撤回到对应情况到select状态
     * @zhuguang
     */
    processUpdate(){
        // const currentSelectedNodes = this.eventManager.selectedNodes;
        // let isChanged = false;
        // const result: IBaseNode[] = [];
        // for(let i = 0, len = currentSelectedNodes.length; i < len; i++){
        //     const node = currentSelectedNodes[i];
        //     const isExisted = this.scene.getNodeById(node.id);
        //     if(!isExisted){
        //         isChanged = true;
        //     }else{
        //         result.push(node);
        //     }
        // }
        // if(isChanged){
        //     this.eventManager.selectedNodes = result;
        // }
        this.renderManager?.dirty();
    }

    render(){
        // this._renderManager?.render(this._scene);
    }
}