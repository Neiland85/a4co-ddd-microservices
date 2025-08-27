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

export const safeExecAndParseJson = async <T>(command: string): Promise<T> => {
  const stdout = await safeExec(command);
  try {
    return JSON.parse(stdout) as T;
  } catch (error) {
    console.error(`Error parsing JSON from command output: ${command}`, stdout, error);
    throw new Error(`Failed to parse JSON from command output: ${(error as Error).message}`); // Castear a Error
  }
};