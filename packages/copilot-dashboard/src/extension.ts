import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const commandId = 'a4co.copilot.showDashboard';

  const disposable = vscode.commands.registerCommand(commandId, () => {
    const panel = vscode.window.createWebviewPanel(
      'copilotDashboardView',
      'Copilot Pro+ Dashboard',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
      }
    );

    const mediaPath = path.join(context.extensionPath, 'media', 'webview.html');
    const html = fs.readFileSync(mediaPath, 'utf8');

    panel.webview.html = html;

    // ⬇️ ENVIAR DATOS AL WEBVIEW
    // Enviamos un objeto con datos de ejemplo al frontend de React.
    panel.webview.postMessage({
      command: 'updateData',
      payload: { message: '¡Hola desde la extensión de VS Code!', user: 'Gemini' }
    });

    // ⬇️ RECIBIR DATOS DESDE EL WEBVIEW
    // Escuchamos los mensajes que nos envía el frontend de React.
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'showAlert':
            vscode.window.showInformationMessage(message.payload);
            return;
        }
      },
      undefined,
      context.subscriptions
    );
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
