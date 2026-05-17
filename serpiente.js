// 1. Capturamos el canvas y su contexto de dibujo
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

// Elementos de la interfaz para actualizar estados y mensajes
const elementoPuntaje = document.getElementById("puntaje");
const elementoEstado = document.getElementById("estado");
const elementoMensaje = document.getElementById("mensaje");

// TALLER 1 - PASO 4: Constante para el tamaño de cada celda de la cuadrícula
const TAMANIO_CELDA = 25;

// TALLER 2 - PASO 1 y 2: Arreglo que representa el cuerpo de la serpiente (coordenadas lógicas)
// Configuración inicial del EJERCICIO 1: Una serpiente horizontal
const serpiente = [
  { x: 7, y: 5 }, // Cabeza
  { x: 6, y: 5 }, // Cuerpo
  { x: 5, y: 5 }, // Cuerpo
  { x: 4, y: 5 }  // Cola
];

// Primera pintura del juego al cargar la página para ver los resultados iniciales
dibujarTodo();


// ==========================================
// TALLER 2: NUEVAS FUNCIONES DE DIBUJO DE LA SERPIENTE
// ==========================================

// PASO 1: Función para pintar una celda individual convirtiendo posiciones lógicas a píxeles reales
function pintarParte(lineaX, lineaY, esCabeza) {
  // IMPORTANTE (Página 2 del PDF): Cálculo multiplicando por TAMANIO_CELDA
  const posicionRealX = lineaX * TAMANIO_CELDA;
  const posicionRealY = lineaY * TAMANIO_CELDA;

  // EJERCICIO FINAL: Condicional para que la cabeza tenga un color diferente al cuerpo
  if (esCabeza) {
    ctx.fillStyle = "#22c55e"; // Verde neón brillante para la cabeza
  } else {
    ctx.fillStyle = "#15803d"; // Verde oscuro para el resto del cuerpo
  }

  // Dibujamos el cuadrado de la celda restando un margen de 2px para que se note la rejilla de fondo
  ctx.fillRect(posicionRealX + 1, posicionRealY + 1, TAMANIO_CELDA - 2, TAMANIO_CELDA - 2);
}

// PASO 3 y 4: Función encargada de recorrer todo el arreglo e invocar pintarParte()
function pintarSerpiente() {
  for (let i = 0; i < serpiente.length; i++) {
    // Si el índice es cero, significa que es el primer elemento (la cabeza)
    const esCabeza = (i === 0);
    
    // Invocamos la función de dibujo enviando las coordenadas individuales
    pintarParte(serpiente[i].x, serpiente[i].y, esCabeza);
  }
}


// ==========================================
// TALLER 1: FUNCIONES DE DIBUJO DEL TABLERO
// ==========================================

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// TALLER 2 - PASO 5: Modificado para invocar de forma exclusiva las funciones de renderizado estructurado
function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();   // Dibuja la grilla de fondo (Taller 1)
  pintarSerpiente();  // Dibuja la serpiente del arreglo (Taller 2)
}

// TALLER 1 - PASO 5: Función encargada de estructurar el tablero de juego
function dibujarTablero() {
  ctx.strokeStyle = "rgba(34, 197, 94, 0.15)"; // Líneas sutiles de color verde transparente
  ctx.lineWidth = 1;

  // TALLER 1 - PASO 9: Bucle 'for' para pintar las líneas verticales en el eje X
  for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // TALLER 1 - PASO 10: Bucle 'for' para pintar las líneas horizontales en el eje Y
  for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}


// ==========================================
// FUNCIONES ADICIONALES DE INTERFAZ (VINCULADAS A TUS BOTONES)
// ==========================================

function iniciarJuego() {
  elementoEstado.innerText = "Listo";
  elementoMensaje.innerText = "¡Estructura de la serpiente cargada! Lista para el movimiento en la siguiente entrega.";
}

function pausarJuego() {
  elementoEstado.innerText = "Pausado";
}

function reiniciarJuego() {
  elementoEstado.innerText = "Listo";
  elementoMensaje.innerText = "Tablero reiniciado.";
  dibujarTodo();
}

function cambiarDireccion(direccion) {
  // Manejador temporal de los clics en las flechas de dirección
  console.log("Dirección presionada: " + direccion);
}