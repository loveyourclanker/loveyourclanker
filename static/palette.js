/* Palette switching and the scroll-reveal header.
 *
 * Loaded blocking in <head> on purpose: the saved palette has to be applied
 * before first paint or every dark-mode reload flashes light. The DOM wiring
 * waits for DOMContentLoaded; only the custom properties are set immediately.
 *
 * Ramps are the ones from the design handoff. Dark inverts both accent ramps
 * so the -100..-900 steps keep meaning "lightest to darkest against the
 * ground" in either palette, and every component keeps its contrast. */
(function () {
  'use strict';

  var PALETTES = [
    {
      id: 'clanker',
      name: 'Light',
      bg: '#eef0e6', surface: '#dfe4d5', text: '#050807',
      divider: 'rgba(5,8,7,0.16)',
      nRamp: ['#f6f7f0','#e7eade','#cbd2c2','#a9b3a4','#8a9385','#67715f','#465046','#22302c','#050807'],
      aRamp: ['#fdf1dc','#f8dcac','#e2bc47','#ec9b19','#db600c','#af6235','#9d3005','#562a14','#29241a'],
      bRamp: ['#e4f4f2','#bfe4e1','#52c6be','#0ca8a6','#0a918d','#0d7b82','#08706d','#06504e','#05312f']
    },
    {
      id: 'night',
      name: 'Dark',
      bg: '#05312f', surface: '#06504e', text: '#eef0e6',
      divider: 'rgba(255,255,255,0.16)',
      nRamp: ['#050807','#05312f','#043d41','#06504e','#056461','#0a918d','#52c6be','#bfe4e1','#eef0e6'],
      aRamp: ['#29241a','#562a14','#9d3005','#af6235','#db600c','#ec9b19','#e2bc47','#f8dcac','#fdf1dc'],
      bRamp: ['#05312f','#043d41','#06504e','#056461','#08706d','#0ca8a6','#52c6be','#bfe4e1','#e4f4f2']
    }
  ];

  var KEY = 'lyc.palette';
  var root = document.documentElement;

  function find(id) {
    for (var i = 0; i < PALETTES.length; i++) if (PALETTES[i].id === id) return PALETTES[i];
    return PALETTES[0];
  }

  function apply(id, save) {
    var p = find(id);
    root.style.setProperty('--color-bg', p.bg);
    root.style.setProperty('--color-surface', p.surface);
    root.style.setProperty('--color-text', p.text);
    root.style.setProperty('--color-divider', p.divider);
    for (var i = 0; i < 9; i++) {
      var step = (i + 1) * 100;
      root.style.setProperty('--color-neutral-' + step, p.nRamp[i]);
      root.style.setProperty('--color-accent-' + step, p.aRamp[i]);
      root.style.setProperty('--color-accent-2-' + step, p.bRamp[i]);
    }
    root.style.setProperty('--color-accent', p.aRamp[4]);
    root.style.setProperty('--color-accent-2', p.bRamp[6]);
    root.setAttribute('data-palette', p.id);
    if (save) { try { localStorage.setItem(KEY, p.id); } catch (e) {} }
    return p;
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var active = apply(saved || 'clanker', false).id;

  /* Set here rather than in prompts.js because this file is the only one that
     runs before first paint. site.css uses it to flip the prompt dialogs from
     rendering inline (no JS, nothing can open them) to being real modals. */
  root.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    // ── palette switcher ──────────────────────────────────────────────
    var ui = document.getElementById('palette-ui');
    var options = document.getElementById('palette-options');

    if (ui && options) {
      ui.hidden = false; // only shown when JS can actually drive it

      var buttons = PALETTES.map(function (p) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.title = p.name;
        btn.setAttribute('aria-label', p.name + ' palette');
        btn.setAttribute('aria-pressed', String(p.id === active));
        btn.innerHTML =
          '<span class="swatch"><i style="background:' + p.aRamp[4] + '"></i>' +
          '<i style="background:' + p.bRamp[6] + '"></i></span>';
        btn.addEventListener('click', function () {
          active = apply(p.id, true).id;
          buttons.forEach(function (b, i) {
            b.setAttribute('aria-pressed', String(PALETTES[i].id === active));
          });
        });
        options.appendChild(btn);
        return btn;
      });
    }

    // ── scroll-reveal header (index only) ─────────────────────────────
    // A passive scroll listener, not the handoff's always-on rAF loop.
    var nav = document.getElementById('site-nav');
    if (nav) {
      var shown = false;
      var onScroll = function () {
        var past = (window.scrollY || document.documentElement.scrollTop || 0) > 120;
        if (past !== shown) { shown = past; nav.classList.toggle('is-visible', past); }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  });
})();
