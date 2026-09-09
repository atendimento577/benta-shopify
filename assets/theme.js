document.addEventListener('DOMContentLoaded', function () {
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
});
