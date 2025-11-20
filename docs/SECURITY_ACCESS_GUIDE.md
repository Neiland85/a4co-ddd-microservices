# 🔐 Guía de Seguridad del Repositorio

## Revisión de Permisos de Acceso

Esta guía te ayudará a revisar y mejorar la seguridad de acceso al repositorio de GitHub.

### 1. 📋 Lista de Verificación de Permisos

#### Acceso a la Organización/Repositorio

- [ ] **Branch Protection Rules**: Configuradas para `main` y `develop`
- [ ] **Required Reviews**: Al menos 1 revisor requerido
- [ ] **Required Status Checks**: CI debe pasar antes de merge
- [ ] **Restrict Pushes**: Solo administradores o equipos específicos
- [ ] **Require Linear History**: Evitar force pushes

#### Permisos de Colaboradores

- [ ] **Principle of Least Privilege**: Solo permisos necesarios
- [ ] **Regular Audits**: Revisar colaboradores inactivos
- [ ] **2FA Required**: Autenticación de dos factores obligatoria
- [ ] **Access Tokens**: Tokens con expiración y permisos mínimos

#### Secrets y Variables

- [ ] **Repository Secrets**: Solo secrets necesarios
- [ ] **Environment Secrets**: Secrets por ambiente
- [ ] **Dependabot**: Acceso limitado a secrets
- [ ] **Actions Permissions**: Restringidas a workflows necesarios

### 2. 🛠️ Scripts de Verificación

#### Verificar Branch Protection

```bash
# Usando GitHub CLI
gh api repos/{owner}/{repo}/branches/main/protection
```

#### Listar Colaboradores

```bash
# Usando GitHub CLI
gh api repos/{owner}/{repo}/collaborators --paginate
```

#### Verificar Secrets

```bash
# Usando GitHub CLI
gh secret list
gh variable list
```

### 3. 🚨 Problemas Comunes y Soluciones

#### Colaboradores con Permisos Excesivos

```bash
# Identificar administradores
gh api repos/{owner}/{repo}/collaborators --role admin

# Cambiar permisos si es necesario
gh api -X PUT repos/{owner}/{repo}/collaborators/{username} -f permission=read
```

#### Secrets Expuestos

- Rotar inmediatamente cualquier secret comprometido
- Usar secrets de ambiente en lugar de repository secrets cuando sea posible
- Implementar rotación automática de secrets

#### Branch Protection Débil

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["ci"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

### 4. 🔧 Mejores Prácticas

#### Gestión de Acceso

1. **Equipos en lugar de usuarios individuales**
2. **Permisos granulares por repositorio**
3. **Auditorías regulares de acceso**
4. **Eliminación inmediata de acceso innecesario**

#### Secrets Management

1. **Usar GitHub Secrets para CI/CD**
2. **Variables de ambiente para desarrollo local**
3. **Rotación regular de secrets**
4. **Monitoreo de uso de secrets**

#### Monitoreo y Alertas

1. **GitHub Security Advisories**
2. **Dependabot Alerts**
3. **Code Scanning Alerts**
4. **Secret Scanning**

### 5. 📝 Checklist de Implementación

- [ ] Configurar branch protection rules
- [ ] Revisar y ajustar permisos de colaboradores
- [ ] Auditar secrets y variables
- [ ] Implementar required status checks
- [ ] Configurar Dependabot
- [ ] Habilitar security scanning
- [ ] Documentar política de acceso
- [ ] Programar revisiones periódicas

### 6. 🆘 Plan de Respuesta a Incidentes

#### Si se detecta acceso no autorizado

1. **Inmediatamente**: Remover acceso del usuario comprometido
2. **Rotar**: Todos los secrets y tokens asociados
3. **Auditar**: Acciones recientes del usuario
4. **Notificar**: Al equipo de seguridad
5. **Documentar**: El incidente para lecciones aprendidas

#### Si se compromete un secret

1. **Identificar**: Dónde se usa el secret
2. **Rotar**: El secret comprometido
3. **Invalidar**: Sesiones/activos relacionados
4. **Monitorear**: Uso indebido
5. **Actualizar**: Documentación de seguridad

---

_Esta guía debe revisarse y actualizarse regularmente según las mejores prácticas de seguridad._
