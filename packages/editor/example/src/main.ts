// @ts-ignore
import './style.css'
import { View } from '../../src';
import { createHelloWorldFileData } from './mockFunc';
import { GUI } from 'dat.gui';


const view = new View();
await view.init();
const file = createHelloWorldFileData();
view.loadFile(file);
view.render();


const gui = new GUI();
const data = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    FillColor: [255, 255, 255],
    StrokeWeight: 0,
    StrokePaints: [255, 0, 0],
    undo: () => {
        view.undoHistory();
    },
    redo: () => {
        view.redoHistory();
    },
};
let _begin = true;
gui.addColor(data, 'FillColor').onChange((value) => {
    if(_begin){
        _begin = false;
        view.startCompressTransaction();
    }
    const node = view.scene.node('5');
    const diff = node.changeFillPaintColor({
        r: value[0], // 红色通道
        g: value[1], // 绿色通道
        b: value[2], // 蓝色通道
        a: 1// 透明度通道
    });
    view.applyTransaction([diff]);
    // console.log(node);
}).onFinishChange(() => {
    view.commitHistory();
    _begin = true;
});
gui.add(data, 'undo');
gui.add(data, 'redo');

// 下午先用cursor把代码改一版先提交
// 然后开始搞编辑器
// 然后把lint和tsconfig以及example工程再建一下，还有build的问题【这个可以先研究下】

