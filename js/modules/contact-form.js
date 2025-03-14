/**
 * Module pour gérer le formulaire de contact
 */
export function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  const formStatus = document.getElementById('form-status');
  
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Afficher l'état d'envoi
    formStatus.className = 'form-status sending';
    formStatus.textContent = 'Sending your message...';
    formStatus.style.display = 'block';
    
    // Préparer les données
    const templateParams = {
      from_name: this.from_name.value,
      email: this.email.value,
      message: this.message.value,
      to_name: this.to_name.value
    };
    
    // Vérifier si EmailJS est disponible
    if (typeof emailjs !== 'undefined') {
      emailjs.send('service_id', 'template_id', templateParams)
        .then(function() {
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Your message has been sent successfully!';
          contactForm.reset();
        }, function(error) {
          formStatus.className = 'form-status error';
          formStatus.textContent = 'Error sending message. Please try again later.';
          console.error('EmailJS error:', error);
        });
    } else {
      formStatus.className = 'form-status error';
      formStatus.textContent = 'Email service not available. Please try again later.';
    }
  });
}
