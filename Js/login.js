document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const nombre = document.getElementById('usuario').value;

  try {
  const resp = await fetch('/Jardin/Essencial/Excepcional/login.php', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ nombre })
    });

    if (!resp.ok) throw new Error("Error de conexión con el servidor");

    const data = await resp.json();

    if (data.error) {
      alert(data.error);
    } else {
      if (data.mensaje) {
        alert(data.mensaje);
      }
      localStorage.setItem('usuario', data.nombre);
      window.location.href = 'principal.html';
    }
  } catch (err) {
    alert("Error de conexión con el servidor");
    console.error(err);
  }
});