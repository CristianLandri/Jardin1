const nombre = localStorage.getItem('usuario');
  if(nombre){
    document.getElementById('nombreUsuario').textContent = nombre;
    obtenerPuntos();
  } else {
    
    window.location.href = 'index.html';
  }

async function loginUsuario(nombre) {
  const resp = await fetch('/Jardin/Essencial/Excepcional/login.php', {
    method: 'POST',
    body: new URLSearchParams({ nombre })
  });
  const data = await resp.json();

  if (!data.error) {
    localStorage.setItem('usuario', data.nombre);
    localStorage.setItem('puntos', data.puntos);
    console.log('Usuario conectado:', data.nombre);
  } else {
    console.error(data.error);
  }
}






async function juegoTerminado(puntosGanados) {
  const nombre = localStorage.getItem('usuario');

  const resp = await fetch('/Jardin/Essencial/Excepcional/sumar_puntos.php', {
    method: 'POST',
    body: new URLSearchParams({ nombre, puntos: puntosGanados })
  });
  
  const data = await resp.json();
  console.log('Puntos actualizados:', data.puntos);
}


 


async function obtenerPuntos() {
  const nombre = localStorage.getItem('usuario');
  if (!nombre) return;

  const resp = await fetch('Excepcional/obtener_puntos.php', {
    method: 'POST',
    body: new URLSearchParams({ nombre })
  });
  const data = await resp.json();

  if (!data.error) {
    document.getElementById('puntosUsuario').textContent = data.puntos;
    localStorage.setItem('puntos', data.puntos);
  }
}
obtenerPuntos();


window.addEventListener('storage', (e) => {
  if (e.key === 'puntos') {
  
    setTimeout(() => obtenerPuntos(), 200);
  }
});

window.addEventListener('focus', () => {
  
  obtenerPuntos();
});