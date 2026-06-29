#!/usr/bin/env bash
# =====================================================================
#  QUSCA — cerrar la web local
#  Detiene cualquier servidor que esté sirviendo ESTA carpeta.
#  Útil si lo lanzaste en otra ventana o en segundo plano.
# =====================================================================
set -uo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Buscar procesos http.server que sirvan esta carpeta concreta.
PIDS="$(pgrep -f "http.server.*${DIR}" 2>/dev/null || true)"

if [ -z "$PIDS" ]; then
  echo "No hay ningún servidor de QUSCA en marcha."
  exit 0
fi

echo "Deteniendo el servidor (PID: $PIDS)..."
kill $PIDS 2>/dev/null || true
sleep 1
# Por si alguno sigue vivo, forzar.
PIDS2="$(pgrep -f "http.server.*${DIR}" 2>/dev/null || true)"
[ -n "$PIDS2" ] && kill -9 $PIDS2 2>/dev/null || true

echo "Servidor detenido. La web ya no es accesible."
