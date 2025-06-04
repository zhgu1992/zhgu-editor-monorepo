export class UserEnvironment {
    private static userAgent: string = window.navigator.userAgent;
    static isMac: boolean = /Macintosh|MacIntel|MacPPC|Mac68K/.test(this.userAgent);

    static isWin: boolean = /Win32|Win64|Windows/.test(this.userAgent);

    static isLinux: boolean = /Linux/.test(this.userAgent);

    static hotkeyIconMap = {
        cmdKey: this.isMac ? '⌘' : 'Ctrl',
        shiftKey: this.isMac ? '⇧' : 'Shift',
        altKey: this.isMac ? '⌥' : 'Alt',
        deleteKey: this.isMac ? '⌫' : 'Delete',
        controlKey: '⌃',
        upKey: '↑',
        leftKey: '←',
        downKey: '↓',
        rightKey: '→',
    };

    static hotkeyMap: Record<string, 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey' > = {
        cmdKey: this.isMac ? 'metaKey' : 'ctrlKey',
        shiftKey: 'shiftKey',
        altKey: 'altKey',
        deleteKey: this.isMac ? 'metaKey' : 'ctrlKey',
        controlKey: 'ctrlKey',
    };
}