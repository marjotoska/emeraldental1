/* Emerald Dental – chat bubble per raccolta contatti (nessuna dipendenza, nessuna API a pagamento) */
(function () {
  var TO = 'mariotoska13@gmail.com';             // email che riceve i contatti
  var WA = 'https://wa.me/355692057277';              // usato solo se l'invio fallisce
  var css = '\
.eb-b{position:fixed;left:16px;bottom:16px;z-index:950;width:58px;height:58px;border-radius:50%;border:2px solid #fff;background:#0f4a3f;color:#fff;cursor:pointer;box-shadow:0 8px 24px rgba(8,46,39,.35);display:flex;align-items:center;justify-content:center;transition:transform .2s}\
.eb-b:hover{transform:scale(1.06)}\
.eb-b svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}\
.eb-b i{position:absolute;top:-2px;right:-2px;width:14px;height:14px;border-radius:50%;background:#b8955a;border:2px solid #fff}\
.eb-p{position:fixed;left:16px;bottom:88px;z-index:950;width:340px;max-width:calc(100vw - 32px);height:440px;max-height:calc(100vh - 120px);background:#fbfaf7;border-radius:16px;box-shadow:0 20px 50px rgba(8,46,39,.28);display:none;flex-direction:column;overflow:hidden;font:15px/1.5 "Segoe UI",Roboto,Arial,sans-serif;color:#16231f}\
.eb-p.o{display:flex}\
.eb-h{background:#0f4a3f;color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between}\
.eb-h b{display:block;font-family:Georgia,serif;font-weight:400;font-size:17px}\
.eb-h span{font-size:12px;color:#b9cdc6;display:flex;align-items:center;gap:6px}\
.eb-h span:before{content:"";width:8px;height:8px;border-radius:50%;background:#2ecc71;box-shadow:0 0 0 3px rgba(46,204,113,.25)}\
.eb-h button{background:none;border:0;color:#fff;font-size:24px;line-height:1;cursor:pointer;padding:4px 8px}\
.eb-l{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px}\
.eb-m{max-width:85%;padding:9px 13px;border-radius:14px;word-wrap:break-word}\
.eb-m.bot{background:#fff;border:1px solid #dfe6e2;align-self:flex-start;border-bottom-left-radius:4px}\
.eb-m.me{background:#0f4a3f;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}\
.eb-c{padding:10px 12px 12px;border-top:1px solid #dfe6e2;background:#fff}\
.eb-c:empty{display:none}\
.eb-ch{display:flex;flex-wrap:wrap;gap:8px}\
.eb-ch button,.eb-r button{font:600 14px "Segoe UI",Roboto,Arial,sans-serif;border-radius:999px;cursor:pointer}\
.eb-ch button{padding:8px 14px;border:1.5px solid #0f4a3f;background:#fff;color:#0f4a3f}\
.eb-ch button:hover{background:#0f4a3f;color:#fff}\
.eb-r{display:flex;gap:8px}\
.eb-r input{flex:1;min-width:0;padding:10px 12px;border:1px solid #dfe6e2;border-radius:10px;font:16px "Segoe UI",Roboto,Arial,sans-serif;background:#fbfaf7}\
.eb-r button{padding:0 16px;border:0;background:#b8955a;color:#fff}\
.eb-n{font-size:11.5px;color:#5d6b66;margin:8px 2px 0;line-height:1.4}\
.eb-c a{color:#0f4a3f;font-weight:600}\
.eb-p :focus-visible,.eb-b:focus-visible{outline:3px solid #b8955a;outline-offset:2px}\
@media(max-width:679px){.eb-b{bottom:82px}.eb-p{bottom:154px;height:420px;max-height:calc(100vh - 180px)}}\
@media(prefers-reduced-motion:reduce){.eb-b{transition:none}}';

  var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);

  var w = document.createElement('div');
  w.innerHTML =
    '<button class="eb-b" aria-label="Apri la chat con la accettazione" aria-expanded="false"><svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg><i></i></button>' +
    '<div class="eb-p" role="dialog" aria-label="Chat con la accettazione di Emerald Dental">' +
    '<div class="eb-h"><div><b>Accettazione Emerald Dental</b><span>Online</span></div><button aria-label="Chiudi la chat">&times;</button></div>' +
    '<div class="eb-l" aria-live="polite"></div><div class="eb-c"></div></div>';
  document.body.appendChild(w);

  var btn = w.querySelector('.eb-b'), panel = w.querySelector('.eb-p'),
      log = w.querySelector('.eb-l'), ctl = w.querySelector('.eb-c'),
      x = w.querySelector('.eb-h button');
  var data = { interest: '', name: '', phone: '' }, started = false, sent = false;

  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  function down() {
    requestAnimationFrame(function () {
      log.scrollTo({ top: log.scrollHeight, behavior: calm ? 'auto' : 'smooth' });
    });
  }
  function add(t, who) {
    var d = document.createElement('div'); d.className = 'eb-m ' + who; d.textContent = t;
    log.appendChild(d); down(); return d;
  }
  function bot(t, next) {
    ctl.innerHTML = '';
    var d = add('…', 'bot');
    setTimeout(function () { d.textContent = t; down(); if (next) next(); }, 700);
  }
  function chips(list, cb) {
    ctl.innerHTML = '<div class="eb-ch"></div>';
    list.forEach(function (t) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = t;
      b.onclick = function () { add(t, 'me'); cb(t); }; ctl.firstChild.appendChild(b);
    });
    down();
  }
  function field(type, ph, label, cb, note) {
    ctl.innerHTML = '<div class="eb-r"><input type="' + type + '" placeholder="' + ph + '" aria-label="' + ph + '"' +
      (type === 'tel' ? ' inputmode="tel" autocomplete="tel"' : ' autocomplete="given-name"') +
      '><button type="button">' + label + '</button></div>' + (note ? '<p class="eb-n">' + note + '</p>' : '');
    var i = ctl.querySelector('input'), b = ctl.querySelector('button');
    function go() { var v = i.value.trim(); if (v) cb(v, i); }
    b.onclick = go; i.onkeydown = function (e) { if (e.key === 'Enter') go(); };
    down(); i.addEventListener('focus', function () { setTimeout(down, 300); });
    setTimeout(function () { i.focus(); }, 50);
  }

  function askInterest() {
    bot('Buongiorno e benvenuto in Emerald Dental, Tirana.', function () {
      bot('Di quale trattamento desidera informazioni?', function () {
        chips(['Impianti dentali', 'Faccette dentali', 'Filler e botox', 'Altro'], function (t) { data.interest = t; askName(); });
      });
    });
  }
  function askName() {
    bot('Perfetto. Come si chiama?', function () {
      field('text', 'Il suo nome', 'Invia', function (v) { data.name = v.slice(0, 60); add(v, 'me'); askPhone(); });
    });
  }
  function askPhone() {
    bot('Piacere, ' + data.name + '. Ci lasci il suo numero di telefono con prefisso e la ricontatteremo al più presto.', function () {
      field('tel', '+39 3xx xxx xxxx', 'Invia', function (v, input) {
        if (!/^\+?[0-9 ()-]{7,18}$/.test(v)) { input.style.borderColor = '#c0392b'; input.setAttribute('aria-invalid', 'true'); return; }
        data.phone = v; add(v, 'me'); send();
      }, 'Inviando il numero acconsente a essere ricontattato da Emerald Dental per la sua richiesta.');
    });
  }
  function send() {
    if (sent) return; sent = true; ctl.innerHTML = '';
    fetch('https://formsubmit.co/ajax/' + TO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'Nuovo contatto dalla chat del sito – ' + data.name,
        Nome: data.name, Telefono: data.phone, Interesse: data.interest, Pagina: location.href,
        _template: 'table', _captcha: 'false'
      })
    }).then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function () {
        if (window.gtag) { try { gtag('event', 'generate_lead', { method: 'chat' }); } catch (e) {} }
        bot('Grazie, ' + data.name + '! Abbiamo ricevuto la sua richiesta: la contatteremo a breve. Buona giornata da tutto il team di Emerald Dental.');
      })
      .catch(function () {
        sent = false;
        bot('Ci scusiamo, c\'è stato un problema tecnico nell\'invio. Può scriverci direttamente su WhatsApp:', function () {
          ctl.innerHTML = '<a href="' + WA + '" target="_blank" rel="noopener">Apri WhatsApp</a>'; down();
        });
      });
  }

  function toggle(open) {
    panel.classList.toggle('o', open); btn.setAttribute('aria-expanded', open);
    if (open && !started) { started = true; askInterest(); }
  }
  btn.onclick = function () { toggle(!panel.classList.contains('o')); };
  x.onclick = function () { toggle(false); btn.focus(); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('o')) toggle(false); });

  /* Apertura automatica dopo 2 secondi a ogni caricamento della pagina (anche dopo un refresh) */
  var AUTO_OPEN_MS = 2000;
  setTimeout(function () {
    if (started || panel.classList.contains('o')) return;
    toggle(true);
  }, AUTO_OPEN_MS);
})();