/**
 * EmailJS identifiers, public by design: the browser needs them to send, and
 * the template's fixed recipient, not their secrecy, is what bounds their use.
 * @author Christophe Lecart
 */
export const EMAILJS = {
  endpoint: "https://api.emailjs.com/api/v1.0/email/send",
  user: "wCnIBsLz_IoHaoFDx",
  service: "service_lokewrs",
  template: "template_2ov9l9i",
};

/**
 * Google reCAPTCHA v2, the one check EmailJS itself verifies before sending.
 * The site key is public by design; its secret lives in the EmailJS template
 * settings. Google's test key always passes and its widget says so: it is
 * here until the site's own key replaces it.
 */
export const RECAPTCHA = {
  script: "https://www.google.com/recaptcha/api.js?render=explicit&hl=en",
  siteKey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
};
