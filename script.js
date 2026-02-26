console.log("✅ script.js cargó");
// Lightbox real-size viewer for all galleries
(function(){
  'use strict';
  var lb = document.getElementById('lightbox');
  if(!lb) return;
  var img = lb.querySelector('.lightbox-img');
  var btnClose = lb.querySelector('.lightbox-close');
  var btnPrev = lb.querySelector('.lightbox-prev');
  var btnNext = lb.querySelector('.lightbox-next');

  var currentList = [];
  var currentIndex = 0;

  function openFromList(list, index){
    currentList = list;
    currentIndex = index;
    img.src = currentList[currentIndex];
    lb.setAttribute('aria-hidden', 'false');
    lb.style.display = 'flex';
  }
  function close(){
    lb.setAttribute('aria-hidden', 'true');
    lb.style.display = 'none';
    img.removeAttribute('src');
  }
  function prev(){
    if(!currentList.length) return;
    currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    img.src = currentList[currentIndex];
  }
  function next(){
    if(!currentList.length) return;
    currentIndex = (currentIndex + 1) % currentList.length;
    img.src = currentList[currentIndex];
  }

  // Delegated click on gallery images
  document.addEventListener('click', function(e){
    var t = e.target;
    if(t.tagName === 'IMG' && t.closest('.gallery-grid')){
      // Build list from images in the same gallery grid
      var grid = t.closest('.gallery-grid');
      var imgs = Array.from(grid.querySelectorAll('img'));
      var list = imgs.map(function(el){ return el.getAttribute('src'); });
      var idx = imgs.indexOf(t);
      openFromList(list, idx);
    }
    if(t === btnClose || t === lb){
      // click on close button or backdrop
      if(t === lb && e.target !== lb) return; // ignore clicks on children
      close();
    }
    if(t === btnPrev) prev();
    if(t === btnNext) next();
  });

    // Escape key closes
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      close();
    }else if(e.key === 'ArrowLeft'){
      prev();
    }else if(e.key === 'ArrowRight'){
      next();
    }
  });

})(); // <- cierre del (function(){ ... }) del lightbox


// === Header retráctil (robusto) ===
(function initHideHeader() {
  function setup() {
    const header = document.querySelector(".site-header");
    if (!header) return false;

    let lastY = window.scrollY || 0;
    let ticking = false;

    const threshold = window.matchMedia("(max-width: 700px)").matches ? 3 : 6;

    const show = () => {
      header.classList.remove("is-hidden");
      header.classList.add("is-shown");
    };

    const hide = () => {
      header.classList.add("is-hidden");
      header.classList.remove("is-shown");
    };

    const onScroll = () => {
      const y = window.scrollY || 0;

      if (y < 80) {
        show();
        lastY = y;
        return;
      }

      if (y > lastY + threshold) hide();
      else if (y < lastY - threshold) show();

      lastY = y;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            onScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    show();
    return true;
  }

  if (setup()) return;

  document.addEventListener("DOMContentLoaded", () => {
    if (setup()) return;

    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (setup() || tries > 30) clearInterval(t);
    }, 100);
  });
})();
// LIGHTBOX
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");

// Cuando se cliquea una imagen técnica
document.querySelectorAll(".tech-img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.classList.add("open");
  });
});

// Cerrar lightbox al hacer click en la X o fondo
lightboxClose.addEventListener("click", () => {
  lightbox.classList.remove("open");
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove("open");
  }
});

