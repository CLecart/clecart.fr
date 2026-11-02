/**
 * Entry point of the /cv/ short link
 * @file Starts the CV download, then sends the visitor to the home page
 * @author Christophe Lecart
 */

const CV_PATH = "/assets/documents/CV_Christophe_Lecart.pdf";
const RETURN_HOME_DELAY_MS = 1500;

/**
 * Download the CV and leave the visitor on the home page
 * @function downloadCvThenReturnHome
 * @description A temporary link carrying the download attribute starts the
 * download without navigating to the PDF, so the page keeps control and can
 * move on to the home page. The link in the page markup is the way out when
 * this script does not run.
 * @returns {void}
 */
function downloadCvThenReturnHome() {
  const link = document.createElement("a");
  link.href = CV_PATH;
  link.download = "CV_Christophe_Lecart.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => {
    globalThis.location.href = "/";
  }, RETURN_HOME_DELAY_MS);
}

downloadCvThenReturnHome();
