#!/usr/bin/env bash
# =====================================================================
#  ACSAR — lanzar la web en local
#  Arranca un servidor web SOLO en tu ordenador (127.0.0.1) y abre el
#  navegador automáticamente. Nada se publica ni sale a internet.
#  Para cerrarlo: pulsa  Ctrl + C  en esta ventana (o ejecuta ./stop.sh).
# =====================================================================
set -uo pipefail

# Carpeta donde vive este script = la carpeta de la web (funciona se llame
# desde donde se llame).
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOST="127.0.0.1"
PORT="${1:-8000}"        # puerto por defecto 8000; puedes pasar otro: ./start.sh 9000

# --- comprobar que Python 3 está disponible ---
if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: no se encuentra 'python3'. Instálalo con:  sudo apt install python3"
  exit 1
fi

# --- buscar un puerto libre a partir de PORT ---
port_libre() { ! (exec 3<>"/dev/tcp/$HOST/$1") >/dev/null 2>&1; }
intentos=0
while ! port_libre "$PORT"; do
  PORT=$((PORT + 1)); intentos=$((intentos + 1))
  if [ "$intentos" -gt 20 ]; then
    echo "ERROR: no encuentro ningún puerto libre entre 8000 y $PORT."; exit 1
  fi
done

URL="http://localhost:$PORT"

echo ""
echo "  ┌──────────────────────────────────────────────┐"
echo "  │   ACSAR · web en local                         │"
echo "  └──────────────────────────────────────────────┘"
echo ""
echo "   Abre en tu navegador:   $URL"
echo "   Carpeta servida:        $DIR"
echo ""
echo "   Para CERRARLO:  pulsa  Ctrl + C  aquí."
echo ""

# Abrir el navegador automáticamente (cuando el servidor ya esté arriba).
( sleep 1; xdg-open "$URL" >/dev/null 2>&1 || true ) &

# Arrancar el servidor en primer plano (Ctrl+C lo detiene).
exec python3 -m http.server "$PORT" --bind "$HOST" --directory "$DIR"
