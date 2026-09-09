let publicKey = 'vwR4AXWqci-2xv8EA';
const TARGET_EMAIL = 'abhishek522580@gmail.com';

if (typeof emailjs !== 'undefined') {
  emailjs.init(publicKey);
}

const validateFormData = () => {
  const name = document.getElementById('name');
  if (!name || !name.value.trim()) {
    showError("Name is required.");
    return false;
  }

  const email = document.getElementById('email');
  if (!email || !email.value.trim()) {
    showError("Email is required.");
    return false;
  }

  const subject = document.getElementById('subject');
  if (!subject || !subject.value.trim()) {
    showError("Subject is required.");
    return false;
  }

  const message = document.querySelector("textarea[name='message']");
  if (!message || !message.value.trim()) {
    showError("Message is required.");
    return false;
  }

  return true;
};

const showError = (msg, showMailtoBtn = false) => {
  const errEl = document.getElementById('custom-error-message');
  if (errEl) {
    errEl.style.display = 'block';
    if (showMailtoBtn) {
      const name = document.getElementById('name')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const subject = document.getElementById('subject')?.value.trim() || 'Portfolio Inquiry';
      const message = document.querySelector("textarea[name='message']")?.value.trim() || '';
      
      const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Sender Name: " + name + "\nSender Email: " + email + "\n\nMessage:\n" + message)}`;
      
      errEl.innerHTML = `<div class="text-dark">${msg}</div><div class="mt-3"><a href="${mailtoUrl}" class="btn btn-sm btn-dark text-white fw-bold px-3 py-2 shadow-sm" target="_blank"><i class="bi bi-envelope-paper-fill me-1"></i> Send Directly via Email Client (Gmail / Mail App)</a></div>`;
    } else {
      errEl.innerText = 'Error: ' + msg;
    }
  } else {
    alert(msg);
  }
};

const fetchFormData = () => {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.querySelector("textarea[name='message']").value.trim();

  return {
    from_name: name,
    from_email: email,
    reply_to: email,
    to_name: 'Abhishek Kumar',
    subject: subject,
    message: message,
    date_time: new Date().toLocaleString()
  };
};

const sendViaFormSubmit = async (formData, contactForm, loadingEl, sentEl) => {
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formData.from_name,
        email: formData.from_email,
        _subject: formData.subject,
        _replyto: formData.from_email,
        message: formData.message
      })
    });
    
    const data = await response.json();
    if (loadingEl) loadingEl.style.display = 'none';

    if (data.success === "true" || data.success === true) {
      if (sentEl) {
        sentEl.style.display = 'block';
        sentEl.innerText = "Your message has been sent successfully! Thank you for reaching out.";
      }
      contactForm.reset();
    } else if (data.message && data.message.includes("Activation")) {
      showError(`<strong>1-Time Setup Required for ${TARGET_EMAIL}:</strong><br>FormSubmit has sent an activation email to <u>${TARGET_EMAIL}</u>.<br>Please open your Gmail inbox and click <b>'Activate Form'</b> to enable 1-click automatic background delivery.<br><br>In the meantime, click below to send your pre-filled message directly:`, true);
    } else {
      showError(`Unable to send message automatically right now. Click below to send directly to ${TARGET_EMAIL}:`, true);
    }
  } catch (err) {
    if (loadingEl) loadingEl.style.display = 'none';
    console.error('FormSubmit Error:', err);
    showError(`Unable to send message right now. Click below to send directly to ${TARGET_EMAIL}:`, true);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('form.php-email-form') || document.querySelector('form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const loadingEl = document.getElementsByClassName('loading')[0];
    const sentEl = document.getElementsByClassName('sent-message')[0];
    const errorEl = document.getElementById('custom-error-message');

    if (errorEl) errorEl.style.display = 'none';
    if (sentEl) sentEl.style.display = 'none';

    if (validateFormData()) {
      if (loadingEl) loadingEl.style.display = 'block';

      const templateParams = fetchFormData();
      
      // Try EmailJS first
      if (typeof emailjs !== 'undefined') {
        emailjs.send('service_gee98ws', 'template_oiozxsa', templateParams, publicKey)
          .then((response) => {
            if (response.status === 200) {
              if (loadingEl) loadingEl.style.display = 'none';
              if (sentEl) {
                sentEl.style.display = 'block';
                sentEl.innerText = "Your message has been sent successfully! Thank you for reaching out.";
              }
              contactForm.reset();
            } else {
              sendViaFormSubmit(templateParams, contactForm, loadingEl, sentEl);
            }
          })
          .catch((error) => {
            console.warn('EmailJS failed, trying FormSubmit endpoint...', error);
            sendViaFormSubmit(templateParams, contactForm, loadingEl, sentEl);
          });
      } else {
        sendViaFormSubmit(templateParams, contactForm, loadingEl, sentEl);
      }
    }
  });
});