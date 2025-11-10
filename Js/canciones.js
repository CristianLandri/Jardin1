
    const docente = localStorage.getItem('docente');
    const docenteNombre = localStorage.getItem('usuario') || 'Docente';
    if (!docente) {
    
      window.location.href = 'login_docentes.html';
    }
    document.getElementById('docenteNombre').textContent = docenteNombre;


    document.getElementById('btnSalir').addEventListener('click', () => {
      localStorage.removeItem('docente');
      localStorage.removeItem('registro_id');
      window.location.href = 'login_docentes.html';
    });


    const videoModal = new bootstrap.Modal(document.getElementById('videoModal'));
    const modalVideo = document.getElementById('modalVideo');

    document.querySelectorAll('.play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const src = btn.getAttribute('data-src');
        if (!src) return;
        modalVideo.src = src;
        modalVideo.play().catch(()=>{});
        videoModal.show();
      });
    });

  
    document.getElementById('videoModal').addEventListener('hidden.bs.modal', () => {
      modalVideo.pause();
      modalVideo.src = '';
    });

x
    document.querySelectorAll('.video-card video').forEach(v => {
      v.addEventListener('click', () => {
        if (v.paused) v.play(); else v.pause();
      });
    });