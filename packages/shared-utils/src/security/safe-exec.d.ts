/**
 * Safe Exec - Utilidad segura para ejecutar comandos del sistema
 * Mitiga vulnerabilidades de inyección de comandos detectadas por SonarQube
 */
export declare const safeExec: (command: string) => Promise<string>;
/**
 * Executes a whitelisted command with arguments and parses the output as JSON.
 * @param command The command to execute (must be in whitelist)
 * @param args Array of arguments to pass to the command
 */
export declare const safeExecAndParseJson: <T>(command: string, args?: string[]) => Promise<T>;
//# sourceMappingURL=safe-exec.d.ts.map