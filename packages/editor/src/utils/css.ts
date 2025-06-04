const appendCssToDom = function (cssString: string) {
  // 创建一个 <style> 元素
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';

  styleElement.appendChild(document.createTextNode(cssString));

  // 将 <style> 元素添加到 <head> 中
  document.head.appendChild(styleElement);
};

export {
  appendCssToDom,
};