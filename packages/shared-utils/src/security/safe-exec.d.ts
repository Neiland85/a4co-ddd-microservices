interface SafeExecOptions {
    timeout?: number;
    maxBuffer?: number;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    allowedCommands?: string[];
}
export declare class SafeExec {
    private allowedCommands;
    constructor(options?: SafeExecOptions);
    execute(command: string, args?: string[], options?: SafeExecOptions): Promise<string>;
    executeSync(command: string, args?: string[], options?: SafeExecOptions): string;
    private isCommandAllowed;
    private validateArguments;
    private isSafeFlag;
    addAllowedCommand(command: string): void;
    removeAllowedCommand(command: string): void;
}
export declare const safeExec: SafeExec;
export declare function execSafe(command: string, args?: string[], options?: SafeExecOptions): Promise<string>;
export declare function execSafeSync(command: string, args?: string[], options?: SafeExecOptions): string;
export declare class CommandBuilder {
    private command;
    private args;
    constructor(command: string);
    addArg(arg: string): this;
    addFlag(flag: string, value?: string): this;
    execute(options?: SafeExecOptions): Promise<string>;
    executeSync(options?: SafeExecOptions): string;
    toString(): string;
}
export {};
//# sourceMappingURL=safe-exec.d.ts.map