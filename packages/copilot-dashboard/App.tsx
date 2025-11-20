import React, { useState, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const vscodeApi = (window as any).acquireVsCodeApi();

function App() {
  const [dataFromExtension, setDataFromExtension] = useState<{ message: string; user: string } | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === 'updateData') {
        setDataFromExtension(message.payload);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSendMessageToExtension = () => {
    vscodeApi.postMessage({
      command: 'showAlert',
      payload: `¡Hola desde React! El mensaje original era: "${dataFromExtension?.message}"`
    });
  };

  return (
    <div>
      <h1>Dashboard de Copilot Pro+</h1>
      {dataFromExtension ? (
        <div>
          <p><strong>Mensaje:</strong> {dataFromExtension.message}</p>
          <p><strong>Usuario:</strong> {dataFromExtension.user}</p>
          <button onClick={handleSendMessageToExtension}>
            Enviar Mensaje a la Extensión
          </button>
        </div>
      ) : (
        <p>Esperando datos desde la extensión...</p>
      )}
    </div>
  );
}

export default App;