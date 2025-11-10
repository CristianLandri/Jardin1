    const docente = localStorage.getItem('docente');
    if (!docente) {
      alert('Acceso restringido. Iniciá sesión primero.');
      window.location.href = 'login_docentes.html';
    } else {
      const nombreDesktop = document.getElementById('nombreDocente');
      const nombreOff = document.getElementById('nombreDocenteOff');
      if (nombreDesktop) nombreDesktop.textContent = docente;
      if (nombreOff) nombreOff.textContent = docente;
    }

    function cerrarSesion() {
      localStorage.removeItem('docente');
      localStorage.removeItem('registro_id');
      window.location.href = 'login_docentes.html';
    }

    const btnCerrar = document.getElementById('cerrarSesion');
    if (btnCerrar) btnCerrar.addEventListener('click', cerrarSesion);
    const btnCerrarOff = document.getElementById('cerrarSesionOff');
    if (btnCerrarOff) btnCerrarOff.addEventListener('click', cerrarSesion);

  async function cargarPuntos() {
    try {
  const respuesta = await fetch("/Jardin/Essencial/Excepcional/obtener_puntos.php");
      const datos = await respuesta.json();

      
      const tablaBody = document.querySelector("#tablaPuntos tbody");
      if (tablaBody) {
        tablaBody.innerHTML = "";
        if (!Array.isArray(datos) || datos.length === 0) {
          tablaBody.innerHTML = '<tr><td colspan="4">No hay registros aún.</td></tr>';
        } else {
          datos.forEach(fila => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${fila.nombre}</td>
              <td id="puntos-${fila.id}">${fila.puntos}</td>
              <td>${fila.ultima_actualizacion}</td>
              <td>

              </td>
            `;
            tablaBody.appendChild(tr);
          });
        }
      }

      
      const mobileContainer = document.getElementById('tablaPuntosMobile');
      if (mobileContainer) {
        mobileContainer.innerHTML = '';
        if (!Array.isArray(datos) || datos.length === 0) {
          mobileContainer.innerHTML = '<p class="text-center text-muted">No hay registros aún.</p>';
        } else {
          datos.forEach(fila => {
            const card = document.createElement('div');
            card.className = 'card mb-2 shadow-sm';
            card.innerHTML = `
              <div class="card-body">
                <h5 class="card-title mb-1">${fila.nombre}</h5>
                <p class="mb-1"><strong>Puntos:</strong> <span id="mobile-puntos-${fila.id}">${fila.puntos}</span></p>
                <p class="mb-2 text-muted small">Última: ${fila.ultima_actualizacion}</p>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-success flex-fill" onclick="actualizarPuntos(${fila.id}, 1)">+1</button>
                  <button class="btn btn-sm btn-danger flex-fill" onclick="actualizarPuntos(${fila.id}, -1)">-1</button>
                </div>
              </div>
            `;
            mobileContainer.appendChild(card);
          });
        }
      }

    } catch (error) {
      console.error("Error al cargar puntos:", error);
      const tablaBody = document.querySelector("#tablaPuntos tbody");
      if (tablaBody) tablaBody.innerHTML = '<tr><td colspan="4">Error al cargar datos</td></tr>';
      const mobileContainer = document.getElementById('tablaPuntosMobile');
      if (mobileContainer) mobileContainer.innerHTML = '<p class="text-center text-danger">Error al cargar datos</p>';
    }
  }

  async function actualizarPuntos(id, cambio) {
    try {
      const formData = new FormData();
      formData.append("usuario_id", id);
      formData.append("puntos", cambio);

      const respuesta = await fetch("Excepcional/actualizar_puntos.php", {
        method: "POST",
        body: formData
      });

      const texto = await respuesta.text();
      console.log("Respuesta del servidor:", texto);

      
      await cargarPuntos();

    } catch (error) {
      console.error("Error al actualizar puntos:", error);
    }
  }

  
  document.addEventListener("DOMContentLoaded", () => {
    cargarPuntos();
    setInterval(cargarPuntos, 10000);
  });