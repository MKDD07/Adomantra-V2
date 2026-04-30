(function () {
  'use strict';

  function initSwipers() {
    /* INNER SWIPERS (4) */
    var innerSwipers = [];
    for (var i = 0; i < 4; i++) {
      innerSwipers.push(new Swiper('#innerSwiper' + i, {
        slidesPerView: 2,
        spaceBetween: 0,
        direction: 'horizontal',
        speed: 600,
        grabCursor: true,
        nested: true,
        watchSlidesProgress: true,
        pagination: { el: '#pagination' + i, clickable: true },
        navigation: { prevEl: '#prev' + i, nextEl: '#next' + i },
        breakpoints: {
          0: { slidesPerView: 1.15, spaceBetween: 12 },
          640: { slidesPerView: 1.5, spaceBetween: 14 },
          900: { slidesPerView: 2, spaceBetween: 16 },
          1400: { slidesPerView: 2.5, spaceBetween: 20 },
        },
      }));
    }

    /* PARENT SWIPER */
    var tabs = document.querySelectorAll('#services-col-left .features-item');

    function setActiveTab(idx) {
      tabs.forEach(function (t, i) { t.classList.toggle('active', i === idx); });
      setTimeout(syncCardHeight, 650);
    }

    var parentSwiper = new Swiper('#parentSwiper', {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 700,
      allowTouchMove: false,
      on: {
        slideChange: function () {
          setActiveTab(this.activeIndex);
          innerSwipers.forEach(function (sw, i) {
            if (i !== parentSwiper.activeIndex) sw.slideTo(0, 0);
          });
        }
      }
    });

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var idx = parseInt(tab.dataset.index, 10);
        parentSwiper.slideTo(idx);
        setActiveTab(idx);
      });
    });

    syncCardHeight();

    if (window.ResizeObserver) {
      new ResizeObserver(syncCardHeight)
        .observe(document.getElementById('services-col-left'));
    }
    window.addEventListener('resize', syncCardHeight);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initSwipers)
    : initSwipers();

})();
function startMorphAnimation() {
  gsap.registerPlugin(MorphSVGPlugin);

  const tl = gsap.timeline({
    defaults: { duration: 2, ease: "expo.inOut" },
    repeat: -1
  });

  tl.to("#morph", { morphSVG: "#speech" })
    .to("#morph", { morphSVG: "#rocket" })
    .to("#morph", { morphSVG: "#lightning" })
    .to("#morph", { morphSVG: "#thumb" })
    .to("#morph", { morphSVG: "#square" })
    .to("#morph", { morphSVG: "#grid" })
    .to("#morph", { morphSVG: "#bulb" })
    .to("#morph", { morphSVG: "#morph" });

  return tl; // optional (if you want to control it later)
}

// call it
startMorphAnimation();
