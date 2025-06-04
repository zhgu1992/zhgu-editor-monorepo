// @ts-ignore
import './style.css';
import { Editor } from '../../src';
import { createHelloWorldFileData } from './mockFunc';
import { GUI } from 'dat.gui';

(async function () {
  const editor = new Editor();
  await editor.init();
  const file = createHelloWorldFileData();
  editor.loadFile(file);
  editor.render();
  editor.initEditorMode();
  // @ts-ignore
  window.editor = editor;

  const gui = new GUI();
  const data = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    FillColor: [255, 255, 255],
    StrokeWeight: 0,
    StrokePaints: [255, 0, 0],
    debugArea: false,
    undo: () => {
      editor.undoHistory();
    },
    redo: () => {
      editor.redoHistory();
    },
  };
  let _begin = true;
  gui
    .addColor(data, 'FillColor')
    .onChange(value => {
      if (_begin) {
        _begin = false;
        editor.startCompressTransaction();
      }
      const node = editor.scene.node('5');
      const diff = node.changeFillPaintColor({
        r: value[0], // 红色通道
        g: value[1], // 绿色通道
        b: value[2], // 蓝色通道
        a: 1, // 透明度通道
      });
      editor.applyTransaction([diff]);
      // console.log(node);
    })
    .onFinishChange(() => {
      editor.commitHistory();
      _begin = true;
    });
  gui.add(data, 'undo');
  gui.add(data, 'redo');

  gui.add(data, 'debugArea').onChange(v => {
    // 开启热区调试模式
    editor.getCurrentState()?.showArea(v);
  });
})();

// 使用cursor去修改代码，然后提交一版 【明天上午整体看看，将其完成】

// 然后把lint\tsconfig\prettier以及example工程再建一下，还有build的问题【这个可以先研究下】 【明天完成】
