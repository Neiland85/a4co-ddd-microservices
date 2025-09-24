#!/bin/bash

# Verificar que code está disponible
if ! command -v code &> /dev/null; then
    echo "❌ Error: comando 'code' no encontrado. Instala VS Code y agrega 'code' al PATH."
    exit 1
fi

extensions=(
  "github.copilot"
  "github.copilot-chat"
  "ms-vscode.cpptools"
  "rust-lang.rust-analyzer"
  "golang.go"
  "esbenp.prettier-vscode"
  "dbaeumer.vscode-eslint"
  "prisma.prisma"
  "ms-azuretools.vscode-docker"
  "hashicorp.terraform"
  "redhat.vscode-yaml"
  "eamodio.gitlens"
  "wakatime.vscode-wakatime"
  "usernamehw.errorlens"
  "sonarsource.sonarlint-vscode"
  "ms-vscode-remote.remote-containers"
  "streetsidesoftware.code-spell-checker"
)

for ext in "${extensions[@]}"; do
  echo "Instalando/actualizando: $ext"
  code --install-extension "$ext" --force
done

echo "✅ Todas las extensiones instaladas/actualizadas"
