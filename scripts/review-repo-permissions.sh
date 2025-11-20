#!/bin/bash

# Script para revisar permisos de acceso al repositorio GitHub
# Requiere GitHub CLI (gh) instalado y autenticado
# Uso: ./scripts/review-repo-permissions.sh [owner/repo]

set -e

REPO="${1:-Neiland85/a4co-ddd-microservices}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔍 Revisando permisos del repositorio: $REPO"
echo "📅 Fecha: $(date)"
echo "========================================"

# Verificar si gh CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) no está instalado."
    echo "   Instálalo desde: https://cli.github.com/"
    exit 1
fi

# Verificar autenticación con mejor manejo de errores
echo "🔐 Verificando autenticación con GitHub..."
if ! gh auth status &> /dev/null; then
    echo "❌ No estás autenticado en GitHub CLI."
    echo ""
    echo "   Soluciones posibles:"
    echo "   1. Ejecuta: gh auth login"
    echo "   2. Si ya estás autenticado, intenta: gh auth refresh"
    echo "   3. Verifica que tienes permisos para acceder al repositorio: $REPO"
    echo ""
    echo "   Para verificar tu estado actual:"
    echo "   gh auth status"
    echo ""
    exit 1
fi

# Verificar acceso al repositorio
echo "🔗 Verificando acceso al repositorio..."
if ! gh repo view "$REPO" &> /dev/null; then
    echo "❌ No tienes acceso al repositorio $REPO o el repositorio no existe."
    echo ""
    echo "   Verifica:"
    echo "   - Que el nombre del repositorio es correcto"
    echo "   - Que tienes permisos de lectura en el repositorio"
    echo "   - Que estás en la organización correcta"
    echo ""
    exit 1
fi

echo "✅ Autenticación exitosa"

cd "$PROJECT_ROOT"

# Función para imprimir resultados
print_result() {
    local check_name="$1"
    local status="$2"
    local details="$3"

    if [ "$status" = "PASS" ]; then
        echo "✅ $check_name: $details"
    elif [ "$status" = "WARN" ]; then
        echo "⚠️  $check_name: $details"
    else
        echo "❌ $check_name: $details"
    fi
}

# 1. Verificar branch protection
echo ""
echo "1. 🛡️ Verificando branch protection..."
if PROTECTION=$(gh api "repos/$REPO/branches/main/protection" 2>/dev/null); then
    REQUIRED_REVIEWS=$(echo "$PROTECTION" | jq -r '.required_pull_request_reviews.required_approving_review_count // 0')
    REQUIRED_CHECKS=$(echo "$PROTECTION" | jq -r '.required_status_checks.contexts | length // 0')
    RESTRICT_PUSHES=$(echo "$PROTECTION" | jq -r '.restrictions // empty | length // 0')

    if [ "$REQUIRED_REVIEWS" -gt 0 ]; then
        print_result "Required reviews" "PASS" "$REQUIRED_REVIEWS reviews requeridos"
    else
        print_result "Required reviews" "FAIL" "No hay reviews requeridos"
    fi

    if [ "$REQUIRED_CHECKS" -gt 0 ]; then
        print_result "Status checks" "PASS" "$REQUIRED_CHECKS checks requeridos"
    else
        print_result "Status checks" "WARN" "No hay status checks requeridos"
    fi

    if [ "$RESTRICT_PUSHES" -gt 0 ]; then
        print_result "Push restrictions" "PASS" "Pushes restringidos"
    else
        print_result "Push restrictions" "WARN" "Pushes no restringidos"
    fi
else
    print_result "Branch protection" "FAIL" "No configurado para main branch o sin permisos para ver"
fi

# 2. Listar colaboradores
echo ""
echo "2. 👥 Listando colaboradores..."
if COLLABORATORS=$(gh api "repos/$REPO/collaborators" --paginate 2>/dev/null | jq -r '.[] | "\(.login) - \(.role_name) - \(.permissions.admin // false)"' 2>/dev/null); then
    if [ -n "$COLLABORATORS" ]; then
        ADMIN_COUNT=$(echo "$COLLABORATORS" | grep -c "true" || echo "0")
        TOTAL_COUNT=$(echo "$COLLABORATORS" | wc -l)

        print_result "Colaboradores" "INFO" "$TOTAL_COUNT colaboradores encontrados"
        echo "$COLLABORATORS" | sed 's/^/   - /'

        if [ "$ADMIN_COUNT" -gt 2 ]; then
            print_result "Administradores" "WARN" "$ADMIN_COUNT administradores (recomendado: máximo 2-3)"
        else
            print_result "Administradores" "PASS" "$ADMIN_COUNT administradores"
        fi
    else
        print_result "Colaboradores" "WARN" "No se encontraron colaboradores"
    fi
else
    print_result "Colaboradores" "WARN" "No se pudieron obtener colaboradores (posible falta de permisos)"
fi

# 3. Verificar secrets
echo ""
echo "3. 🔐 Verificando secrets..."
if REPO_SECRETS=$(gh secret list --repo "$REPO" 2>/dev/null | wc -l); then
    if ENV_SECRETS=$(gh secret list --env "*" --repo "$REPO" 2>/dev/null | wc -l); then
        print_result "Repository secrets" "INFO" "$REPO_SECRETS secrets configurados"
        print_result "Environment secrets" "INFO" "$ENV_SECRETS secrets de ambiente"
    else
        print_result "Repository secrets" "INFO" "$REPO_SECRETS secrets configurados"
        print_result "Environment secrets" "WARN" "No se pudieron obtener secrets de ambiente"
    fi
else
    print_result "Repository secrets" "WARN" "No se pudieron obtener secrets del repositorio"
    print_result "Environment secrets" "WARN" "No se pudieron obtener secrets de ambiente"
fi

# 4. Verificar variables
echo ""
echo "4. 📊 Verificando variables..."
if REPO_VARS=$(gh variable list --repo "$REPO" 2>/dev/null | wc -l); then
    if ENV_VARS=$(gh variable list --env "*" --repo "$REPO" 2>/dev/null | wc -l); then
        print_result "Repository variables" "INFO" "$REPO_VARS variables configuradas"
        print_result "Environment variables" "INFO" "$ENV_VARS variables de ambiente"
    else
        print_result "Repository variables" "INFO" "$REPO_VARS variables configuradas"
        print_result "Environment variables" "WARN" "No se pudieron obtener variables de ambiente"
    fi
else
    print_result "Repository variables" "WARN" "No se pudieron obtener variables del repositorio"
    print_result "Environment variables" "WARN" "No se pudieron obtener variables de ambiente"
fi

# 5. Verificar configuraciones de seguridad
echo ""
echo "5. 🔒 Verificando configuraciones de seguridad..."
REPO_INFO=$(gh repo view "$REPO" --json "isPrivate,hasIssues,hasProjects,hasWiki,hasDiscussions,deleteBranchOnMerge,allowMergeCommit,allowSquashMerge,allowRebaseMerge" 2>/dev/null)

if [ -n "$REPO_INFO" ]; then
    IS_PRIVATE=$(echo "$REPO_INFO" | jq -r '.isPrivate')
    DELETE_ON_MERGE=$(echo "$REPO_INFO" | jq -r '.deleteBranchOnMerge')

    if [ "$IS_PRIVATE" = "true" ]; then
        print_result "Repository visibility" "PASS" "Repositorio privado"
    else
        print_result "Repository visibility" "WARN" "Repositorio público"
    fi

    if [ "$DELETE_ON_MERGE" = "true" ]; then
        print_result "Branch deletion" "PASS" "Branches eliminadas automáticamente después del merge"
    else
        print_result "Branch deletion" "INFO" "Branches no se eliminan automáticamente"
    fi
fi

# 6. Verificar Dependabot
echo ""
echo "6. 🤖 Verificando Dependabot..."
if [ -f ".github/dependabot.yml" ]; then
    print_result "Dependabot" "PASS" "Configurado"
else
    print_result "Dependabot" "WARN" "No configurado"
fi

# 7. Verificar CodeQL
echo ""
echo "7. 🔍 Verificando CodeQL..."
if [ -f ".github/workflows/codeql.yml" ] || gh api "repos/$REPO/code-scanning/alerts" &> /dev/null; then
    print_result "CodeQL" "PASS" "Code scanning habilitado"
else
    print_result "CodeQL" "WARN" "Code scanning no configurado"
fi

echo ""
echo "========================================"
echo "🏁 Revisión de permisos completada"
echo ""
echo "💡 Recomendaciones:"
echo "   - Revisa cualquier elemento marcado como FAIL o WARN"
echo "   - Considera configurar branch protection si no está hecho"
echo "   - Limita el número de administradores"
echo "   - Habilita todas las características de seguridad disponibles"
echo "   - Programa revisiones periódicas de acceso"
echo ""
echo "📋 Para más detalles, consulta: docs/SECURITY_ACCESS_GUIDE.md"
