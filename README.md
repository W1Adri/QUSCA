# ACSAR — Web (català · english · castellano)

Web de presentación de **ACSAR — Associació de Comunicacions Satel·litals Avançades i Resilients**
(UPC · EETAC): un CubeSat de distribución cuántica de claves (QKD) con **BB84 + decoy
states**, candidato a **ESA Fly Your Satellite! Design Booster 3**.

Es un sitio **estático** (HTML + CSS + JavaScript, sin frameworks ni instalaciones).
Funciona totalmente **en local**: nada se publica ni se comparte.

---

## 🚀 Cómo lanzarla

Solo necesitas **Python 3** (ya viene instalado en Ubuntu/Linux). Hay tres maneras,
de la más fácil a la más manual:

### Opción A — Ejecutable (recomendada)

Desde una terminal, dentro de esta carpeta:

```bash
./start.sh
```

Esto:
1. Arranca un servidor **solo en tu ordenador** (`127.0.0.1`, nadie más puede acceder).
2. **Abre el navegador automáticamente** en la web.
3. Si el puerto 8000 está ocupado, usa el siguiente libre (8001, 8002…).

> ¿La primera vez da error de permisos? Marca el script como ejecutable una sola vez:
> ```bash
> chmod +x start.sh stop.sh
> ```

### Opción B — Doble clic

1. Clic derecho en `start.sh` → **Propiedades** → pestaña **Permisos** → marca
   *«Permitir ejecutar el archivo como un programa»*.
2. Doble clic en `start.sh` → **Ejecutar en una terminal**.

(En algunos sistemas el doble clic abre el archivo en el editor en vez de ejecutarlo;
si te pasa, usa la Opción A.)

### Opción C — Comando manual

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory "$(pwd)"
```

---

## 🌐 Cómo abrirla en el navegador

Si usaste la Opción A, se abre sola. Si no, escribe esta dirección en Chrome/Firefox:

```
http://localhost:8000
```

(Si `start.sh` te dijo otro puerto, usa ese número.)

---

## 🛑 Cómo cerrarla

Tienes tres formas, según cómo la lanzaste:

| Cómo la lanzaste            | Cómo cerrarla                                  |
|-----------------------------|------------------------------------------------|
| Con `./start.sh` (Opción A) | Pulsa **`Ctrl + C`** en esa terminal.          |
| En segundo plano / otra ventana | Ejecuta **`./stop.sh`**                    |
| A mano                      | `Ctrl + C`, o `pkill -f "http.server"`         |

Al cerrarla, `http://localhost:8000` deja de responder: la web ya no es accesible
hasta que la vuelvas a lanzar.

---

## 🌍 Cambiar de idioma

Arriba a la derecha hay un selector **CA · EN · ES**. El idioma elegido se recuerda
en tu navegador para la próxima visita. Por defecto arranca en **català** (o en el
idioma de tu navegador si es inglés o castellano).

---

## 📁 Estructura

```
page/
├── index.html              ← la página (estructura y textos en catalán por defecto)
├── start.sh                ← lanzar la web (+ abre el navegador)
├── stop.sh                 ← cerrar la web
├── README.md               ← este archivo
└── assets/
    ├── css/styles.css      ← todo el diseño (colores, tipografía, animaciones)
    └── js/
        ├── i18n.js         ← TODAS las traducciones (CA / EN / ES) + selector de idioma
        └── main.js         ← estrellas, cuenta atrás, contadores, animaciones
```

---

## ✏️ Editar textos y traducciones

Todos los textos viven en **`assets/js/i18n.js`**, organizados por idioma
(`ca`, `en`, `es`) y por clave (p. ej. `"hero.title"`).

Para cambiar una frase, edítala en los **tres** idiomas (misma clave). Ejemplo:

```js
"join.cta1": "Escriu-nos",        // dentro de  ca: { ... }
"join.cta1": "Get in touch",      // dentro de  en: { ... }
"join.cta1": "Escríbenos",        // dentro de  es: { ... }
```

Guarda y **recarga la página** (F5) para ver el cambio.

> El email de contacto es `acsar@upc.edu` (en el botón «Escríbenos» del HTML y en el
> pie). Cámbialo por el correo real buscándolo en `index.html`.

---

## ℹ️ Notas

- **Fuentes**: la web usa Space Grotesk e IBM Plex (Google Fonts). Tu navegador las
  descarga al abrir la página; es lo único que toca internet. Si quieres que sea
  **100 % offline**, pídelo y las dejo incrustadas en local.
- **Sin dependencias**: no hay `npm`, ni build, ni node. Solo archivos.
- **Publicar de verdad** (cuando queráis): al ser estática, se sube tal cual a
  GitHub Pages, Netlify, Vercel o cualquier hosting. Pídelo y te lo preparo.
