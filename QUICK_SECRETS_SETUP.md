# Configuración de Secrets - Checklist rápido

## 🔐 Secrets por Prioridad

### 🥇 CRÍTICO (Configurar YA)
- [ ] CODECOV_TOKEN (codecov.io → tu repo → settings → token)

### 🥈 MUY RECOMENDADO  
- [ ] TURBO_TOKEN (vercel.com/turbo → settings → tokens)
- [ ] TURBO_TEAM (tu team name o username)
- [ ] SNYK_TOKEN (snyk.io → account settings → API token)

### 🥉 OPCIONAL
- [ ] GITLEAKS_LICENSE (solo si tienes licencia comercial)

## ⚡ Configuración Rápida con GitHub CLI

```bash
# 1. Instalar GitHub CLI
brew install gh  # macOS
# sudo apt install gh  # Linux  
# winget install GitHub.cli  # Windows

# 2. Autenticarse
gh auth login

# 3. Configurar secrets (reemplazar con tus tokens reales)
gh secret set CODECOV_TOKEN --body "tu-codecov-token"
gh secret set TURBO_TOKEN --body "tu-turbo-token"
gh secret set TURBO_TEAM --body "tu-team-name"
gh secret set SNYK_TOKEN --body "tu-snyk-token"

# 4. Verificar
gh secret list
```

## 🧪 Test de Configuración

```bash
# Hacer push para trigger CI
echo "# CI test" >> README.md
git add . && git commit -m "test: CI setup" && git push

# Monitorear en: https://github.com/Neiland85/a4co-ddd-microservices/actions
```

📚 **Guía completa en**: SECRETS_SETUP_GUIDE.md
