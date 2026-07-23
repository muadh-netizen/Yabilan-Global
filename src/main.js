// Shared JS for all pages

// ---- Header scroll state ----
var header = document.getElementById('header');
if (header) {
  function updateHeader() {
    if (header.classList.contains('solid')) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

// ---- Burger menu ----
var burger = document.getElementById('burger');
var navMobile = document.getElementById('navMobile');
if (burger && navMobile) {
  burger.addEventListener('click', function () {
    burger.classList.toggle('open');
    navMobile.classList.toggle('open');
  });
}

// ---- Footer year ----
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Spinner keyframe (inject once) ----
(function () {
  var style = document.createElement('style');
  style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
})();

// ---- Generic contact form handler ----
// Each form with class "contact-form" gets loading + success behavior.
(function () {
  var config = window.EMAILJS_CONFIG || {};
  var publicKey = config.publicKey || 'A6ZJ5huJNJqPDbWht';
  var serviceId = config.serviceId || 'service_01mi8me';
  var templateId = config.templateId || 'template_ivbjlyp';

  if (window.emailjs) {
    window.emailjs.init(publicKey);
  }

  document.querySelectorAll('form.contact-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('.btn-submit');
      if (!btn) return;

      var span = btn.querySelector('span');
      var svg = btn.querySelector('svg');
      var spinner = document.createElement('div');
      spinner.className = 'spinner';
      spinner.style.cssText = 'width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;';

      btn.disabled = true;
      if (span) span.textContent = 'Envoi en cours...';
      if (svg) svg.style.display = 'none';
      btn.insertBefore(spinner, btn.firstChild);

      var statusMessage = form.parentElement.querySelector('.form-status');
      if (statusMessage) {
        statusMessage.textContent = '';
        statusMessage.className = 'form-status';
      }

      function getFieldValue(selector) {
        var field = form.querySelector(selector);
        return field ? field.value : '';
      }

      var templateParams = {
        name: getFieldValue('input[name="name"]'),
        email: getFieldValue('input[name="email"]'),
        phone: getFieldValue('input[name="phone"]'),
        sector: getFieldValue('select[name="sector"]'),
        service_type: getFieldValue('select[name="service_type"], input[name="service_type"]'),
        subject: getFieldValue('input[name="subject"]'),
        message: getFieldValue('textarea[name="message"]'),
        time: new Date().toLocaleString('fr-FR')
      };

      if (!window.emailjs) {
        if (statusMessage) {
          statusMessage.textContent = 'EmailJS n’est pas chargé. Vérifiez votre configuration.';
          statusMessage.className = 'form-status error';
        }
        btn.disabled = false;
        if (span) span.textContent = 'Envoyer le message';
        var activeSpinner = btn.querySelector('.spinner');
        if (activeSpinner) activeSpinner.remove();
        if (svg) svg.style.display = '';
        return;
      }

      var sendPromise = window.emailjs.send(serviceId, templateId, templateParams);
      var timeoutPromise = new Promise(function (resolve, reject) {
        setTimeout(function () {
          reject(new Error('EmailJS timeout after 10 seconds'));
        }, 10000);
      });

      Promise.race([sendPromise, timeoutPromise])
        .then(function () {
          form.style.display = 'none';
          var success = form.parentElement.querySelector('.form-success');
          if (success) success.classList.remove('hidden');
        })
        .catch(function (error) {
          if (statusMessage) {
            statusMessage.textContent = 'Échec de l’envoi : ' + (error.text || error.message || 'Vérifiez vos identifiants EmailJS.');
            statusMessage.className = 'form-status error';
          }
        })
        .finally(function () {
          btn.disabled = false;
          if (span) span.textContent = 'Envoyer le message';
          var activeSpinner = btn.querySelector('.spinner');
          if (activeSpinner) activeSpinner.remove();
          if (svg) svg.style.display = '';
        });
    });
  });
})();

// Reset buttons inside success messages
document.querySelectorAll('.form-success button').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var success = btn.closest('.form-success');
    var form = success.parentElement.querySelector('form.contact-form');
    if (!form) return;
    form.reset();
    form.style.display = '';
    success.classList.add('hidden');
    var sbtn = form.querySelector('.btn-submit');
    if (sbtn) {
      sbtn.disabled = false;
      var span = sbtn.querySelector('span');
      if (span) span.textContent = 'Envoyer le message';
      var spinner = sbtn.querySelector('.spinner');
      if (spinner) spinner.remove();
      var svg = sbtn.querySelector('svg');
      if (svg) svg.style.display = '';
    }
  });
});
