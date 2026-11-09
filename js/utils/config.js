/**
 * EmailJS identifiers, public by design: the browser needs them to send, and
 * the template's fixed recipient, not their secrecy, is what bounds their use.
 * @author Christophe Lecart
 */
export const EMAILJS = {
  endpoint: "https://api.emailjs.com/api/v1.0/email/send",
  user: "wCnIBsLz_IoHaoFDx",
  service: "service_lokewrs",
  template: "template_l5er7kr",
};

/**
 * Google's invisible reCAPTCHA v2, the one check EmailJS itself verifies
 * before sending. The site key is public by design and valid on clecart.fr
 * only; its secret lives in the EmailJS template settings.
 */
export const RECAPTCHA = {
  script: "https://www.google.com/recaptcha/api.js?render=explicit&hl=en",
  siteKey: "6LchyhcuAAAAAJMfi9F-95l3Y6jOCOi5qgn5Hl1O",
};
