#!/bin/bash
set -euo pipefail

FILE=${1:-scripts/init-db.sql}

if [ ! -f "$FILE" ]; then
  echo "[ERROR] File not found: $FILE"
  exit 2
fi

WARNINGS=0
ERRORS=0
CHECKS=0

emit_warning() {
  local line="$1"; shift
  local msg="$*"
  WARNINGS=$((WARNINGS+1))
  if [ "${CI:-}" = "true" ]; then
    echo "::warning file=${FILE},line=${line}::${msg}"
  else
    echo "[WARNING] ${FILE}:${line} - ${msg}"
  fi
}

emit_error() {
  local line="$1"; shift
  local msg="$*"
  ERRORS=$((ERRORS+1))
  if [ "${CI:-}" = "true" ]; then
    echo "::error file=${FILE},line=${line}::${msg}"
  else
    echo "[ERROR] ${FILE}:${line} - ${msg}"
  fi
}

# Check 1: Hardcoded passwords (PASSWORD 'literal' or PASSWORD "literal") excluding ${VAR}
CHECKS=$((CHECKS+1))
while IFS= read -r ln; do
  lineno=$(echo "$ln" | cut -d':' -f1)
  line=$(echo "$ln" | cut -d':' -f2-)
  if echo "$line" | grep -Eiq "PASSWORD\s+['\"](?!\$\{).+['\"]"; then
    emit_error "$lineno" "Hardcoded password detected. Use environment variables or GitHub secrets instead."
  fi
done < <(nl -ba "$FILE" )

# Check 2: GRANT ALL PRIVILEGES usage
CHECKS=$((CHECKS+1))
if grep -niE "GRANT\s+ALL\s+PRIVILEGES" "$FILE" >/dev/null 2>&1; then
  ln=$(grep -niE "GRANT\s+ALL\s+PRIVILEGES" "$FILE" | head -n1 | cut -d: -f1)
  emit_warning "$ln" "Use specific grants instead of GRANT ALL PRIVILEGES."
fi

# Check 3: Elevated privileges (SUPERUSER, CREATEDB, CREATEROLE)
CHECKS=$((CHECKS+1))
if grep -niE "SUPERUSER|CREATEDB|CREATEROLE" "$FILE" >/dev/null 2>&1; then
  grep -niE "SUPERUSER|CREATEDB|CREATEROLE" "$FILE" | while IFS= read -r match; do
    ln=$(echo "$match" | cut -d: -f1)
    emit_warning "$ln" "Elevated privilege granted (SUPERUSER/CREATEDB/CREATEROLE). Avoid granting these to application users."
  done
fi

# Check 4: Unexpanded variables (only relevant for processed files)
CHECKS=$((CHECKS+1))
if grep -qE "\$\{[A-Z_]+\}" "$FILE"; then
  # Treat unexpanded variables as errors
  grep -niE "\$\{[A-Z_]+\}" "$FILE" | while IFS= read -r match; do
    ln=$(echo "$match" | cut -d: -f1)
    emit_error "$ln" "Unexpanded variable found. Ensure envsubst was run and required env vars are provided."
  done
fi

# Check 5: CREATE USER / DATABASE without IF NOT EXISTS (idempotency)
CHECKS=$((CHECKS+1))
if grep -niE "CREATE\s+(USER|DATABASE|SCHEMA|EXTENSION)\b" "$FILE" >/dev/null 2>&1; then
  grep -niE "CREATE\s+(USER|DATABASE|SCHEMA|EXTENSION)\b" "$FILE" | while IFS= read -r match; do
    ln=$(echo "$match" | cut -d: -f1)
    line=$(echo "$match" | cut -d: -f2-)
    if ! echo "$line" | grep -qi "IF NOT EXISTS"; then
      emit_warning "$ln" "CREATE statement without IF NOT EXISTS may break idempotency. Consider using IF NOT EXISTS."
    fi
  done
fi

# Summary
echo "---"
echo "Checks performed: $CHECKS"
echo "Warnings: $WARNINGS"
echo "Errors: $ERRORS"

if [ "$ERRORS" -gt 0 ]; then
  echo "One or more critical issues detected in $FILE"
  exit 1
fi

if [ "$WARNINGS" -gt 0 ]; then
  echo "Warnings were found in $FILE (see above)."
else
  echo "No issues found."
fi

exit 0
