// 1. Capturamos el canvas y su contexto de dibujo
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

// Elementos de la interfaz para actualizar estados y mensajes
const elementoPuntaje = document.getElementById("puntaje");
const elementoEstado = document.getElementById("estado");
const elementoMensaje = document.getElementById("mensaje");

// TALLER 1: Tamaño de cada celda de la cuadrícula
const TAMANIO_CELDA = 25;

// PARTE 3 - CONFIGURACIÓN DE TIEMPO: Velocidad del bucle (en milisegundos)
const VELOCIDAD_JUEGO = 130; 

// Variables lógicas del estado de juego
let serpiente = [];
let direccion = "derecha";
let juegoEjecutandose = false;
let intervaloJuego = null;
let puntaje = 0;

// Inicializamos las variables por primera vez y dibujamos el estado inicial
inicializarJuego();

function inicializarJuego() {
  // TALLER 2: Posición inicial de la serpiente (coordenadas de cuadrícula)
  serpiente = [
    { x: 7, y: 5 }, // Cabeza
    { x: 6, y: 5 }, // Cuerpo
    { x: 5, y: 5 }, // Cuerpo
    { x: 4, y: 5 }  // Cola
  ];
  direccion = "derecha";
  puntaje = 0;
  elementoPuntaje.innerText = puntaje;
  dibujarTodo();
}

// ==========================================
// TALLER 2: FUNCIONES DE DIBUJO DE LA SERPIENTE
// ==========================================

function pintarParte(lineaX, lineaY, esCabeza) {
  const posicionRealX = lineaX * TAMANIO_CELDA;
  const posicionRealY = lineaY * TAMANIO_CELDA;

  // Ejercicio final del Taller 2: Diferente color para la cabeza
  if (esCabeza) {
    ctx.fillStyle = "#22c55e"; // Verde brillante para la cabeza
  } else {
    ctx.fillStyle = "#15803d"; // Verde oscuro para el cuerpo
  }

  ctx.fillRect(posicionRealX + 1, posicionRealY + 1, TAMANIO_CELDA - 2, TAMANIO_CELDA - 2);
}

function pintarSerpiente() {
  for (let i = 0; i < serpiente.length; i++) {
    const esCabeza = (i === 0);
    pintarParte(serpiente[i].x, serpiente[i].y, esCabeza);
  }
}

// ==========================================
// TALLER 1: FUNCIONES DE DIBUJO DEL TABLERO
// ==========================================

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();   
  pintarSerpiente();  
}

function dibujarTablero() {
  ctx.strokeStyle = "rgba(34, 197, 94, 0.15)"; 
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// ==========================================
// PARTE 3: LÓGICA DE MOVIMIENTO AUTOMÁTICO Y ACTUALIZACIÓN
// ==========================================

function actualizarLogica() {
  // Tomamos la posición actual de la cabeza
  const cabezaActual = serpiente[0];
  let proximaX = cabezaActual.x;
  let proximaY = cabezaActual.y;

  // Calculamos la siguiente celda de la cuadrícula según la dirección actual
  switch (direccion) {
    case "arriba":    proximaY -= 1; break;
    case "abajo":     proximaY += 1; break;
    case "izquierda": proximaX -= 1; break;
    case "derecha":   proximaX += 1; break;
  }

  const nuevaCabeza = { x: proximaX, y: proximaY };

  // Control de colisiones con las paredes usando límites de cuadrícula (600 / 25 = 24 celdas)
  const limiteCeldasX = canvas.width / TAMANIO_CELDA;
  const limiteCeldasY = canvas.height / TAMANIO_CELDA;

  if (proximaX < 0 || proximaX >= limiteCeldasX || proximaY < 0 || proximaY >= limiteCeldasY) {
    clearInterval(intervaloJuego);
    juegoEjecutandose = false;
    elementoEstado.innerText = "Fin";
    elementoMensaje.innerText = "💥 ¡Te has estrellado contra la pared! Fin del juego.";
    return;
  }

  // Desplazamiento de la serpiente: agregamos la nueva cabeza al frente del arreglo
  serpiente.unshift(nuevaCabeza);
  
  // Retiramos la cola para mantener el mismo largo en movimiento estandar
  serpiente.pop();
}

// ==========================================
// PARTE 3: GESTIÓN DE CONTROLES Y EVENTOS
// ==========================================

function iniciarJuego() {
  if (!juegoEjecutandose) {
    juegoEjecutandose = true;
    elementoEstado.innerText = "Jugando";
    elementoMensaje.innerText = "¡Usa las flechas del teclado o los botones en pantalla!";
    
    // Ejecución cíclica continua del juego
    intervaloJuego = setInterval(() => {
      actualizarLogica();
      dibujarTodo();
    }, VELOCIDAD_JUEGO);
  }
}

function pausarJuego() {
  if (juegoEjecutandose) {
    clearInterval(intervaloJuego);
    juegoEjecutandose = false;
    elementoEstado.innerText = "Pausado";
    elementoMensaje.innerText = "Juego en pausa. Presiona Iniciar para continuar.";
  }
}

function reiniciarJuego() {
  clearInterval(intervaloJuego);
  juegoEjecutandose = false;
  elementoEstado.innerText = "Listo";
  elementoMensaje.innerText = "Presiona iniciar para comenzar.";
  inicializarJuego();
}

function cambiarDireccion(nuevaDireccion) {
  // Validación estricta para evitar que gire de golpe hacia el lado contrario
  if (nuevaDireccion === "arriba" && direccion !== "abajo") direccion = "arriba";
  if (nuevaDireccion === "abajo" && direccion !== "arriba") direccion = "abajo";
  if (nuevaDireccion === "izquierda" && direccion !== "derecha") direccion = "izquierda";
  if (nuevaDireccion === "derecha" && direccion !== "izquierda") direccion = "derecha";
}

// NUEVO: Escuchador de eventos del teclado para que se pueda jugar con las flechas físicas
document.addEventListener("keydown", (evento) => {
  switch (evento.key) {
    case "ArrowUp":    cambiarDireccion("arriba");    break;
    case "ArrowDown":  cambiarDireccion("abajo");     break;
    case "ArrowLeft":  cambiarDireccion("izquierda"); break;
    case "ArrowRight": cambiarDireccion("derecha");   break;
    case " ":          // Barra espaciadora para pausar/despausar rápidamente
      evento.preventDefault();
      if (juegoEjecutandose) pausarJuego(); else iniciarJuego();
      break;
  }
});