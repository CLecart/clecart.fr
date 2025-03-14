/**
 * Module pour gérer la bannière RGPD
 */
export function initGDPRBanner() {
  const gdprBanner = document.getElementById('gdpr-banner');
  if (!gdprBanner) return;
  
  const acceptBtn = document.getElementById('gdpr-accept');
  const declineBtn = document.getElementById('gdpr-decline');
  
  // Vérifier si l'utilisateur a déjà fait un choix
  if (localStorage.getItem('gdprAccepted')) {
    gdprBanner.style.display = 'none';
    return;
  }
  
  // Afficher la bannière
  gdprBanner.style.display = 'block';
  
  // Gérer le clic sur Accepter
  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('gdprAccepted', 'true');
    gdprBanner.style.display = 'none';
  });
  
  // Gérer le clic sur Refuser
  declineBtn.addEventListener('click', () => {
    localStorage.setItem('gdprAccepted', 'false');
    gdprBanner.style.display = 'none';
  });
}
