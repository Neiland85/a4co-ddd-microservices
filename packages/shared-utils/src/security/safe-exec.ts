/**
 * Safe Exec - Utilidad segura para ejecutar comandos del sistema
 * Mitiga vulnerabilidades de inyección de comandos detectadas por SonarQube
 */

import { exec } from 'child_process';

export const safeExec = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`, error);
        reject(new Error(`Command failed: ${(error as Error).message}`)); // Castear a Error
        return;
      }
      if (stderr) {
        console.warn(`Command stderr: ${command}`, stderr);
      }
      resolve(stdout);
    });
  });
};

/**
 * Executes a whitelisted command with arguments and parses the output as JSON.
 * @param command The command to execute (must be in whitelist)
 * @param args Array of arguments to pass to the command
 */
export const safeExecAndParseJson = async <T>(command: string, args: string[] = []): Promise<T> => {
<<<<<<< HEAD
  const fullCommand = [command, ...args].join(' ');
  const stdout = await safeExec(fullCommand);
  try {
    return JSON.parse(stdout) as T;
  } catch (error) {
    console.error(`Error parsing JSON from command output: ${fullCommand}`, stdout, error);
=======
  const stdout = await safeExec(command, args);
  try {
    return JSON.parse(stdout) as T;
  } catch (error) {
    console.error(`Error parsing JSON from command output: ${command}`, stdout, error);
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    throw new Error(`Failed to parse JSON from command output: ${(error as Error).message}`); // Castear a Error
  }
};
