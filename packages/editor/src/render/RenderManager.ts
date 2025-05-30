import {Scene} from '../node';
import { WebGLRender } from '@zhgu/render';

export class RenderManager extends WebGLRender {
    private _dirty = true;
    private _forceRender = false;
    // private groupKeys = [ERenderGroupKey.Render, ERenderGroupKey.Name, ERenderGroupKey.Select, ERenderGroupKey.Hover];

    dirty(){

    }
    // @ts-ignore
    render(scene: Scene){
        // testHelloRect();
    }
}