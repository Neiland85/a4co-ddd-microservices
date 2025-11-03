import { execFile } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(execFile);

export const safeExecAndParseJson = async <T>(command: string, args: string[] = []): Promise<T> => {
  try {
    const { stdout } = await execPromise(command, args);
    return JSON.parse(stdout) as T;
  } catch (error: any) {
    console.error(`Error executing ${command}:`, error);
    throw new Error(`safeExec failed: ${error.message}`);
  }
};
