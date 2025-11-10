const symbols = ["🍎","🍌","🍇","🍒","🍉","🍍"];
let cards = [...symbols, ...symbols].sort(() => 0.5 - Math.random());

const gameBoard = document.getElementById("gameBoard");
const timerBar = document.getElementById("timerBar");
const endModal = new bootstrap.Modal(document.getElementById('endModal'));
const modalTitle = document.getElementById('modalTitle');
const modalEmoji = document.getElementById('modalEmoji');
const modalButtons = document.getElementById('modalButtons');
const modalImageContainer = document.getElementById('modalImageContainer');

let firstCard = null;
let lockBoard = true;
let matches = 0;
let wrongMatches = 0;
let timer = 40;
const maxTime = 40;
let timerInterval;

// Crear el tablero 4x3
for (let i = 0; i < 3; i++) {
  const row = document.createElement("div");
  row.className = "row g-3";
  for (let j = 0; j < 4; j++) {
    const symbol = cards[i * 4 + j];
    const col = document.createElement("div");
    col.className = "col-3 col-sm-3 col-md-3";
    col.innerHTML = `
      <div class="memory-card">
        <div class="front">${symbol}</div>
        <div class="back"></div>
      </div>`;
    row.appendChild(col);
  }
  gameBoard.appendChild(row);
}

// Mostrar cartas inicialmente con efecto cascada
const allCards = document.querySelectorAll(".memory-card");
allCards.forEach((card, index) => {
  setTimeout(() => card.classList.add("flipped"), index * 150);
});
setTimeout(() => {
  allCards.forEach(card => card.classList.remove("flipped"));
  lockBoard = false;
  startTimer();
}, allCards.length * 150 + 1000);

// Event listeners para las cartas
allCards.forEach(card => {
  card.addEventListener("click", () => {
    if (lockBoard || card.classList.contains("flipped")) return;
    card.classList.add("flipped");
    playSound("flipSound");
    const front = card.querySelector(".front");
    if (!firstCard) firstCard = front;
    else {
      checkMatch(firstCard, front);
      firstCard = null;
    }
  });
});

function checkMatch(card1, card2) {
  if (card1.textContent === card2.textContent) {
    playSound("matchSound");
    card1.parentElement.classList.add("disabled");
    card2.parentElement.classList.add("disabled");
    timer = Math.min(timer + 3, maxTime);
    updateTimerBar();
    matches++;
    if (matches === symbols.length) gameOver(true);
  } else {
    wrongMatches++;
    playSound("failSound");
    setTimeout(() => {
      card1.parentElement.classList.remove("flipped");
      card2.parentElement.classList.remove("flipped");
    }, 800);
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer -= 0.1;
    if (timer <= 0) {
      timer = 0;
      clearInterval(timerInterval);
      gameOver(false);
    }
    updateTimerBar();
  }, 100);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimerBar() {
  const percentage = (timer / maxTime) * 100;
  timerBar.style.width = percentage + "%";
  timerBar.style.backgroundColor = percentage < 30 ? "#dc3545" : "#28a745";
}

function playSound(id) {
  const sound = document.getElementById(id);
  sound.currentTime = 0;
  sound.play();
}

function gameOver(won) {
  lockBoard = true;
  stopTimer();

  modalButtons.innerHTML = "";
  modalImageContainer.innerHTML = "";

  modalTitle.textContent = won ? "¡Ganaste!!!" : "¡Perdiste!!!";
  modalTitle.style.color = won ? "#28a745" : "#dc3545";
  modalEmoji.textContent = won ? "" : "";

  if (won) {
    playSound("winSound");
    const winImage = document.createElement("img");
    winImage.src = "ganaste-removebg-preview.png";
    winImage.alt = "Ganaste";
    winImage.style.width = "200px";
    winImage.style.marginBottom = "15px";
    modalImageContainer.appendChild(winImage);
  } else {
    playSound("loseSound");
    const loseImage = document.createElement("img");
    loseImage.src = "perdiste-Photoroom.png";
    loseImage.alt = "Perdiste";
    loseImage.style.width = "200px";
    loseImage.style.marginBottom = "15px";
    modalImageContainer.appendChild(loseImage);
  }

  function makeBtn(text, handler, cls) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls || 'btn';
    b.textContent = text;
    b.addEventListener('click', handler);
    return b;
  }

  if (won) {
    modalButtons.appendChild(makeBtn('Siguiente Juego', () => {
      window.location.href = '/Jardin/Juegos/Memoria/index.html';
    }, 'btn btn-success'));
  } else {
    modalButtons.appendChild(makeBtn('Reintentar', () => location.reload(), 'btn btn-primary'));
  }

  modalButtons.appendChild(makeBtn('Volver al Inicio', () => {
    window.location.href = '/Jardin/Juegos/Memoria/index.html';
  }, 'btn btn-secondary'));

  if (won) {
    const puntosGanados = Math.max(1, 6 - wrongMatches);
    sendPoints(puntosGanados);
    const info = document.createElement('div');
    info.className = 'w-100 mt-2';
    info.innerHTML = `<small>Has ganado <strong>${puntosGanados}</strong> puntos (fallos: ${wrongMatches})</small>`;
    document.querySelector('#endModal .modal-content').appendChild(info);
  }

  endModal.show();

  if (won) {
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 600000);
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