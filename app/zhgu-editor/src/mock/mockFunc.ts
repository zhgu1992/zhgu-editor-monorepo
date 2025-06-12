import {
  testInternalPage,
  testDocument,
  testPage,
  testRectangle,
  buildFileDataFromDocument,
  testFrame,
} from '@zhgu/data';
import type { DocumentData } from '@zhgu/type';
import { EPaintType } from '@zhgu/type';

const createCanvas = () => {
  // const canvas = document.createElement('canvas');
  // canvas.width = 256;
  // canvas.height = 256;
  const canvas = new OffscreenCanvas(256, 256);
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  // 设置字体样式
  ctx.font = '20px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  // 填充文本
  ctx.fillText('Hello World', 50, 50);
  return canvas.transferToImageBitmap();
};

// const imagePaintProps = PaintProps.getDefaultImagePaintProps();

const createHelloWorldFileData = () => {
  const documentElement = testDocument(0, [
    // testInternalPage(1, []),
    testPage(6, [
      // testFrame(3, [], {}),
      testRectangle(5, {
        strokeWeight: 10,
        strokePaints: [
          {
            type: EPaintType.Solid,
            opacity: 1,
            isEnabled: true,
            color: { r: 217, g: 0, b: 0, a: 1 },
          },
        ],
        fillPaints: [
          {
            type: EPaintType.Solid,
            opacity: 1,
            isEnabled: false,
            color: { r: 217, g: 217, b: 0, a: 1 },
          },
        ],
        transform: {
          m00: 1,
          m01: 0,
          m02: 130,
          m10: 0,
          m11: 1,
          m12: 100,
        },
      }),
      testRectangle(9, {
        transform: {
          m00: 1,
          m01: 0,
          m02: 100,
          m10: 0,
          m11: 1,
          m12: 150,
        },
        strokeWeight: 5,
        strokePaints: [
          {
            type: EPaintType.Solid,
            opacity: 1,
            isEnabled: true,
            color: { r: 155, g: 155, b: 155, a: 1 },
          },
        ],
      }),
      // testRectangle(7, {
      //   transform: {
      //     m00: 1,
      //     m01: 0,
      //     m02: 260,
      //     m10: 0,
      //     m11: 1,
      //     m12: 150,
      //   },
      //   fillPaints: [
      //     {
      //       type: EPaintType.Image,
      //       image: createCanvas(),
      //       imageScaleMode: 'FIT',
      //       rotation: 0,
      //     },
      //   ],
      // }),
    ]),
  ]);
  // eslint-disable-next-line no-console
  console.log('documentElement', documentElement);
  const elements = buildFileDataFromDocument(documentElement);
  const documentData: DocumentData = {
    version: 0,
    elements,
    blobs: [],
  };
  return documentData;
};

export { createHelloWorldFileData };
