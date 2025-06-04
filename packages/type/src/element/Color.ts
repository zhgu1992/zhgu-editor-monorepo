type RGBAColor = {
  r: number; // 红色通道
  g: number; // 绿色通道
  b: number; // 蓝色通道
  a: number; // 透明度通道
};

// RGB颜色类型
type RGBColor = {
  r: number; // 红色通道
  g: number; // 绿色通道
  b: number; // 蓝色通道
  a: number; // 透明度通道
};

// HSL颜色类型
type HSLColor = {
  h: number; // 色相
  s: number; // 饱和度
  l: number; // 亮度
};

// HSLA颜色类型
type HSLAColor = {
  h: number; // 色相
  s: number; // 饱和度
  l: number; // 亮度
  a: number; // 透明度
};

type ColorStop = {
  color: RGBAColor;
  position: number;
};

export { RGBAColor, RGBColor, HSLColor, HSLAColor, ColorStop };
