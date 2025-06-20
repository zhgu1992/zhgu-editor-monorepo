// @ts-ignore 暂时不处理
import './style.css';
import { Application, Graphics, Texture, Assets } from 'pixi.js';
// 引入render包的源码，这样就可以调试源码了
import { WebGLRender } from '../../src';

testHelloRect();
// 这里改造成基于数据结构去渲染
export async function testHelloRect() {
  // Create a new application
  const app = new Application();

  const parent = window.document.getElementById('app')!;

  // Initialize the application
  await app.init({ background: '#1099bb', resizeTo: parent });

  // Append the application canvas to the document body
  parent.appendChild(app.canvas);

  // 测试WebGLRender源码调试
  console.log('WebGLRender class:', WebGLRender);

  const graphics = new Graphics();
  // Rectangle
  graphics.rect(50, 50, 100, 100);
  graphics.fill(0xde3249);

  // Rectangle + line style 1
  graphics.rect(200, 50, 100, 100);
  graphics.fill(0x650a5a);
  graphics.stroke({ width: 2, color: 0xfeeb77 });

  // Rectangle + line style 2
  graphics.rect(350, 50, 100, 100);
  graphics.fill(0xc34288);
  graphics.stroke({ width: 10, color: 0xffbd01 });

  // // 将Canvas转换为Pixi纹理
  // const texture = Texture.from(canvas);

  const texture = await Assets.load('/public/vite.svg');
  // 创建Graphics并开始纹理填充
  graphics.rect(530, 50, 100, 100);
  graphics.fill(texture);

  // // Rectangle 2
  // graphics.rect(530, 50, 140, 100);
  // graphics.fill(0xaa4f08);
  // graphics.stroke({ width: 2, color: 0xffffff });

  app.stage.addChild(graphics);
}
