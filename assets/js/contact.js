let publicKey = 'vwR4AXWqci-2xv8EA';
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

const showError = (msg) => {
  const errEl = document.getElementById('custom-error-message');
  if (errEl) {
    errEl.style.display = 'block';
    errEl.innerText = 'Error: ' + msg;
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
      emailjs.send('service_gee98ws', 'template_oiozxsa', templateParams, publicKey)
        .then((response) => {
          if (loadingEl) loadingEl.style.display = 'none';
          if (response.status === 200) {
            if (sentEl) {
              sentEl.style.display = 'block';
              sentEl.innerText = "Your message has been sent successfully! Thank you for reaching out.";
            }
            contactForm.reset();
          } else {
            showError('Something went wrong while sending your request to the server.');
          }
        })
        .catch((error) => {
          if (loadingEl) loadingEl.style.display = 'none';
          console.error('EmailJS Error:', error);
          showError('Unable to send email right now. Please try again or email directly at abhishek522580@gmail.com.');
        });
    }
  });
});