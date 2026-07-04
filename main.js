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
// The success message element must be the next sibling with id ending in "Success".
document.querySelectorAll('form.contact-form').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('.btn-submit');
    if (!btn) return;
    btn.disabled = true;
    var span = btn.querySelector('span');
    var originalText = span ? span.textContent : '';
    if (span) span.textContent = 'Envoi en cours...';
    var svg = btn.querySelector('svg');
    if (svg) svg.style.display = 'none';
    var spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.style.cssText = 'width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;';
    btn.insertBefore(spinner, btn.firstChild);

    setTimeout(function () {
      form.style.display = 'none';
      var success = form.parentElement.querySelector('.form-success');
      if (success) success.classList.remove('hidden');
    }, 1300);
  });
});

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
