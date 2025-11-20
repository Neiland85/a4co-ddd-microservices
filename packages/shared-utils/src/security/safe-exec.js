"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeExecAndParseJson = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execPromise = (0, util_1.promisify)(child_process_1.execFile);
const safeExecAndParseJson = async (command, args = []) => {
    try {
        const { stdout } = await execPromise(command, args);
        return JSON.parse(stdout);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error executing ${command}:`, error);
        throw new Error(`safeExec failed: ${errorMessage}`);
    }
};
exports.safeExecAndParseJson = safeExecAndParseJson;
//# sourceMappingURL=safe-exec.js.map