(() => {
  const usuario = localStorage.getItem('usuario');
  const docente = localStorage.getItem('docente');
  if (!usuario) {
    window.location.href = '/Jardin/Essencial/index.html';
    return;
  }
  
  if (docente && docente !== usuario) {
    console.warn('Clave "docente" encontrada pero no coincide con el usuario actual. Limpiando clave stale.');
    localStorage.removeItem('docente');
    return;
  }
  
  if (docente && docente === usuario) {
    alert('Esta trivia está destinada a alumnos. Volviendo al menú principal.');
    window.location.href = '/Jardin/Essencial/Principal.html';
    return;
  }
})();

const QUESTIONS = [
  {q: '¿Qué animal ruge y es el rey de la selva?', emoji: '🦁', choices:['Tigre','León','Lobo','Elefante'], a:1},
  {q: '¿Qué animal tiene una trompa muy larga?', emoji: '🐘', choices:['Elefante','Hipopótamo','Rinoceronte','Camello'], a:0},
  {q: '¿Qué animal tiene el cuello más largo?', emoji: '🦒', choices:['Jirafa','Cebra','Llama','Caballo'], a:0},
  {q: '¿Qué animal tiene rayas negras y blancas?', emoji: '🦓', choices:['Cebra','Tigre','Gato','Perro'], a:0},
  {q: '¿Qué animal tiene una gran melena y vive en la sabana?', emoji: '🦁', choices:['León','Oso','Camello','Canguro'], a:0},
  {q: '¿Qué animal vive en el agua y tiene ocho brazos?', emoji: '🐙', choices:['Pulpo','Calamar','Pez','Cangrejo'], a:0}
];

let index = 0, score = 0;
let puntosEnviados = false;

const animalArt = document.getElementById('animalArt');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const feedback = document.getElementById('feedback');
const results = document.getElementById('results');
const finalScore = document.getElementById('finalScore');
const finalText = document.getElementById('finalText');
const restart = document.getElementById('restart');
const progBar = document.getElementById('progBar');

const soundCorrect = document.getElementById('soundCorrect');
const soundWrong = document.getElementById('soundWrong');
const soundEnd = document.getElementById('soundEnd');

function loadQuestion() {
  if(index >= QUESTIONS.length) return endGame();
  const q = QUESTIONS[index];
  animalArt.textContent = q.emoji;
  questionEl.textContent = q.q;
  choicesEl.innerHTML = '';
  q.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-light';
    btn.textContent = choice;
    btn.onclick = () => selectChoice(i, q.a, btn);
    choicesEl.appendChild(btn);
  });
  feedback.textContent = '';
}

function selectChoice(i, correct, btn) {
  const buttons = choicesEl.querySelectorAll('button');
  buttons.forEach(b => b.disabled = true);
  if(i === correct) {
    btn.classList.add('correct');
    feedback.textContent = '¡Muy bien! 🥳';
    score++;
    try { soundCorrect.play().catch(()=>{}); } catch(e) {}
  } else {
    btn.classList.add('wrong');
    buttons[correct].classList.add('correct');
    feedback.textContent = 'Ups... intenta la próxima. 😅';
    try { soundWrong.play().catch(()=>{}); } catch(e) {}
  }
  setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
  index++;
  progBar.style.width = (index / QUESTIONS.length * 100) + '%';
  if(index < QUESTIONS.length) loadQuestion();
  else endGame();
}

function endGame() {
  results.style.display = 'block';
  questionEl.style.display = 'none';
  choicesEl.style.display = 'none';
  animalArt.style.display = 'none';
  feedback.textContent = '';
  finalScore.textContent = `Tu puntaje: ${score} / ${QUESTIONS.length}`;
  finalText.textContent = score === QUESTIONS.length ? '¡Excelente! 🌟' : '¡Muy bien hecho! 🐾';
  
  const nombreJugador = localStorage.getItem('usuario');
  if (nombreJugador && !puntosEnviados) {
    puntosEnviados = true;
    fetch('/Jardin/Essencial/Excepcional/sumar_puntos.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ nombre: nombreJugador, puntos: score })
    })
    .then(async r => {
      const text = await r.text();
      try {
        return JSON.parse(text);
      } catch (err) {
        console.error('Respuesta no JSON del servidor:', text);
        throw new Error('invalid_json');
      }
    })
    .then(data => {
      if (data && data.puntos != null) {
        localStorage.setItem('puntos', data.puntos);
        console.log('Puntos actualizados en background:', data.puntos);
      } else {
        console.warn('No se recibió el total de puntos en la respuesta.');
      }
    })
    .catch(err => {
      console.error('Error enviando puntos en background:', err);
    })
    .finally(() => { try { soundEnd.play().catch(()=>{}); } catch(e) {} });
  } else {
    try { soundEnd.play().catch(()=>{}); } catch(e) {}
  }
  
  const exitBtn = document.getElementById('exitBtn');
  if (exitBtn) {
    exitBtn.onclick = async () => {
      if (nombreJugador && !puntosEnviados) {
        puntosEnviados = true;
        try {
          const r = await fetch('/Jardin/Essencial/Excepcional/sumar_puntos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ nombre: nombreJugador, puntos: score })
          });
          const text = await r.text();
          try { const data = JSON.parse(text); if (data && data.puntos != null) localStorage.setItem('puntos', data.puntos); } catch(e){/* ignore */}
        } catch(e) { console.error('Error enviando puntos al salir:', e); }
      }
      window.location.href = '/Jardin/Essencial/Principal.html';
    };
  }
}

restart.onclick = () => location.reload();
loadQuestion();