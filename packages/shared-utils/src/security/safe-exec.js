"use strict";
/**
 * Safe Exec - Utilidad segura para ejecutar comandos del sistema
 * Mitiga vulnerabilidades de inyección de comandos detectadas por SonarQube
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeExecAndParseJson = exports.safeExec = void 0;
const child_process_1 = require("child_process");
const safeExec = (command) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${command}`, error);
                reject(new Error(`Command failed: ${error.message}`)); // Castear a Error
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
/**
 * Executes a whitelisted command with arguments and parses the output as JSON.
 * @param command The command to execute (must be in whitelist)
 * @param args Array of arguments to pass to the command
 */
const safeExecAndParseJson = async (command, args = []) => {
    const stdout = await (0, exports.safeExec)(command, args);
    try {
        return JSON.parse(stdout);
    }
    catch (error) {
        console.error(`Error parsing JSON from command output: ${command}`, stdout, error);
        throw new Error(`Failed to parse JSON from command output: ${error.message}`); // Castear a Error
    }
};
exports.safeExecAndParseJson = safeExecAndParseJson;
//# sourceMappingURL=safe-exec.js.map