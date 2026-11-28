/* Cover order tool: add ?order to the home page URL */
(function(){
  if(!/[?&]order\b/.test(location.search)) return;
  function init(){
    var wall=document.getElementById('fwall'); if(!wall||!wall.children.length) return setTimeout(init,300);
    var st=document.createElement('style');
    st.textContent='#fwall.ord>a{cursor:grab;touch-action:none;outline:2px dashed #f567af;outline-offset:-2px;position:relative}#fwall.ord>a::after{content:attr(data-n);position:absolute;top:8px;left:8px;background:#f567af;color:#fff;font:800 14px/1 system-ui;padding:6px 8px;border-radius:4px}#fwall.ord>a.drag{opacity:.35}#ordbar{position:fixed;right:16px;bottom:16px;z-index:9999;background:#111;color:#fff;padding:14px 16px;border-radius:10px;font:600 14px/1.3 system-ui;box-shadow:0 6px 24px rgba(0,0,0,.35);max-width:320px}#ordbar b{display:block;margin-bottom:8px}#ordbar button{margin:8px 6px 0 0;background:#f567af;color:#fff;border:0;padding:9px 12px;border-radius:6px;font:700 13px system-ui;cursor:pointer}#ordbar button.g{background:#444}';
    document.head.appendChild(st);
    wall.classList.add('ord');
    var orig=[].slice.call(wall.children);
    function num(){[].forEach.call(wall.children,function(a,i){a.dataset.n=i+1})}
    num();
    [].forEach.call(wall.children,function(a){a.addEventListener('click',function(e){e.preventDefault()})});
    var drag=null;
    wall.addEventListener('pointerdown',function(e){var a=e.target.closest('#fwall>a');if(!a)return;e.preventDefault();drag=a;a.classList.add('drag');a.setPointerCapture&&a.setPointerCapture(e.pointerId)});
    document.addEventListener('pointermove',function(e){if(!drag)return;var el=document.elementFromPoint(e.clientX,e.clientY);var t=el&&el.closest('#fwall>a');if(!t||t===drag)return;var kids=[].slice.call(wall.children);if(kids.indexOf(t)>kids.indexOf(drag))t.after(drag);else t.before(drag);num()});
    document.addEventListener('pointerup',function(){if(drag){drag.classList.remove('drag');drag=null}});
    var bar=document.createElement('div');bar.id='ordbar';
    bar.innerHTML='<b>Reorder covers</b>Drag the covers into the order you want, then copy the order and paste it to Claude.<br><button id="ordcopy">Copy order</button><button class="g" id="ordreset">Reset</button>';
    document.body.appendChild(bar);
    function ids(){return [].map.call(wall.children,function(a){return a.dataset.id||a.getAttribute('href')})}
    document.getElementById('ordcopy').onclick=function(){var t='Cover order for '+location.host+':\n'+ids().map(function(x,i){return (i+1)+'. '+x}).join('\n');
      (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){bar.querySelector('#ordcopy').textContent='Copied ✓'},function(){prompt('Copy this:',t)})};
    document.getElementById('ordreset').onclick=function(){orig.forEach(function(a){wall.appendChild(a)});num()};
    var f=document.getElementById('features'); if(f) f.scrollIntoView();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
