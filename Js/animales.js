const animals = [
  { name: "León", img: "images/leon3.webp", sound: "sounds/leon.mp3" },
  { name: "Vaca", img: "images/vaca.jpg", sound: "sounds/vaca.mp3" },
  { name: "Perro", img: "images/perro.jpg", sound: "sounds/perro.mp3" },
  { name: "Elefante", img: "images/elefante2.jpg", sound: "sounds/elefante.mp3" },
  { name: "Gallina", img: "images/gallina.png", sound: "sounds/gallina.mp3" },
  { name: "Oveja", img: "images/oveja.jpeg", sound: "sounds/oveja.mp3" }
];

let correctAnimal = null;
let puntosSesion = 0;
const puntosPorAcierto = 6;

function loadRound() {
  document.getElementById("message").innerHTML = "";
  correctAnimal = animals[Math.floor(Math.random() * animals.length)];
  
  const shuffled = [...animals].sort(() => Math.random() - 0.5);
  const row = document.getElementById("animalOptions");
  row.innerHTML = "";
  
  const emojiFor = {
    'León': '🦁',
    'Vaca': '🐮',
    'Perro': '🐶',
    'Elefante': '🐘',
    'Gallina': '🐔',
    'Oveja': '🐑'
  };

  shuffled.forEach(a => {
    row.innerHTML += `
      <div class="col-4 animal-card">
        <img src="${a.img}" alt="${a.name}" onclick="checkAnswer('${a.name}')">
        <p><b>${a.name}</b></p>
      </div>
    `;
  });
}

function checkAnswer(selected) {
  if (selected === correctAnimal.name) {
    document.getElementById("message").innerHTML = "😊 ¡Muy bien!";
    try { new Audio("sounds/correct.mp3").play().catch(()=>{}); } catch(e){}
    puntosSesion += puntosPorAcierto;
    document.getElementById('points').textContent = puntosSesion;
    setTimeout(loadRound, 800);
  } else {
    document.getElementById("message").innerHTML = "😅 Ups... probá otra vez.";
    try { new Audio("sounds/incorrect.mp3").play().catch(()=>{}); } catch(e){}
  }
}

document.getElementById("playSound").onclick = () => {
  new Audio(correctAnimal.sound).play();
};

document.getElementById('exitBtn').addEventListener('click', async () => {
  const nombre = localStorage.getItem('usuario');
  if (nombre && puntosSesion > 0) {
    try {
      const resp = await fetch('/Jardin/Essencial/Excepcional/sumar_puntos.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ nombre: nombre, puntos: puntosSesion })
      });
      const text = await resp.text();
      try { 
        const data = JSON.parse(text); 
        if (data && data.puntos != null) localStorage.setItem('puntos', data.puntos); 
      } catch(e){ 
        console.warn('Respuesta sumar_puntos no JSON:', text); 
      }
    } catch (err) {
      console.error('Error enviando puntos al salir:', err);
    }
  }
  window.location.href = '/Jardin/Essencial/Principal.html';
});

loadRound();