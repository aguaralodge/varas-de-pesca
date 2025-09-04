
// Simple lightbox using window events
(function(){
  if (typeof window === 'undefined') return;
  window.addEventListener('openLightbox', function(e){
    var index = e.detail;
    fetch('/galleryData.js').then(r=>r.text()).then(text=>{
      try{
        var objText = text.replace(/^\s*export const galleryData\s*=\s*/, '').trim();
        var data = JSON.parse(objText);
        openLightboxWithData(data, index);
      }catch(err){ console.error(err); }
    });
  });
  function openLightboxWithData(data, index){
    var item = data[index];
    if(!item) return;
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<div class="lightbox-content"><div class="lightbox-close" title="Cerrar">×</div><img src="'+item.src+'" alt="'+(item.title||'')+'"/><div class="lightbox-caption">'+(item.title||'')+'</div></div>';
    lb.addEventListener('click', function(e){ if(e.target===lb || e.target.className==='lightbox-close') lb.remove(); });
    document.body.appendChild(lb);
  }
})();
