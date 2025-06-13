/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * 日志配置接口
 */
interface LogConfig {
  /**
   * 是否启用日志
   */
  enabled: boolean;
  /**
   * 最小日志级别
   */
  minLevel: LogLevel;
  /**
   * 是否显示时间戳
   */
  showTimestamp: boolean;
  /**
   * 是否显示日志级别
   */
  showLevel: boolean;
  /**
   * 是否显示调用位置
   */
  showCaller: boolean;
}

/**
 * 默认配置
 */
const defaultConfig: LogConfig = {
  // @ts-ignore
  enabled: process.env.NODE_ENV !== 'production',
  minLevel: LogLevel.DEBUG,
  showTimestamp: true,
  showLevel: true,
  showCaller: true,
};

/**
 * 当前配置
 */
let currentConfig: LogConfig = { ...defaultConfig };

/**
 * 获取调用位置信息
 */
const getCallerInfo = (): string => {
  const stack = new Error().stack;
  if (!stack) return '';

  const lines = stack.split('\n');
  // 跳过 Error 和 getCallerInfo 的堆栈行
  const callerLine = lines[3];
  if (!callerLine) return '';

  // 提取文件名和行号
  const match = callerLine.match(/at\s+(?:\w+\s+\()?(?:(?:file|http|https):\/\/)?([^:]+):(\d+):(\d+)/);
  if (!match) return '';

  const [, file, line, column] = match;
  const fileName = file.split('/').pop()?.split('\\').pop() || file;
  return `[${fileName}:${line}]`;
};

/**
 * 格式化日志消息
 */
const formatMessage = (level: LogLevel, message: string): string => {
  const parts: string[] = [];

  if (currentConfig.showTimestamp) {
    parts.push(`[${new Date().toISOString()}]`);
  }

  if (currentConfig.showLevel) {
    parts.push(`[${level.toUpperCase()}]`);
  }

  if (currentConfig.showCaller) {
    parts.push(getCallerInfo());
  }

  parts.push(message);
  return parts.join(' ');
};

/**
 * 检查是否应该输出日志
 */
const shouldLog = (level: LogLevel): boolean => {
  if (!currentConfig.enabled) return false;

  const levels = Object.values(LogLevel);
  const minLevelIndex = levels.indexOf(currentConfig.minLevel);
  const currentLevelIndex = levels.indexOf(level);

  return currentLevelIndex >= minLevelIndex;
};

/**
 * 日志工具类
 */
export const LogUtils = {
  /**
   * 更新配置
   */
  configure(config: Partial<LogConfig>): void {
    currentConfig = { ...currentConfig, ...config };
  },

  /**
   * 重置为默认配置
   */
  reset(): void {
    currentConfig = { ...defaultConfig };
  },

  /**
   * 调试日志
   */
  debug(message: string, ...args: unknown[]): void {
    if (shouldLog(LogLevel.DEBUG)) {
      console.debug(formatMessage(LogLevel.DEBUG, message), ...args);
    }
  },

  /**
   * 信息日志
   */
  info(message: string, ...args: unknown[]): void {
    if (shouldLog(LogLevel.INFO)) {
      console.info(formatMessage(LogLevel.INFO, message), ...args);
    }
  },

  /**
   * 警告日志
   */
  warn(message: string, ...args: unknown[]): void {
    if (shouldLog(LogLevel.WARN)) {
      console.warn(formatMessage(LogLevel.WARN, message), ...args);
    }
  },

  /**
   * 错误日志
   */
  error(message: string, ...args: unknown[]): void {
    if (shouldLog(LogLevel.ERROR)) {
      console.error(formatMessage(LogLevel.ERROR, message), ...args);
    }
  },
};
