import type { Mode } from './mode';
/**
 * 定义模式，后续编辑器可以加载不同的模式，目前只有编辑模式
 */
export class ModeManager {
  private _cache: Map<string, Mode> = new Map();
  currentMode: Mode|null = null;

  registerMode(mode: Mode){
    this._cache.set(mode.id, mode);
  }

  changeMode(modeId: string){
    const mode = this.getMode(modeId);
    if(mode){
      this.currentMode?.exit();
      this.currentMode = mode;
      mode.enter();
    }
  }

  getMode(modeId: string){
    return this._cache.get(modeId);
  }

  destroy(){
    this._cache.forEach((mode: Mode) => {
      mode.exit();
    });
    this._cache.clear();
  }
}
