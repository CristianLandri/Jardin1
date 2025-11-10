const boardEl = document.getElementById('board');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const sizeSelect = document.getElementById('sizeSelect');
const startBtn = document.getElementById('startBtn');
const solveBtn = document.getElementById('solveBtn');
const animalNameEl = document.getElementById('animalName');

const animals = [
  { name: "León", file: "leondibujo.jpg" },
  { name: "Elefante", file: "elefantedibujo.jpg" },
  { name: "Tigre", file: "tigredibujo.jpg" },
  { name: "Cebra", file: "cebradibujo.jpg" },
  { name: "Mono", file: "monodibujo.jpg" },
  { name: "Panda", file: "pandadibujo.jpg" },
  { name: "Jirafa", file: "jirafadibujo.jpg" }
];

let cols = 3, tiles = [], selected = null, moves = 0, timer = null, startTime = null, imageUrl = "";

function getRandomAnimal() {
  const random = animals[Math.floor(Math.random() * animals.length)];
  animalNameEl.textContent = "🐾 Animal: " + random.name;
  return "images/" + random.file;
}

function buildBoard() {
  imageUrl = getRandomAnimal();
  boardEl.innerHTML = '';
  cols = parseInt(sizeSelect.value);
  document.documentElement.style.setProperty('--cols', cols);
  tiles = [];

  const total = cols * cols;
  for (let i = 0; i < total; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.index = i;
    tile.dataset.pos = i;
    const row = Math.floor(i / cols);
    const col = i % cols;
    tile.style.backgroundImage = `url('${imageUrl}')`;
    tile.style.backgroundPosition = `${(col / (cols - 1)) * 100}% ${(row / (cols - 1)) * 100}%`;
    tile.addEventListener('click', onTileClick);
    tiles.push(tile);
  }

  shuffleTiles();
  renderTiles();
  moves = 0;
  updateMoves();
  resetTimer();
}

function shuffleTiles() {
  const positions = Array.from({ length: tiles.length }, (_, i) => i);
  do {
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
  } while (positions.every((p, i) => p === i));
  tiles.forEach((t, i) => t.dataset.pos = positions[i]);
}

function renderTiles() {
  boardEl.innerHTML = '';
  tiles.sort((a, b) => a.dataset.pos - b.dataset.pos).forEach(t => boardEl.appendChild(t));
}

function onTileClick(e) {
  const tile = e.currentTarget;
  if (!startTime) startTimer();
  if (!selected) {
    selected = tile;
    tile.classList.add('selected');
  } else if (selected === tile) {
    tile.classList.remove('selected');
    selected = null;
  } else {
    swapTiles(selected, tile);
    selected.classList.remove('selected');
    selected = null;
  }
}

function swapTiles(a, b) {
  const posA = a.dataset.pos, posB = b.dataset.pos;
  a.dataset.pos = posB; b.dataset.pos = posA;
  renderTiles();
  moves++; updateMoves();
  if (checkWin()) celebrate();
}

function updateMoves() { movesEl.textContent = 'Movimientos: ' + moves; }
function checkWin() { return tiles.every(t => t.dataset.pos === t.dataset.index); }

function startTimer() {
  startTime = Date.now();
  timer = setInterval(() => {
    const s = Math.floor((Date.now() - startTime) / 1000);
    timeEl.textContent = 'Tiempo: ' + Math.floor(s / 60).toString().padStart(2, '0') + ':' + (s % 60).toString().padStart(2, '0');
  }, 1000);
}

function resetTimer() { 
  clearInterval(timer); 
  timer = null; 
  startTime = null; 
  timeEl.textContent = 'Tiempo: 00:00'; 
}

function celebrate() {
  clearInterval(timer);
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
    c.style.animationDuration = 2 + Math.random() * 2 + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
  
  let puntosGanados = 6 - Math.floor(moves / cols);
  puntosGanados = Math.max(1, Math.min(6, puntosGanados));

  const resultPanel = document.getElementById('resultPanel');
  resultPanel.innerHTML = '';
  const info = document.createElement('div');
  info.className = 'fw-bold mb-2';
  info.textContent = `Has ganado ${puntosGanados} punto${puntosGanados>1?'s':''}!`;
  resultPanel.appendChild(info);

  const btnGroup = document.createElement('div');
  btnGroup.className = 'd-flex justify-content-center gap-2';

  const replay = document.createElement('button');
  replay.className = 'btn btn-primary btn-sm';
  replay.textContent = 'Reintentar';
  replay.onclick = () => { resultPanel.innerHTML = ''; buildBoard(); };
  btnGroup.appendChild(replay);

  const toMain = document.createElement('button');
  toMain.className = 'btn btn-success btn-sm';
  toMain.textContent = 'Volver a la página principal';
  toMain.onclick = () => { window.location.href = '/Jardin/Essencial/principal.html'; };
  btnGroup.appendChild(toMain);

  resultPanel.appendChild(btnGroup);

  sendPoints(puntosGanados);

  setTimeout(() => alert('🎉 ¡Felicitaciones! Lo lograste 🐾\nPuntos: ' + puntosGanados), 400);
}

startBtn.addEventListener('click', buildBoard);
solveBtn.addEventListener('click', () => {
  tiles.forEach(t => t.dataset.pos = t.dataset.index);
  renderTiles();
  resetTimer();
  moves = 0;
  updateMoves();
});

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