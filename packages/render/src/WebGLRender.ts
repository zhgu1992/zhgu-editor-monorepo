import {Application, Graphics} from "pixi.js";
import { INodeModel } from '@zhgu/data';
import { ISolidPaintProps, RenderCategorySet, AllRenderCategorySet } from '@zhgu/type';


export class WebGLRender {
    private _app= new Application();
    async init(id: string = 'app') {
        // Create a new application
        const app = this._app;
        const parent = window.document.getElementById(id)!;
        // Initialize the application
        await app.init({ background: '#1099bb', resizeTo:  parent});

        // Append the application canvas to the document body
        parent.appendChild(app.canvas);
    }
    createRenderNode(data: INodeModel){
        const props = data;
        if(props.type  === 'Document' || props.type === 'Page'){
            return null;
        }

        console.log(props);
        const graphics = new Graphics();
        this._app.stage.addChild(graphics);
        this.updateRenderNode(graphics, data);
        return graphics;
    }

    processColor(fill: ISolidPaintProps){
        const color = fill.color;
        return [color.r/255, color.g/255, color.b/255, color.a];
    }

    /**
     * todo 后续再看看pixi，感觉性能不行，可能需要换three.js
     * @param graphics
     * @param props
     * @param keySet
     */
    updateRenderNode(graphics: Graphics, props: INodeModel){
        graphics.clear();
        // Rectangle
        graphics.rect(props.x, props.y, props.w, props.h);
        const fill = props.fillPaints[0] as ISolidPaintProps;
        graphics.fill(this.processColor(fill));
        const strokes = props.strokePaints;
        if(strokes.length > 0){
            const width = props.strokeWeight;
            const stroke = strokes[0] as ISolidPaintProps;
            graphics.stroke({width, color:this.processColor(stroke)});
        }
        // keySet.forEach(key => {
        //     if(key === 'transform'){
        //         // Rectangle
        //         graphics.rect(props.x, props.y, props.w, props.h);
        //     }else if(key === 'fillPaints'){
        //         const fill = props.fillPaints[0] as ISolidPaintProps;
        //         graphics.fill(this.processColor(fill));
        //     }else if(key === 'stroke'){
        //         const strokes = props.strokePaints;
        //         if(strokes.length > 0){
        //             const width = props.strokeWeight;
        //             const stroke = strokes[0] as ISolidPaintProps;
        //             graphics.stroke({width, color:this.processColor(stroke)});
        //         }
        //     }
        // });
    }
}