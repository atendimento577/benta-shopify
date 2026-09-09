document.addEventListener('DOMContentLoaded', function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Revelar elementos no scroll
  var items = document.querySelectorAll('[data-animate]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Controles de quantidade
  document.querySelectorAll('.ben-qty').forEach(function (qty) {
    var input = qty.querySelector('.ben-qty-input');
    var minus = qty.querySelector('[data-qty-minus]');
    var plus = qty.querySelector('[data-qty-plus]');
    if (minus) minus.addEventListener('click', function () {
      input.value = Math.max(1, parseInt(input.value || '1', 10) - 1);
    });
    if (plus) plus.addEventListener('click', function () {
      input.value = parseInt(input.value || '1', 10) + 1;
    });
  });

  // Cabeçalho: sombra ao rolar e recolhe ao descer, reaparece ao subir
  (function () {
    var header = document.querySelector('.ben-header');
    if (!header) return;
    var lastY = window.scrollY;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 12);
        if (y > lastY && y > 120) {
          header.classList.add('is-hidden');
        } else {
          header.classList.remove('is-hidden');
        }
        lastY = y;
        ticking = false;
      });
    }, { passive: true });
  })();

  // Acordeão das receitas (animação suave via CSS grid-template-rows)
  document.querySelectorAll('.ben-recipe-summary').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
    });
  });

  // Paralaxe suave em imagens marcadas (desativado com movimento reduzido)
  if (!reducedMotion) {
    var parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length) {
      var pTicking = false;
      var updateParallax = function () {
        parallaxEls.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          var offset = (Math.min(1, Math.max(0, progress)) - 0.5) * 36;
          el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
        });
        pTicking = false;
      };
      window.addEventListener('scroll', function () {
        if (!pTicking) { window.requestAnimationFrame(updateParallax); pTicking = true; }
      }, { passive: true });
      updateParallax();
    }

    // Botões com leve efeito magnético (só em ponteiro fino, ex: mouse)
    if (window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll('.ben-btn').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
          var r = btn.getBoundingClientRect();
          var x = e.clientX - r.left - r.width / 2;
          var y = e.clientY - r.top - r.height / 2;
          btn.style.transform = 'translate(' + (x * 0.18).toFixed(1) + 'px,' + (y * 0.35 - 2).toFixed(1) + 'px)';
        });
        btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
      });
    }
  }

  // Adicionar ao carrinho via AJAX, com aviso e fallback nativo se falhar
  var toast = document.getElementById('ben-toast');
  var toastTimer;
  function showToast(html) {
    if (!toast) return;
    toast.innerHTML = html;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 4000);
  }
  function updateCartCount(count) {
    document.querySelectorAll('.ben-cart-count').forEach(function (el) {
      el.textContent = count;
      el.classList.remove('is-bump');
      void el.offsetWidth;
      el.classList.add('is-bump');
    });
  }

  document.querySelectorAll('form[action*="/cart/add"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.classList.add('is-loading'); btn.textContent = 'Adicionando…'; }

      fetch('/cart/add.js', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) { if (!res.ok) return res.json().then(function (err) { throw err; }); return res.json(); })
        .then(function () { return fetch('/cart.js').then(function (r) { return r.json(); }); })
        .then(function (cart) {
          updateCartCount(cart.item_count);
          showToast('Benta adicionada ao carrinho. <a href="' + (window.Shopify && window.Shopify.routes ? window.Shopify.routes.root + 'cart' : '/cart') + '">Ver carrinho</a>');
        })
        .catch(function () {
          form.submit();
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.classList.remove('is-loading'); btn.textContent = originalText; }
        });
    });
  });
});
