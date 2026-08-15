/* Behaviour for the example prompts in the Flow swimlane: the modal they open
 * in, and click-to-copy inside it.
 *
 * Deferred, unlike palette.js: nothing here affects first paint, and both the
 * trigger pill and the copy buttons ship `hidden` from the build so an
 * affordance only ever appears once this file has run and can service a click.
 * The `js` class that flips the dialog from inline to modal is set by
 * palette.js instead, because that one runs before first paint.
 *
 * The modal is a native <dialog> driven by showModal(). Esc, focus trapping,
 * inertness of the page behind and the ::backdrop all come free from that —
 * none of it is hand-rolled here.
 *
 * The clipboard text is read back out of the rendered `.prompt-text` with
 * textContent, not from a data attribute. What the reader sees is what they
 * get, and there is no second copy of the string to drift out of sync. */
(function () {
  'use strict';

  var RESET_MS = 1600;

  /* navigator.clipboard needs a secure context. https and localhost both are,
     so the execCommand path is a fallback for oddities (a LAN IP, file://),
     not the main road. */
  function write(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ok) resolve(); else reject(new Error('copy unavailable'));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // ── the modals ────────────────────────────────────────────────────
    var triggers = document.querySelectorAll('.step-prompt-trigger');

    Array.prototype.forEach.call(triggers, function (trigger) {
      var dialog = document.getElementById(trigger.getAttribute('data-prompt-dialog'));
      if (!dialog || typeof dialog.showModal !== 'function') return;

      trigger.hidden = false; // only shown when JS can actually open the dialog

      trigger.addEventListener('click', function () { dialog.showModal(); });

      var close = dialog.querySelector('.prompt-dialog-close');
      if (close) close.addEventListener('click', function () { dialog.close(); });

      /* A click on the backdrop lands on the dialog element itself — anything
         inside the panel reports a descendant as the target. */
      dialog.addEventListener('click', function (e) {
        if (e.target === dialog) dialog.close();
      });
    });

    // ── click to copy ─────────────────────────────────────────────────
    var buttons = document.querySelectorAll('.prompt-copy');

    Array.prototype.forEach.call(buttons, function (btn) {
      var prompt = btn.closest('.prompt');
      var source = prompt && prompt.querySelector('.prompt-text');
      if (!source) return;

      var label = btn.querySelector('.prompt-copy-label');
      var timer = null;

      btn.hidden = false; // only shown when JS can actually drive it

      btn.addEventListener('click', function () {
        write(source.textContent).then(
          function () { flash('is-done', 'Copied'); },
          function () { flash('is-failed', 'Copy failed'); }
        );
      });

      function flash(cls, text) {
        clearTimeout(timer);
        btn.classList.remove('is-done', 'is-failed');
        btn.classList.add(cls);
        if (label) label.textContent = text;
        timer = setTimeout(function () {
          btn.classList.remove('is-done', 'is-failed');
          if (label) label.textContent = 'Copy';
        }, RESET_MS);
      }
    });
  });
})();
