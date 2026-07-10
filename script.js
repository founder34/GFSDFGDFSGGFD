const form = document.querySelector("#wl-form");
const statusLine = document.querySelector("#form-status");
const successModal = document.querySelector("#success-modal");
const closeSuccess = document.querySelector("#close-success");
const submitButton = form?.querySelector("button[type='submit']");

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyyUFg9HwZnH3ETZRzaesNRWYJfKhRG2388Hmck-7KJwTxomSni2gV5PV7lmdWW-aV_/exec";

const showSuccessModal = () => {
  if (!successModal) return;
  successModal.classList.add("is-open");
  successModal.setAttribute("aria-hidden", "false");
};

const hideSuccessModal = () => {
  if (!successModal) return;
  successModal.classList.remove("is-open");
  successModal.setAttribute("aria-hidden", "true");
};

if (form && statusLine) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      statusLine.textContent = "Please complete every WL task before submitting.";
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const application = {
      username: data.username,
      likedAndReposted: true,
      commentLink: data.commentLink,
      evmWallet: data.wallet,
      submittedAt: new Date().toISOString()
    };

    localStorage.setItem("robinhood-witches-wl", JSON.stringify(application));

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      if (GOOGLE_APPS_SCRIPT_URL) {
        await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(application)
        });
      }

      statusLine.textContent = "Application submitted.";
      form.classList.add("submitted");
      showSuccessModal();
    } catch (error) {
      statusLine.textContent = "Could not send to Google Sheets. Your application is saved locally.";
      showSuccessModal();
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Application";
      }
    }
  });
}

closeSuccess?.addEventListener("click", hideSuccessModal);
successModal?.addEventListener("click", (event) => {
  if (event.target === successModal) hideSuccessModal();
});
