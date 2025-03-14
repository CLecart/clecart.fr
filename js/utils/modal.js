/**
 * Module pour gérer les modales d'images/vidéos
 */
export function initModals() {
  // Créer une modale si elle n'existe pas
  let modal = document.querySelector('.modal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <span class="close">&times;</span>
      <img class="modal-content" id="modal-img">
      <video class="modal-content" id="modal-video" controls></video>
    `;
    document.body.appendChild(modal);
  }
  
  const modalImg = document.getElementById('modal-img');
  const modalVideo = document.getElementById('modal-video');
  const closeBtn = modal.querySelector('.close');
  
  // Fonction pour fermer la modale
  function closeModal() {
    modal.style.display = 'none';
    if (modalVideo) {
      modalVideo.pause();
    }
  }
  
  // Fermer la modale lors du clic sur le X
  closeBtn.addEventListener('click', closeModal);
  
  // Fermer la modale lors du clic en dehors
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Fermer la modale avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
  
  // Ajouter événements aux images
  document.querySelectorAll('.project-thumb img').forEach(img => {
    img.style.cursor = 'pointer';
    img.title = 'Click to enlarge';
    
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modalImg.style.display = 'block';
      modalVideo.style.display = 'none';
      modal.style.display = 'block';
    });
  });
  
  // Ajouter événements aux vidéos
  document.querySelectorAll('.project-thumb video').forEach(video => {
    video.style.cursor = 'pointer';
    
    // Ouvrir la modale au clic sur la vidéo
    video.addEventListener('click', (e) => {
      // Ne pas ouvrir la modale si on clique sur les contrôles
      if (e.target.closest('video[controls]')) return;
      
      const source = video.querySelector('source');
      if (source) {
        modalVideo.src = source.src;
        modalVideo.style.display = 'block';
        modalImg.style.display = 'none';
        modal.style.display = 'block';
        modalVideo.play();
      }
    });
  });
}
