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
})();