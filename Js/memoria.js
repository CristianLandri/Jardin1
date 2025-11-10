  async function completarJuego() {
    const nombre = localStorage.getItem('usuario');
    if (!nombre) {
      alert("Debes iniciar sesión primero.");
      window.location.href = '../Essencial/index.html';
      return;
    }

    const puntos = 10; 
  const resp = await fetch('/Jardin/Essencial/Excepcional/sumar_puntos.php', {
      method: 'POST',
      body: new URLSearchParams({ nombre, puntos })
    });

    const data = await resp.json();

    if (!data.error) {
      alert(`¡Bien hecho ${nombre}! Ganaste ${puntos} puntos.`);
      localStorage.setItem('puntos', data.puntos);
      window.location.href = '../Essencial/principal.html';
    } else {
      alert("Error al actualizar puntos.");
    }
  }