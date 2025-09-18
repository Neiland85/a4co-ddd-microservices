{
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Node.js App",
      "program": "${input:programPath}",
      "console": "integratedTerminal"
    }
  ],
  "inputs": [
    {
      "type": "promptString",
      "id": "programPath",
      "description": "Enter the path to your main Node.js file (e.g., apps/auth/main.js or apps/web/server.js)"
    }
  ]
}