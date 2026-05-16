// 1. Capturamos el canvas y su contexto de dibujo
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

// PASO 4: Constante que define el tamaño (ancho y alto) de cada celda
const TAMANIO_CELDA = 25;

// Primera pintura del juego al cargar la página
dibujarTodo();

// =========================
// FUNCIONES DE DIBUJO
// =========================

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTodo() {
  limpiarCanvas();
  // PASO 7: Invocamos la función encargada de trazar la cuadrícula sobre el tablero
  dibujarTablero();
}

// PASO 5: Función para construir la cuadrícula del tablero usando líneas
function dibujarTablero() {
  // Configuración del color de línea (verde semi-transparente para dar un look estilo matriz/retro)
  ctx.strokeStyle = "rgba(34, 197, 94, 0.15)";
  ctx.lineWidth = 1;

  // PASO 9: Bucle 'for' para dibujar las líneas verticales
  // La posición avanza en el eje X según el tamaño de la celda hasta cubrir todo el ancho
  for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(x, 0);                 // Coordenada inicial superior (X, 0)
    ctx.lineTo(x, canvas.height);     // Coordenada final inferior (X, Alto del Canvas)
    ctx.stroke();                     // Dibuja el trazo de la línea vertical
  }

  // PASO 10: Bucle 'for' para dibujar las líneas horizontales
  // La posición avanza en el eje Y según el tamaño de la celda hasta cubrir todo el alto
  for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(0, y);                 // Coordenada inicial izquierda (0, Y)
    ctx.lineTo(canvas.width, y);      // Coordenada final derecha (Ancho del Canvas, Y)
    ctx.stroke();                     // Dibuja el trazo de la línea horizontal
  }
}

