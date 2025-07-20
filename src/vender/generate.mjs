//#region src/constants.ts
const modeMap = {
	nmap: "vim.normalModeKeyBindings",
	nnoremap: "vim.normalModeKeyBindingsNonRecursive",
	imap: "vim.insertModeKeyBindings",
	inoremap: "vim.insertModeKeyBindingsNonRecursive",
	vmap: "vim.visualModeKeyBindings",
	vnoremap: "vim.visualModeKeyBindingsNonRecursive"
};

//#endregion
//#region src/parse.ts
function parseStringKeybinding(keybinding) {
	const parts = keybinding.trim().split(/\s+/);
	if (parts.length < 2) throw new Error("Invalid keybinding format: must have at least mode and before");
	const [mode, beforeStr, ...rest] = parts;
	const before = parseKeyString(beforeStr);
	const { commands, after, names, silent } = rest.reduce((acc, part) => {
		if (isCommand(part)) acc.commands.push(parseCommandString(part));
		else if (isNames(part)) acc.names.push(...parseNameString(part));
		else if (isArg(part)) {
			if (["-s", "--silent"].includes(part)) acc.silent = true;
		} else if (isKey(part)) acc.after.push(...parseKeyString(part));
		return acc;
	}, {
		commands: [],
		after: [],
		names: [],
		silent: false
	});
	return [
		mode,
		before,
		after,
		commands,
		names,
		silent
	];
}
function parseKeyString(keyStr) {
	return keyStr.split(".");
}
function parseCommandString(cmdStr) {
	return cmdStr.slice(1);
}
function parseNameString(cmdStr) {
	return cmdStr.slice(1)?.replaceAll("_", " ")?.split(">").filter(Boolean);
}
function isNames(str) {
	return str.startsWith("@");
}
function isCommand(str) {
	return str.startsWith(":");
}
function isArg(str) {
	return str.startsWith("-");
}
function isKey(str) {
	return str.length > 0;
}

//#endregion
//#region src/generate.ts
function generate(keybindings) {
	const result = {};
	for (const item of keybindings) {
		const [mode, before, after, commands, names, silent] = typeof item === "string" ? parseStringKeybinding(item) : item;
		const target = modeMap[mode];
		if (!target) continue;
		if (!result[target]) result[target] = [];
		const config = { before };
		if (after.length) config.after = after;
		if (commands.length) config.commands = commands;
		if (names.length) config.names = names;
		if (silent) config.silent = silent;
		result[target].push(config);
	}
	return result;
}

//#endregion
export { generate };