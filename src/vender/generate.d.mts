//#region src/constants.d.ts
declare const modeMap: {
    readonly nmap: "vim.normalModeKeyBindings";
    readonly nnoremap: "vim.normalModeKeyBindingsNonRecursive";
    readonly imap: "vim.insertModeKeyBindings";
    readonly inoremap: "vim.insertModeKeyBindingsNonRecursive";
    readonly vmap: "vim.visualModeKeyBindings";
    readonly vnoremap: "vim.visualModeKeyBindingsNonRecursive";
};
type ModeMap = typeof modeMap;

//#endregion
//#region src/types.d.ts
interface VimKeybinding {
    silent?: boolean;
    before: string[];
    after?: string[];
    commands?: string[];
    names?: string[];
}
type Keybinding = [string, string[], string[], string[], string[], boolean];
type VimConfig = {
    [key in ModeMap[keyof ModeMap]]?: VimKeybinding[];
};

//#endregion
//#region src/generate.d.ts
declare function generate(keybindings: (Keybinding | string)[]): VimConfig;

//#endregion
export { generate };