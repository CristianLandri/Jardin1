document.getElementById("loginDocenteForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();

  if (!usuario || !contrasena) {
    alert("Por favor, completá todos los campos.");
    return;
  }

  try {
  const response = await fetch("Excepcional/login_docentes.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `usuario=${encodeURIComponent(usuario)}&contrasena=${encodeURIComponent(contrasena)}`
    });

    if (!response.ok) {
      throw new Error("Error de conexión con el servidor");
    }

    const data = await response.json();

    if (data.ok) {
      localStorage.setItem("docente", data.usuario);
      localStorage.setItem("registro_id", data.registro_id);
      window.location.href = "docente_panel.html";
    } else {
      alert("Usuario o contraseña incorrectos.");
    }

  } catch (error) {
    alert("Error en la conexión: " + error.message);
    console.error("Detalles del error:", error);
  }
});