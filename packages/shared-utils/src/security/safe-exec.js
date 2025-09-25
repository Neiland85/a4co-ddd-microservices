"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeExecAndParseJson = exports.safeExec = void 0;
const child_process_1 = require("child_process");
const safeExec = (command) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${command}`, error);
                reject(new Error(`Command failed: ${error.message}`));
                return;
            }
            if (stderr) {
                console.warn(`Command stderr: ${command}`, stderr);
            }
            resolve(stdout);
        });
    });
};
exports.safeExec = safeExec;
const safeExecAndParseJson = async (command, args = []) => {
    const fullCommand = [command, ...args].join(' ');
    const stdout = await (0, exports.safeExec)(fullCommand);
    try {
        return JSON.parse(stdout);
    }
    catch (error) {
        console.error(`Error parsing JSON from command output: ${fullCommand}`, stdout, error);
        throw new Error(`Failed to parse JSON from command output: ${error.message}`);
    }
};
exports.safeExecAndParseJson = safeExecAndParseJson;
//# sourceMappingURL=safe-exec.js.map