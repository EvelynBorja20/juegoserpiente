// 1. Capturamos el canvas y su contexto de dibujo
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

// Elementos de la interfaz para actualizar estados y mensajes
const elementoPuntaje = document.getElementById("puntaje");
const elementoEstado = document.getElementById("estado");
const elementoMensaje = document.getElementById("mensaje");

// TALLER 1: Tamaño de cada celda de la cuadrícula
const TAMANIO_CELDA = 25;

// TALLER 4 - ACTIVIDAD 3: Variable global de velocidad (en milisegundos)
let velocidad = 300; 

// Variables de control del flujo lógico
let serpiente = [];
let direccion = "derecha";
let juegoEjecutandose = false;
let intervaloJuego = null;
let puntaje = 0;
let estadoGameOver = false;

// NUEVA VARIABLE: Guarda la posición lógica de la comida en la grilla
let comida = { x: 0, y: 0 };

// Inicializamos el entorno por primera vez
configurarEstadoInicial();

function configurarEstadoInicial() {
  // Posición inicial fija de la serpiente
  serpiente = [
    { x: 7, y: 5 }, // Cabeza
    { x: 6, y: 5 }, // Cuerpo
    { x: 5, y: 5 }, // Cuerpo
    { x: 4, y: 5 }  // Cola
  ];
  direccion = "derecha";
  puntaje = 0;
  estadoGameOver = false;
  
  elementoPuntaje.innerText = puntaje;
  
  // Generamos la primera comida en una posición aleatoria del tablero
  generarComida();
  dibujarTodo();
}

// ==========================================
// NUEVA FUNCIÓN: GENERAR COMIDA ALEATORIA
// ==========================================
function generarComida() {
  const limiteAnchoCeldas = canvas.width / TAMANIO_CELDA; // 500 / 25 = 20 celdas
  const limiteAltoCeldas = canvas.height / TAMANIO_CELDA;

  // Calculamos posiciones enteras aleatorias entre 0 y 19
  comida.x = Math.floor(Math.random() * limiteAnchoCeldas);
  comida.y = Math.floor(Math.random() * limiteAltoCeldas);

  // MEJORA EXTRA: Evitar que la comida aparezca encima del cuerpo de la serpiente
  for (let i = 0; i < serpiente.length; i++) {
    if (serpiente[i].x === comida.x && serpiente[i].y === comida.y) {
      generarComida(); // Si aparece encima, vuelve a calcular otra posición
      break;
    }
  }
}

// ==========================================
// FUNCIONES DE DIBUJO (SERPIENTE Y COMIDA)
// ==========================================

// Dibuja un cuadro en la cuadrícula usando multiplicación matemática de posiciones
function pintarParte(lineaX, lineaY, color) {
  const posicionRealX = lineaX * TAMANIO_CELDA;
  const posicionRealY = lineaY * TAMANIO_CELDA;

  ctx.fillStyle = color;
  ctx.fillRect(posicionRealX + 1, posicionRealY + 1, TAMANIO_CELDA - 2, TAMANIO_CELDA - 2);
}

function pintarSerpiente() {
  for (let i = 0; i < serpiente.length; i++) {
    // La cabeza tiene un verde brillante, el cuerpo un verde más oscuro
    const colorSegmento = (i === 0) ? "#22c55e" : "#15803d";
    pintarParte(serpiente[i].x, serpiente[i].y, colorSegmento);
  }
}

// NUEVA FUNCIÓN: Dibuja la comida en el canvas con un color llamativo (Rojo manzana)
function pintarComida() {
  pintarParte(comida.x, comida.y, "#ef4444"); 
}

// ==========================================
// TALLER 1: COMPONENTES DEL RENDER DEL TABLERO
// ==========================================

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();   // Rejilla base (Taller 1)
  pintarComida();     // Cuadro de comida (¡Nuevo!)
  pintarSerpiente();  // Cuerpo de la serpiente (Taller 2)
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
// TALLER 4 - ACTIVIDAD 1: NÚCLEO LÓGICO Y CRECIMIENTO
// ==========================================

function actualizarLogica() {
  const cabezaActual = serpiente[0];
  let proximaX = cabezaActual.x;
  let proximaY = cabezaActual.y;

  // Calculamos la dirección del paso
  switch (direccion) {
    case "arriba":    proximaY -= 1; break;
    case "abajo":     proximaY += 1; break;
    case "izquierda": proximaX -= 1; break;
    case "derecha":   proximaX += 1; break;
  }

  // ACTIVIDAD 1: Validación de choque en los 4 bordes del tablero
  const limiteAnchoCeldas = canvas.width / TAMANIO_CELDA;
  const limiteAltoCeldas = canvas.height / TAMANIO_CELDA;

  if (proximaX < 0 || proximaX >= limiteAnchoCeldas || proximaY < 0 || proximaY >= limiteAltoCeldas) {
    clearInterval(intervaloJuego);
    juegoEjecutandose = false;
    estadoGameOver = true;
    elementoEstado.innerText = "GAME OVER";
    elementoMensaje.innerText = "💥 ¡GAME OVER! Te estrellaste contra la pared. Presiona 'Reiniciar' para volver a jugar.";
    return;
  }

  const nuevaCabeza = { x: proximaX, y: proximaY };
  
  // Colocamos la nueva cabeza siempre al frente para avanzar
  serpiente.unshift(nuevaCabeza);

  // NUEVA LÓGICA: ¿La cabeza llegó a la misma casilla que la comida?
  if (nuevaCabeza.x === comida.x && nuevaCabeza.y === comida.y) {
    puntaje += 10;                     // Sumamos 10 puntos al marcador
    elementoPuntaje.innerText = puntaje; // Actualizamos el HTML
    generarComida();                   // Colocamos una nueva comida en otra parte
    
    // NOTA: Al NO hacer "serpiente.pop()", la serpiente mantiene el segmento extra y crece.
  } else {
    // Si no hay comida, removemos el último segmento para mantener el tamaño normal en movimiento
    serpiente.pop();
  }
}

// ==========================================
// CONTROLADORES DE EVENTOS
// ==========================================

function iniciarJuego() {
  if (estadoGameOver) {
    elementoMensaje.innerText = "⚠️ El juego ha terminado. Oprime el botón 'Reiniciar' para restablecer la grilla.";
    return;
  }

  if (!juegoEjecutandose) {
    juegoEjecutandose = true;
    elementoEstado.innerText = "Jugando";
    elementoMensaje.innerText = "¡Usa los controles para devorar la comida roja!";
    
    intervaloJuego = setInterval(() => {
      actualizarLogica();
      dibujarTodo();
    }, velocidad);
  }
}

function pausarJuego() {
  if (juegoEjecutandose && !estadoGameOver) {
    clearInterval(intervaloJuego);
    juegoEjecutandose = false;
    elementoEstado.innerText = "Pausado";
    elementoMensaje.innerText = "Juego en pausa. Oprime 'Iniciar' para continuar.";
  }
}

// ACTIVIDAD 2: Botón Reiniciar restablece puntaje, comida y posiciones
function reiniciarJuego() {
  clearInterval(intervaloJuego);
  juegoEjecutandose = false;
  elementoEstado.innerText = "Listo";
  elementoMensaje.innerText = "Presiona iniciar para comenzar.";
  configurarEstadoInicial();
}

// ACTIVIDAD 4: Evitar retrocesos bruscos de 180 grados
function cambiarDireccion(nuevaDireccion) {
  if (estadoGameOver) return;

  if (nuevaDireccion === "arriba" && direccion !== "abajo") direccion = "arriba";
  if (nuevaDireccion === "abajo" && direccion !== "arriba") direccion = "abajo";
  if (nuevaDireccion === "izquierda" && direccion !== "derecha") direccion = "izquierda";
  if (nuevaDireccion === "derecha" && direccion !== "izquierda") direccion = "derecha";
}

document.addEventListener("keydown", (evento) => {
  switch (evento.key) {
    case "ArrowUp":    cambiarDireccion("arriba");    break;
    case "ArrowDown":  cambiarDireccion("abajo");     break;
    case "ArrowLeft":  cambiarDireccion("izquierda"); break;
    case "ArrowRight": cambiarDireccion("derecha");   break;
    case " ":
      evento.preventDefault();
      if (juegoEjecutandose) pausarJuego(); else iniciarJuego();
      break;
  }
});