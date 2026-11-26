/* Live tuning panel for feature articles. Opens only when the URL ends in ?tune.
   Adjusts the opening-box variables on the real page; "Copy settings" puts them on the clipboard. */
(function(){
  if(!/[?&]tune\b/.test(location.search))return;
  var hero=document.querySelector('.hero');if(!hero)return;
  var cs=getComputedStyle(hero);var heroTune=!!cs.getPropertyValue('--gap-name').trim()&&!!hero.querySelector('h1');
  var C=[
    ['Space above profile line','--gap-top',0,200,1,'px'],
    ['Space under profile line','--gap-eyebrow',0,120,1,'px'],
    ['Name size','--name-size',3,12,.1,'rem'],
    ['Name line spacing','--name-lh',.6,1.3,.01,''],
    ['Name letter spacing','--name-ls',-.1,.2,.005,'em'],
    ['Space under name','--gap-name',0,120,1,'px'],
    ['Title size','--deck-size',1,5,.05,'rem'],
    ['Title line spacing','--deck-lh',.8,1.6,.01,''],
    ['Space between title lines','--deck-gap',0,60,1,'px'],
    ['Space above credits','--gap-deck',0,140,1,'px'],
    ['Whole text size','--txt-scale',.5,1.6,.01,''],
    ['Profile line size','--eyebrow-size',.6,3,.05,'rem'],
    ['Credits size','--credits-size',.6,2.5,.05,'rem'],
    ['Space between name and job line','--sub-gap',0,80,1,'px']
  ].filter(function(c){return ['--txt-scale','--eyebrow-size','--credits-size','--sub-gap'].indexOf(c[1])<0||cs.getPropertyValue(c[1]).trim()});
  var K=[['First name','.hero h1','color'],['Last name','.hero h1 span','color'],['Title line 1','.hero .deck b','color'],['Title line 2','.hero .deck','color'],['Profile line & credits','.hero .eyebrow, .hero .credits','color']];
  var st=document.createElement('style');document.head.appendChild(st);var col={};
  function css(){st.textContent=Object.keys(col).map(function(s){return s+'{color:'+col[s]+' !important}'}).join('\n')}
  var p=document.createElement('div');p.id='tune';
  p.innerHTML='<style>#tune{position:fixed;right:12px;bottom:12px;z-index:9999;width:300px;max-height:80vh;overflow:auto;background:#fff;color:#000;font:14px/1.3 -apple-system,Helvetica,Arial,sans-serif;border:1px solid #ccc;border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,.25);padding:12px}#tune h4{margin:0 0 8px;font-size:15px;display:flex;justify-content:space-between}#tune label{display:block;margin:8px 0 2px}#tune input[type=range]{width:100%}#tune .row{display:flex;justify-content:space-between;align-items:center;margin:6px 0}#tune button{font:600 13px -apple-system,Helvetica,Arial;padding:8px 10px;border:0;border-radius:6px;background:#000;color:#fff;cursor:pointer;margin-top:10px;width:100%}#tune .min{background:none;color:#000;width:auto;margin:0;padding:0 4px;font-size:18px}#tune.c>:not(h4){display:none}</style><h4>Tune <button class="min" title="Hide">–</button></h4>';
  var side=hero.querySelector('.side');
  if(!heroTune&&side&&cs.getPropertyValue('--vs').trim()){C=[
    ['Whole text size','--txt-scale',.5,1.6,.01,''],
    ['Verse size','--vs',1.5,7,.05,'rem'],
    ['Verse line spacing','--vlh',.7,1.4,.01,''],
    ['Verse letter spacing','--vls',-.08,.15,.005,'em'],
    ['Space under verse','--vgap',0,80,1,'px'],
    ['Reference size','--rs',1,5,.05,'rem'],
    ['Space above credit lines','--cgap',0,120,1,'px'],
    ['Credits size','--credits-size',.6,2.5,.05,'rem'],
    ['Text box width','--sidew',30,100,1,'%']
  ];K=[['Verse','.hero .side .verse','color'],['Reference','.hero .side .ref','color'],['Credits','.hero .side .credits, .hero .side .credits b, .hero .side .credits span','color']]}
  else if(!heroTune){C=[];K=[];}
  if(C.length){var hb=document.createElement('h4');hb.textContent='Opening box';hb.style.cssText='margin:14px 0 0;border-top:1px solid #ddd;padding-top:10px';p.appendChild(hb)}
  C.forEach(function(c){
    var v=parseFloat(cs.getPropertyValue(c[1]));if(isNaN(v))v=c[2];
    var l=document.createElement('label');l.innerHTML=c[0]+': <b>'+v+c[5]+'</b>';
    var r=document.createElement('input');r.type='range';r.min=c[2];r.max=c[3];r.step=c[4];r.value=v;r.dataset.v=c[1];r.dataset.u=c[5];
    r.oninput=function(){hero.style.setProperty(c[1],r.value+c[5]);l.querySelector('b').textContent=r.value+c[5]};
    p.appendChild(l);p.appendChild(r);
  });
  K.forEach(function(k){
    var el=document.querySelector(k[1].split(',')[0]);if(!el)return;var rgb=getComputedStyle(el).color.match(/\d+/g).slice(0,3);
    var hex='#'+rgb.map(function(x){return(+x).toString(16).padStart(2,'0')}).join('');
    var d=document.createElement('div');d.className='row';d.innerHTML='<span>'+k[0]+'</span>';
    var i=document.createElement('input');i.type='color';i.value=hex;i.oninput=function(){col[k[1]]=i.value;css()};
    d.appendChild(i);p.appendChild(d);
  });
  var b=document.createElement('button');b.textContent='Copy settings to send to Claude';
  b.onclick=function(){
    var out=['Settings for '+location.pathname];
    p.querySelectorAll('input[type=range][data-v]').forEach(function(r){out.push(r.previousSibling.textContent)});
    Object.keys(col).forEach(function(s){out.push(K.filter(function(k){return k[1]===s})[0][0]+' colour: '+col[s])});
    Object.keys(done).forEach(function(n){var v=done[n];out.push('Photo '+n+': zoom '+v.z+', left/right '+v.x+'%, up/down '+v.y+'%, move up/down '+(v.my||0)+'px, move left/right '+(v.mx||0)+'px, brightness '+v.br+', contrast '+v.ct+', highlights '+v.hl+', shadows '+v.sh+', saturation '+v.sa+', warmth '+v.wa+', crop left '+(v.kl||0)+'%, crop right '+(v.kr||0)+'%, crop top '+(v.kt||0)+'%, crop bottom '+(v.kb||0)+'%')});
    Object.keys(tdone).forEach(function(n){var v=tdone[n];out.push('Text '+n+': up/down '+v.y+'px, left/right '+v.x+'px')});
    var t=out.join('\n');
    (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){b.textContent='Copied. Paste it in the chat.'},function(){prompt('Copy these settings:',t)});
  };
  p.appendChild(b);

  /* ---- Photos: click a photo, then zoom and move it inside its box ---- */
  var ph=document.createElement('div');
  ph.innerHTML='<h4 style="margin:0 0 4px">Photos</h4><p class="hint" style="margin:0;color:#666">Click a photo on the page to select it.</p><div class="pc" hidden><p class="nm" style="margin:6px 0;font-weight:600"></p><label>Zoom: <b>1</b> <span style="color:#888">(below 1 = zoom out)</span></label><input type=range min=.2 max=4 step=.01 data-k=z><label>Left / right: <b>50</b>%</label><input type=range min=0 max=100 step=.5 data-k=x><label>Up / down: <b>50</b>%</label><input type=range min=0 max=100 step=.5 data-k=y><label>Move up / down: <b>0</b> px <span style="color:#888">(minus = up)</span></label><input type=range min=-1200 max=1200 step=1 data-k=my><label>Move left / right: <b>0</b> px <span style="color:#888">(minus = left)</span></label><input type=range min=-1200 max=1200 step=1 data-k=mx><label>Brightness: <b>0</b></label><input type=range min=-100 max=100 step=1 value=0 data-k=br><label>Contrast: <b>0</b></label><input type=range min=-100 max=100 step=1 value=0 data-k=ct><label>Highlights: <b>0</b></label><input type=range min=-100 max=100 step=1 value=0 data-k=hl><label>Shadows: <b>0</b></label><input type=range min=-100 max=100 step=1 value=0 data-k=sh><label>Saturation: <b>0</b></label><input type=range min=-100 max=100 step=1 value=0 data-k=sa><label>Warmth: <b>0</b></label><input type=range min=-100 max=100 step=1 value=0 data-k=wa><label>Crop left: <b>0</b>%</label><input type=range min=0 max=49 step=.5 value=0 data-k=kl><label>Crop right: <b>0</b>%</label><input type=range min=0 max=49 step=.5 value=0 data-k=kr><label>Crop top: <b>0</b>%</label><input type=range min=0 max=49 step=.5 value=0 data-k=kt><label>Crop bottom: <b>0</b>%</label><input type=range min=0 max=49 step=.5 value=0 data-k=kb><button class=rs0 style="background:#777;margin-top:8px">Reset this photo</button></div>';
  p.insertBefore(ph,p.querySelector('h4').nextSibling);
  var sel=null,done={};
  var st2=document.createElement('style');st2.textContent='.tunewrap{display:block;overflow:hidden;border-radius:2px}.tunesel{outline:4px solid #f567af;outline-offset:-4px}main img{cursor:crosshair}';document.head.appendChild(st2);
  function nameOf(img){return (img.dataset.orig||img.getAttribute('src')).split('/').pop()}
  function state(img){var o=(img.style.objectPosition||getComputedStyle(img).objectPosition).split(' ');
    var px=function(v){return /%$/.test(v)?parseFloat(v):(v==='left'||v==='top'?0:v==='right'||v==='bottom'?100:50)};
    var cm=(img.style.clipPath||'').match(/inset\(([\d.]+)%?\s+([\d.]+)%?\s+([\d.]+)%?\s+([\d.]+)%?\)/),c=cm?[+cm[1],+cm[2],+cm[3],+cm[4]]:[0,0,0,0];var m=(img.style.transform||'').match(/scale\(([\d.]+)\)/),t=(img.style.transform||'').match(/translate\((-?[\d.]+)px, *(-?[\d.]+)px\)/)||(img.style.transform||'').match(/translateY\((-?[\d.]+)px\)()/);return{z:m?+m[1]:1,x:px(o[0]),y:px(o[1]||o[0]),my:t?(t[2]===''||t[2]===undefined?+t[1]:+t[2]):0,mx:t&&t[2]!==''&&t[2]!==undefined?+t[1]:0,br:0,ct:0,hl:0,sh:0,sa:0,wa:0,kt:c[0],kr:c[1],kb:c[2],kl:c[3]}}
  function wrap(img){if(img.closest('.ph,.tunewrap'))return;var w=document.createElement('span');w.className='tunewrap';img.parentNode.insertBefore(w,img);w.appendChild(img)}

  /* Tone curve. Must match _build/tone.py exactly (applied to the files when publishing). */
  function curve(x,t){
    x=x*Math.pow(2,t.br/100);
    x=(x-0.5)*(1+t.ct/100)+0.5;
    x=x+(t.sh/100)*0.4*Math.pow(1-Math.min(Math.max(x,0),1),3);
    x=x+(t.hl/100)*0.4*Math.pow(Math.min(Math.max(x,0),1),3);
    return Math.min(Math.max(x,0),1)}
  /* Preview by recalculating pixels on a canvas (works in Safari, Chrome, Firefox; same maths as tone.py) */
  var srcs={},pend={};
  function tone(img,t){
    if(!img.dataset.orig)img.dataset.orig=img.getAttribute('src');
    var zero=!t.br&&!t.ct&&!t.hl&&!t.sh&&!t.sa&&!t.wa;
    if(zero){if(img.getAttribute('src')!==img.dataset.orig)img.src=img.dataset.orig;return}
    pend[img.dataset.orig]=[img,t];
    if(pend.raf)return;pend.raf=requestAnimationFrame(function(){pend.raf=0;Object.keys(pend).forEach(function(k){if(k==='raf')return;var q=pend[k];delete pend[k];render(q[0],q[1])})});
  }
  function render(img,t){
    var o=img.dataset.orig,src=srcs[o];
    if(!src){src=srcs[o]=new Image();src.onload=function(){render(img,t)};src.src=o;return}
    if(!src.complete||!src.naturalWidth)return;
    var r=img.getBoundingClientRect(),dpr=window.devicePixelRatio||1,W=src.naturalWidth,H=src.naturalHeight;
    var sc=Math.min(1,Math.max(r.width,r.height)*dpr*1.3/Math.max(W,H));var w=Math.round(W*sc),h=Math.round(H*sc);
    var c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');x.drawImage(src,0,0,w,h);
    var d=x.getImageData(0,0,w,h),p=d.data,lut=new Float32Array(256);for(var i=0;i<256;i++)lut[i]=curve(i/255,t);
    var s=1+t.sa/100,m=[.213+.787*s,.715-.715*s,.072-.072*s,.213-.213*s,.715+.285*s,.072-.072*s,.213-.213*s,.715-.715*s,.072+.928*s],wm=t.wa/100*.1;
    for(i=0;i<p.length;i+=4){var R=lut[p[i]],G=lut[p[i+1]],B=lut[p[i+2]];
      var r2=m[0]*R+m[1]*G+m[2]*B,g2=m[3]*R+m[4]*G+m[5]*B,b2=m[6]*R+m[7]*G+m[8]*B;
      r2=Math.min(Math.max(r2,0),1)*(1+wm);b2=Math.min(Math.max(b2,0),1)*(1-wm);g2=Math.min(Math.max(g2,0),1);
      p[i]=Math.min(r2,1)*255+.5;p[i+1]=g2*255+.5;p[i+2]=Math.min(b2,1)*255+.5}
    x.putImageData(d,0,0);img.src=/\.(webp|png)(\?|$)/i.test(o)?c.toDataURL('image/png'):c.toDataURL('image/jpeg',.92);
  }
  function apply(img,v){wrap(img);img.style.objectPosition=v.x+'% '+v.y+'%';img.style.transformOrigin=v.x+'% '+v.y+'%';img.style.transform=((v.mx||v.my)?'translate('+(v.mx||0)+'px, '+(v.my||0)+'px) ':'')+'scale('+v.z+')';img.style.clipPath=(v.kt||v.kr||v.kb||v.kl)?'inset('+(v.kt||0)+'% '+(v.kr||0)+'% '+(v.kb||0)+'% '+(v.kl||0)+'%)':'';tone(img,v);done[nameOf(img)]=v}
  var pc=ph.querySelector('.pc'),rs=pc.querySelectorAll('input');
  document.querySelector('main').addEventListener('click',function(e){
    var img=e.target.closest('img');if(!img||img.closest('.rack,#tune,header'))return;e.preventDefault();e.stopPropagation();
    if(sel)sel.classList.remove('tunesel');sel=img;img.classList.add('tunesel');
    var v=done[nameOf(img)]||state(img);pc.hidden=false;ph.querySelector('.hint').hidden=true;pc.querySelector('.nm').textContent=nameOf(img);
    rs.forEach(function(r){r.value=v[r.dataset.k];r.previousElementSibling.querySelector('b').textContent=v[r.dataset.k]});
    p.classList.remove('c');
  },true);
  pc.querySelector('.rs0').onclick=function(){if(!sel)return;var v=state(sel);v.z=1;v.my=0;v.mx=0;delete done[nameOf(sel)];apply(sel,v);delete done[nameOf(sel)];rs.forEach(function(r){r.value=v[r.dataset.k];r.previousElementSibling.querySelector('b').textContent=v[r.dataset.k]})};
  rs.forEach(function(r){r.oninput=function(){if(!sel)return;var v={};rs.forEach(function(q){v[q.dataset.k]=+q.value;q.previousElementSibling.querySelector('b').textContent=q.value});apply(sel,v)}});

  /* ---- Text blocks: click a quote, headline or paragraph block, then move it ---- */
  var tx=document.createElement('div');
  tx.innerHTML='<h4 style="margin:14px 0 4px;border-top:1px solid #ddd;padding-top:10px">Text blocks</h4><p class="hint" style="margin:0;color:#666">Click any text, including the opening box lines, to select it.</p><button class="selall" style="margin:6px 0 0;background:#333">Select whole opening-box text</button><div class="tc" hidden><p class="nm" style="margin:6px 0;font-weight:600"></p><label>Up / down: <b>0</b> px <span style="color:#888">(minus = up)</span></label><input type=range min=-1200 max=1200 step=1 value=0 data-k=y><label>Left / right: <b>0</b> px <span style="color:#888">(minus = left)</span></label><input type=range min=-1200 max=1200 step=1 value=0 data-k=x><button class=rs1 style="background:#777;margin-top:8px">Reset this block</button></div>';
  ph.parentNode.insertBefore(tx,ph.nextSibling);
  var TSEL='.pq .q,.big,.inline,.col h2,.lede,.basics,.col,.hero .side,.hero .eyebrow,.hero h1,.hero .deck,.hero .credits',tsel=null,tdone={};
  var st3=document.createElement('style');st3.textContent='.tunetsel{outline:3px dashed #f567af;outline-offset:6px}';document.head.appendChild(st3);
  function tname(el){if(el.matches('.hero .txt,.hero .side'))return 'Opening box text (whole block)';return '“'+el.textContent.replace(/\s+/g,' ').trim().split(' ').slice(0,5).join(' ')+'…”'}
  var tc=tx.querySelector('.tc'),trs=tc.querySelectorAll('input');
  function tapply(el,v){el.style.position='relative';el.style.top=v.y+'px';el.style.left=v.x+'px';if(v.x||v.y)tdone[tname(el)]=v;else delete tdone[tname(el)]}
  document.querySelector('main').addEventListener('click',function(e){
    if(e.target.closest('img,#tune'))return;var el=e.target.closest(TSEL);if(!el)return;e.preventDefault();e.stopPropagation();
    if(tsel)tsel.classList.remove('tunetsel');tsel=el;el.classList.add('tunetsel');
    var v=tdone[tname(el)]||{x:parseFloat(el.style.left)||0,y:parseFloat(el.style.top)||0};tc.hidden=false;tx.querySelector('.hint').hidden=true;tc.querySelector('.nm').textContent=tname(el);
    trs.forEach(function(r){r.value=v[r.dataset.k];r.previousElementSibling.querySelector('b').textContent=v[r.dataset.k]});
    p.classList.remove('c');
  },true);
  trs.forEach(function(r){r.oninput=function(){if(!tsel)return;var v={};trs.forEach(function(q){v[q.dataset.k]=+q.value;q.previousElementSibling.querySelector('b').textContent=q.value});tapply(tsel,v)}});
  tx.querySelector('.selall').onclick=function(){var el=document.querySelector('.hero .txt')||document.querySelector('.hero .side');if(!el)return;if(tsel)tsel.classList.remove('tunetsel');tsel=el;el.classList.add('tunetsel');var v=tdone[tname(el)]||{x:parseFloat(el.style.left)||0,y:parseFloat(el.style.top)||0};tc.hidden=false;tc.querySelector('.nm').textContent=tname(el);trs.forEach(function(r){r.value=v[r.dataset.k];r.previousElementSibling.querySelector('b').textContent=v[r.dataset.k]});};
  tc.querySelector('.rs1').onclick=function(){if(!tsel)return;tapply(tsel,{x:0,y:0});trs.forEach(function(r){r.value=0;r.previousElementSibling.querySelector('b').textContent=0})};
  var r=document.createElement('button');r.textContent='Reset';r.style.background='#777';r.onclick=function(){location.reload()};p.appendChild(r);
  p.querySelector('.min').onclick=function(){p.classList.toggle('c')};
  document.body.appendChild(p);
})();
