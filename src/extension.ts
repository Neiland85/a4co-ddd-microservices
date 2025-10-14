import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const commandId = 'copilotPrompts.openDashboard';

  const disposable = vscode.commands.registerCommand(commandId, () => {
    const panel = vscode.window.createWebviewPanel(
      'copilotDashboardView',
      'Copilot Pro+ Dashboard',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
<<<<<<< HEAD
      },
=======
      }
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    );

    const mediaPath = path.join(context.extensionPath, 'media', 'webview.html');
    const html = fs.readFileSync(mediaPath, 'utf8');

    panel.webview.html = html;
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
