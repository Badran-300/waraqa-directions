/* Arabic presentation: one direction at a time, with a slide index. */
(()=>{
const $=s=>document.querySelector(s),data=window.SHOWCASE,all=data.directions,groups=data.groups,slides=['cover',...all.map(d=>d.id)];let index=0;
const safe=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=id=>`assets/${id}.webp`;
const get=id=>all.find(d=>d.id===id);
const group=d=>groups.find(g=>g.key===d.group);
const code=d=>d.id.toUpperCase();
const num=n=>String(n).replace(/\d/g,c=>'٠١٢٣٤٥٦٧٨٩'[c]);
const crop=(id,cls='')=>`<div class="crop-hero ${cls}" style="--hero-scale:${10000/(get(id).thumbSplit||65)}%"><img src="${asset(id)}" alt="${safe(get(id).name)}" loading="lazy"></div>`;
const palette=d=>`<div class="palette" aria-label="ألوان مقترحة">${d.palette.map(c=>`<div class="swatch"><i style="background:${c}"></i><span>${c.toUpperCase()}</span></div>`).join('')}</div>`;
const top=(label,id)=>`<div class="slide-top"><span class="collection-mark"><i></i>بوابة الموظفين / ${label}</span><span class="code">${id}</span></div>`;
const bottom=label=>`<div class="slide-bottom"><span>ورقة · استكشاف الشخصية</span><span>${label}</span><span>تصوّرات أولية · أكتوبر ٢٠٢٦</span></div>`;
const demos=[
 {title:'أهلًا بك في الفريق',text:'تعرّف على أقسام البوابة.',action:'اكتشف البوابة',en:'Welcome'},
 {title:'شارك فكرتك',text:'أضف اقتراحك لتطوير العمل.',action:'أضف فكرتك',en:'Ideas'},
 {title:'إجابة صحيحة',text:'يمكنك الانتقال إلى السؤال التالي.',action:'السؤال التالي',en:'Feedback'},
 {title:'فعاليات الفريق',text:'اطّلع على مواعيد الفعاليات القادمة.',action:'عرض الفعاليات',en:'Reminder'}
];
function demo(d){const m=d.demo||demos[(d.index-1)%4];return `<div class="portal-demo"><div class="demo-label">داخل البوابة <span>مثال توضيحي</span></div><div class="portal-content"><div class="portal-copy" lang="ar" dir="rtl"><strong>${m.title}</strong><p>${m.text}</p><span class="demo-action">${m.action}</span></div>${crop(d.id,'mini-mascot')}</div></div>`}
function cover(){return `<section class="slide cover">${top('استكشاف الشخصية','٧٠ اتجاهًا')}<p class="cover-kicker">خامات مختلفة. ملامح جديدة.</p><h1>ورقة<br>بأربعين<br><em>شكلًا.</em></h1><p class="cover-sub">ومعها ثلاثون شخصية جديدة لبوابة الموظفين.</p>${crop('a01','cover-art')}<div class="cover-metrics"><div><b>٤٠</b><span>اتجاهًا لورقة</span></div><div><b>٣٠</b><span>شخصية جديدة</span></div><div><b>٧</b><span>مجموعات</span></div></div>${bottom('الشخصية هي الأساس')}</section>`}
function direction(d){const g=group(d);return `<section class="slide direction" style="--tint:${g.theme}" data-direction="${d.id}">${top(safe(g.label),code(d))}<div class="direction-head"><div><h1>${safe(d.name)}</h1><p class="subtitle">${safe(d.tagline)}</p></div><span class="direction-kind">${['e','f','g'].includes(d.group)?'شخصية جديدة':'ورقة / '+num(String(d.index).padStart(2,'0'))+' من ١٠'}</span></div><img class="sheet" src="${asset(d.id)}" alt="${safe(d.name)}: الشخصية في أربع وضعيات للترحيب والتأكيد والتفكير والتذكير."><div class="art-captions"><span>${['e','f','g'].includes(d.group)?'شخصية جديدة':'تصوّر لشخصية ورقة'}</span><span class="poses">ترحيب · تأكيد · تفكير · تذكير</span></div><aside class="direction-info"><p class="eyebrow">الفكرة</p><p class="persona">${safe(d.persona)}</p><p class="use-line"><b>الاستخدام</b>${safe(d.use)}</p>${palette(d)}<div class="motion-note"><b>حركة<br>مقترحة</b><p>${safe(d.motion)}</p></div>${demo(d)}</aside>${bottom(safe(g.board))}</section>`}

function scale(){if(document.body.classList.contains('export-mode'))return;if(innerWidth<=760){$('#stage').style.setProperty('--scale',1);return}const v=$('#viewport');$('#stage').style.setProperty('--scale',Math.min((v.clientWidth-32)/1440,(v.clientHeight-32)/810))}
function drawer(open){document.body.classList.toggle('index-open',open);$('#indexButton').setAttribute('aria-expanded',String(open));$('#presentation').inert=open&&innerWidth<=1100;if(open)$('#closeIndex').focus();else $('#indexButton').focus()}
function buildIndex(){
 $('#slideIndex').innerHTML='<button class="index-cover" data-go="cover">الغلاف</button>'+groups.map(g=>'<details class="index-group" data-group="'+g.key+'"><summary>'+safe(g.label)+'<span>١٠</span></summary><div class="index-items">'+all.filter(d=>d.group===g.key).map(d=>'<button class="index-item" data-go="'+d.id+'">'+crop(d.id,'index-thumb')+'<span><small>'+code(d)+'</small><b>'+safe(d.name)+'</b></span></button>').join('')+'</div></details>').join('');
 for(const el of document.querySelectorAll('.index-group'))el.addEventListener('toggle',()=>{if(el.open)for(const other of document.querySelectorAll('.index-group'))if(other!==el)other.open=false});
}
function render(){const id=slides[index],d=get(id);$('#stage').innerHTML=d?direction(d):cover();$('#position').textContent=num(index+1)+' / '+num(slides.length);$('#prevButton').disabled=index===0;$('#nextButton').disabled=index===slides.length-1;document.title=d?d.name+' — ورقة':'ورقة — عرض الشخصيات';for(const b of document.querySelectorAll('[data-go]')){const active=b.dataset.go===id;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')}if(d){const section=document.querySelector('[data-group="'+d.group+'"]');section.open=true;requestAnimationFrame(()=>document.querySelector('.index-item.active')?.scrollIntoView({block:'nearest'}))}$('#viewport').scrollTop=0;scale();const next=get(slides[index+1]);if(next){const im=new Image();im.src=asset(next.id)}}
function go(id){const n=slides.indexOf(id);if(n<0)return;index=n;history.replaceState(null,'','#'+id);render();if(innerWidth<=1100&&document.body.classList.contains('index-open'))drawer(false)}
function step(n){go(slides[Math.max(0,Math.min(slides.length-1,index+n))])}
$('#prevButton').onclick=()=>step(-1);$('#nextButton').onclick=()=>step(1);$('#indexButton').onclick=()=>drawer(true);$('#closeIndex').onclick=()=>drawer(false);$('#indexBackdrop').onclick=()=>drawer(false);
$('#slideIndex').addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)go(b.dataset.go)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(document.body.classList.contains('index-open'))drawer(false);return}if(document.body.classList.contains('index-open')||e.target.matches('input,textarea,select,summary'))return;if(['ArrowLeft','PageDown'].includes(e.key)){e.preventDefault();step(1)}else if(['ArrowRight','PageUp'].includes(e.key)){e.preventDefault();step(-1)}else if(e.key==='Home'){e.preventDefault();go('cover')}else if(e.key==='End'){e.preventDefault();go(slides.at(-1))}});
let touchStart;$('#viewport').addEventListener('touchstart',e=>{touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});$('#viewport').addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>90&&Math.abs(dx)>Math.abs(dy)*1.8)step(dx>0?1:-1);touchStart=null},{passive:true});
addEventListener('resize',()=>{if(innerWidth>1100){document.body.classList.remove('index-open');$('#presentation').inert=false;$('#indexButton').setAttribute('aria-expanded','false')}scale()});addEventListener('hashchange',()=>go(location.hash.slice(1)));if(new URLSearchParams(location.search).has('export'))document.body.classList.add('export-mode');
window.waraqa={go,slides,data,render};buildIndex();go(slides.includes(location.hash.slice(1))?location.hash.slice(1):'cover');
})();
