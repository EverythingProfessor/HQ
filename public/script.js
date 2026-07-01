// HQ - script.js
// Handles page interactions, transitions, ripple effect, form submission and navigation.
// Uses query parameters to pass selected class/subject between pages.

document.addEventListener('DOMContentLoaded', () => {
  addRippleHandlers();
  landingInit();
  homeInit();
  classInit();
  registerInit();
  paymentInit();
});

/* ---------- Utilities ---------- */
function addRippleHandlers(){
  document.body.addEventListener('click', (e) => {
    const el = e.target.closest('.ripple');
    if(!el) return;
    el.classList.remove('ripple-animate');
    // force reflow
    void el.offsetWidth;
    el.classList.add('ripple-animate');
    setTimeout(()=>el.classList.remove('ripple-animate'), 600);
  });
}

// simple helper to read query params
function qParam(key){ return new URLSearchParams(location.search).get(key) }

/* ---------- Landing ---------- */
function landingInit(){
  const start = document.getElementById('startBtn');
  if(start){
    start.addEventListener('click', () => {
      // smooth delayed transition
      start.classList.add('btn--loading');
      setTimeout(()=> location.href = 'home.html', 260);
    });
  }
}

/* ---------- Home (classes) ---------- */
function homeInit(){
  document.querySelectorAll('.class-card').forEach(card => {
    card.addEventListener('click', () => {
      const selectedClass = card.dataset.class || card.querySelector('h3').innerText;
      // pass selected class via query string
      const href = new URL('class.html', location.href);
      href.searchParams.set('class', selectedClass);
      // subtle transition
      card.style.opacity = '0.9';
      setTimeout(()=> location.href = href.toString(), 160);
    });
  });
}

/* ---------- Class page (subjects) ---------- */
function classInit(){
  const selectedClass = qParam('class');
  const label = document.getElementById('selectedClassLabel');
  if(label && selectedClass) label.textContent = selectedClass;

  document.querySelectorAll('.subject-card').forEach(card => {
    card.addEventListener('click', () => {
      const subject = card.dataset.subject || card.querySelector('h3').innerText;
      // go to register with class + subject
      const href = new URL('register.html', location.href);
      if(selectedClass) href.searchParams.set('class', selectedClass);
      href.searchParams.set('subject', subject);
      setTimeout(()=> location.href = href.toString(), 160);
    });
  });
}

/* ---------- Register page ---------- */
function registerInit(){
  const form = document.getElementById('regForm');
  if(!form) return;
  const selClass = qParam('class');
  const selSubject = qParam('subject');
  const hiddenClass = document.getElementById('selectedClass');
  const hiddenSubject = document.getElementById('selectedSubject');
  const selectedLabel = document.querySelector('.selected-class-label');

  if(hiddenClass) hiddenClass.value = selClass || '';
  if(hiddenSubject) hiddenSubject.value = selSubject || '';
  if(selectedLabel) selectedLabel.innerHTML = `Selected Class: <strong>${selClass || '—'}</strong> • Subject: <strong>${selSubject || '—'}</strong>`;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const note = document.getElementById('formNote');
    // client-side validation (HTML validation will run first)
    if(!form.reportValidity()) return;
    // gather form data
    const data = {
      fullName: document.getElementById('fullName').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim(),
      selectedClass: hiddenClass.value || selClass || '',
      selectedSubject: hiddenSubject.value || selSubject || '',
    };

    // subtle loading UI
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Processing...';

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });

      if(!res.ok) throw new Error('Server error');
      const payload = await res.json();
      if(payload && payload.success){
        // redirect silently to payment
        location.href = 'payment.html';
      } else {
        throw new Error(payload && payload.error ? payload.error : 'Unknown error');
      }
    } catch (err){
      console.error(err);
      note.textContent = 'We encountered an error. Please try again.';
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });
}

/* ---------- Payment page ---------- */
function paymentInit(){
  const btn = document.getElementById('paidBtn');
  const note = document.getElementById('paymentNote');
  if(btn){
    btn.addEventListener('click', () => {
      btn.disabled = true;
      btn.innerText = 'Confirming...';
      setTimeout(() => {
        note.innerText = 'Thank you! Your registration has been received.';
        btn.style.display = 'none';
      }, 700);
    });
  }
}