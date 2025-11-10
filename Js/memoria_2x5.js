const symbols = ["🍎","🍌","🍇","🍒","🍉"];
let cards = [...symbols, ...symbols].sort(() => 0.5 - Math.random());

const gameBoard = document.getElementById("gameBoard");
const timerBar = document.getElementById("timerBar");
const endModal = new bootstrap.Modal(document.getElementById('endModal'));
const modalTitle = document.getElementById('modalTitle');
const modalEmoji = document.getElementById('modalEmoji');
const modalButtons = document.getElementById('modalButtons');

let firstCard = null;
let lockBoard = true; 
let matches = 0;
let wrongMatches = 0; 
let timer = 40;
const maxTime = 40;
let timerInterval;

// Crear las cartas
cards.forEach(symbol => {
  const card = document.createElement("div");
  card.className = "memory-card";
  card.innerHTML = `
    <div class="front">${symbol}</div>
    <div class="back">❓</div>
  `;
  gameBoard.appendChild(card);
  card.addEventListener("click", () => flipCard(card, symbol));
});

// Mostrar cartas inicialmente
const allCards = document.querySelectorAll(".memory-card");
allCards.forEach(card => card.classList.add("flipped"));
setTimeout(() => {
  allCards.forEach(card => card.classList.remove("flipped"));
  lockBoard = false;
  startTimer();
}, 5000);

function flipCard(card, symbol) {
  if (lockBoard || card.classList.contains("flipped")) return;
  document.getElementById("flipSound").play();
  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = { card, symbol };
    return;
  }

  if (firstCard.symbol === symbol) {
    document.getElementById("matchSound").play();
    matches++;
    timer = Math.min(timer + 3, maxTime);
    updateTimerBar();
    firstCard = null;
    if (matches === symbols.length) endGame(true);
  } else {
    wrongMatches++;
    document.getElementById("failSound").play();
    lockBoard = true;
    setTimeout(() => {
      card.classList.remove("flipped");
      firstCard.card.classList.remove("flipped");
      firstCard = null;
      lockBoard = false;
    }, 1000);
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    updateTimerBar();
    if (timer <= 0) endGame(false);
  }, 1000);
}

function updateTimerBar() {
  const percent = (timer / maxTime) * 100;
  timerBar.style.width = percent + "%";
  timerBar.style.backgroundColor = percent < 40 ? "#ff1744" : "#4caf50";
}

function endGame(win) {
  clearInterval(timerInterval);
  document.getElementById(win ? "winSound" : "loseSound").play();
  
  let puntosGanados = 0;
  if (win) {
    puntosGanados = Math.max(1, 6 - wrongMatches);
    sendPoints(puntosGanados);
  }
  
  modalTitle.textContent = win ? "¡Ganaste! 🌟" : "¡Se acabó el tiempo!";
  modalEmoji.textContent = win ? "🎉😄👏" : "";

  modalButtons.innerHTML = '';

  function makeBtn(text, onClickHandler, extraClass) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn' + (extraClass ? ' ' + extraClass : '');
    b.textContent = text;
    b.addEventListener('click', onClickHandler);
    return b;
  }

  modalButtons.appendChild(makeBtn('Jugar de nuevo', () => { location.reload(); }));

  if (win) {
    modalButtons.appendChild(makeBtn('Siguiente juego ➡️', () => { window.location.href = '/Jardin/Juegos/Memoria/3x4.html'; }));
  }

  modalButtons.appendChild(makeBtn('Volver al inicio', () => { window.location.href = '/Jardin/Juegos/Memoria/index.html'; }));
  
  if (win) {
    const info = document.createElement('div');
    info.className = 'w-100 mt-2';
    info.innerHTML = `<small>Has ganado <strong>${puntosGanados}</strong> puntos (fallos: ${wrongMatches})</small>`;
    document.querySelector('#endModal .modal-content').appendChild(info);
  }
  
  endModal.show();
  
  if (win) {
    setTimeout(() => { window.location.href = 'index.html'; }, 600000);
  }
}

async function sendPoints(points) {
  const nombre = localStorage.getItem('usuario');
  if (!nombre) return console.warn('No hay usuario en localStorage, puntos no enviados');
  try {
    const resp = await fetch('/Jardin/Essencial/Excepcional/sumar_puntos.php', {
      method: 'POST',
      body: new URLSearchParams({ nombre, puntos: points })
    });
    const data = await resp.json();
    console.log('Respuesta sumar_puntos:', data);
    if (data && typeof data.puntos !== 'undefined') {
      localStorage.setItem('puntos', data.puntos);
    }
  } catch (err) {
    console.error('Error enviando puntos:', err);
  }
}