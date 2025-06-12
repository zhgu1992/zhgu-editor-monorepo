import React, { useState, useEffect } from 'react';
import Toolbar from './components/Toolbar';
import TopBar from './components/TopBar';
import LeftPanel from './components/LeftPanel';
import Canvas from './components/Canvas';
import RightPanel from './components/RightPanel';
import ShortcutHelp from './components/ShortcutHelp';
import StatusBar from './components/StatusBar';
import { useEditorStore, EditorInitState } from './store';
import './App.css';

function App() {
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);
  const { createEditor, initState, initError, setCurrentTool, toggleDebugMode } = useEditorStore();

  // 第一阶段初始化：创建editor实例
  useEffect(() => {
    createEditor();
  }, [createEditor]);

  // 全局快捷键处理
  useEffect(() => {
    // 只在editor就绪后才注册快捷键
    if (initState !== EditorInitState.READY) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果在输入框中，不处理快捷键
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // 处理快捷键
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcutHelp(true);
      }

      // L键 切换调试模式
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        toggleDebugMode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [initState, setCurrentTool, toggleDebugMode]);

  // 显示不同的加载状态
  if (initState === EditorInitState.CREATING) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">正在创建编辑器实例...</div>
        </div>
      </div>
    );
  }

  if (initState === EditorInitState.ERROR) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">编辑器初始化失败</div>
          <div className="text-gray-600 text-sm mb-4">{initError}</div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            重新加载页面
          </button>
        </div>
      </div>
    );
  }

  // 当状态为WAITING_CANVAS或READY时，渲染UI组件
  // WAITING_CANVAS状态下需要渲染Canvas组件来触发第二阶段初始化
  const isUIReady = initState === EditorInitState.READY;

  return (
    <div className="editor-ui h-screen w-screen flex flex-col bg-gray-50 fixed inset-0">
      {/* 顶部菜单栏 */}
      <TopBar />

      {/* 主要内容区域 */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* 最左侧：垂直工具栏 */}
        <Toolbar />

        {/* 左侧面板 */}
        <LeftPanel />

        {/* 中央画布区域 - 负责触发第二阶段初始化 */}
        <Canvas />

        {/* 右侧属性面板 */}
        <RightPanel onShowShortcutHelp={() => setShowShortcutHelp(true)} />
      </div>

      {/* 底部状态栏 */}
      <StatusBar />

      {/* 快捷键帮助 - 只在完全就绪时显示 */}
      {isUIReady && <ShortcutHelp show={showShortcutHelp} onClose={() => setShowShortcutHelp(false)} />}
    </div>
  );
}

export default App;
