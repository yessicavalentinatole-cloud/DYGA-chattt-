function load(){try{return JSON.parse(localStorage.getItem("dyga"))||{}}catch(e){return{}}}
function save(){try{localStorage.setItem("dyga",JSON.stringify({C,Q,A}))}catch(e){}}
const $=id=>document.getElementById(id),N=["","Alta","Media","Baja"],D=load(),C=D.C||[],Q=D.Q||[],A=D.A||[],ES=["Pendiente","En proceso","Atendida"];
const money=n=>"$"+n.toLocaleString("es-CO",{maximumFractionDigits:2});
function say(t,k){const m=$("msg");m.textContent=t;m.className="msg "+(k||"ok");m.style.display="block"}
function esc(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{
 document.querySelectorAll("nav button").forEach(x=>x.setAttribute("aria-selected",x===b));
 document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("on",p.id===b.dataset.t));$("msg").style.display="none";draw()});
$("fc").onsubmit=e=>{e.preventDefault();const n=$("nom").value.trim(),a=$("ape").value.trim(),c=$("ced").value.trim();
 if(C.length>=10)return say("Ya se registraron los 10 clientes permitidos.","err");
 if(!n||!a||!c)return say("Nombre, apellido y cédula son obligatorios.","err");
 if(!/^\d{5,12}$/.test(c))return say("La cédula debe tener solo números, de 5 a 12 dígitos.","err");
 if(C.some(x=>x.ced===c))return say("Esa cédula ya está registrada.","err");
 C.push({nom:n+" "+a,nombre:n,ape:a,ced:c,sol:$("sol").value,pri:+$("pri").value,at:false,pre:0,tot:0,sal:0,mora:0});
 e.target.reset();$("pri").value=3;say("Cliente registrado correctamente.");draw()};
function cur(){return C[+$("sc").value]}
function need(){const c=cur();if(!c){say("Registra un cliente primero.","err");return null}return c}
$("fp").onsubmit=e=>{e.preventDefault();const c=need();if(!c)return;
 if(c.tot>0)return say("Este cliente ya tiene un préstamo registrado.","err");
 const m=+$("mon").value,t=+$("tas").value;if(!(m>0)||t<0)return say("Datos no válidos.","err");
 c.pre=m;c.tot=m+m*t/100;c.sal=c.tot;c.mora=0;e.target.reset();
 say("Préstamo registrado. Total a pagar con interés: "+money(c.tot));draw()};
$("fg").onsubmit=e=>{e.preventDefault();const c=need();if(!c)return;
 if(!c.tot)return say("Este cliente no tiene préstamo.","err");
 if(!c.sal)return say("Este cliente ya pagó su préstamo completo.","err");
 const p=+$("pag").value;if(!(p>0)||p>c.sal)return say("Monto no válido. Saldo pendiente: "+money(c.sal),"err");
 c.sal=Math.round((c.sal-p)*100)/100;if(!c.sal)c.mora=0;e.target.reset();
 say(c.sal?"Pago registrado. Saldo pendiente: "+money(c.sal):"Pago registrado. El préstamo quedó pagado por completo.");draw()};
$("fm").onsubmit=e=>{e.preventDefault();const c=need();if(!c)return;
 if(!c.tot)return say("Este cliente no tiene préstamo.","err");
 if(!c.sal)return say("Este cliente ya pagó su préstamo.","err");
 const d=parseInt($("dia").value,10);if(isNaN(d)||d<0)return say("Cantidad no válida.","err");
 c.mora=d;e.target.reset();say(d?"Mora registrada correctamente.":"El cliente está al día.");draw()};

const SEC=/fraude|bloqueo|estafa|sospech/i;
const spec=t=>SEC.test(t)?"Fraude y seguridad":t=="Cobro indebido"?"Préstamos y mora":t=="Otro"?"Información general":"Quejas y reclamos";
const carga=i=>Q.filter(x=>x.a===i&&x.e<2).length;
function asg(q){if(q.a>=0&&A[q.a])return;q.a=-1;const s=spec(q.t);let b=-1,m=99;A.forEach((x,i)=>{if(x.esp!==s)return;const l=carga(i);if(l<3&&l<m){m=l;b=i}});q.a=b}
const asn=q=>q.a>=0&&A[q.a]?esc(A[q.a].nom):"Sin asignar";
const btnQ=(q,i)=>q.e<2?`<button class="btn s" data-q="${i}">${q.e==0?"Pasar a en proceso":"Marcar atendida"}</button>`:"";
$("fa").onsubmit=e=>{e.preventDefault();const n=$("an").value.trim();if(!n)return say("Escribe el nombre del asesor.","err");A.push({nom:n,esp:$("ae").value});e.target.reset();say("Asesor registrado.");draw()};
$("fs").onsubmit=e=>{e.preventDefault();if(!C.length)return say("Registra un cliente primero.","err");const d=$("sd").value.trim();if(!d)return say("Escribe la descripción.","err");Q.push({c:+$("sk").value,t:$("st").value,d,p:1,e:0,a:-1});asg(Q[Q.length-1]);$("sd").value="";say("Reporte de seguridad registrado con prioridad alta.");draw()};
$("ced").oninput=()=>{$("ced").value=$("ced").value.replace(/\D/g,"")};
$("bus").oninput=()=>draw();
function bars(t,rows){const m=Math.max(1,...rows.map(r=>r[1]));return `<div class="card"><h2 style="font-size:1.15rem">${t}</h2>`+rows.map(r=>`<div class="bar"><span>${r[0]}</span><div><i style="width:${r[1]/m*100}%;--c:var(${r[2]})"></i></div><b>${r[3]!==undefined?r[3]:r[1]}</b></div>`).join("")+"</div>"}
function charts(pr,co,xc){const n=k=>Q.filter(x=>x.e==k).length,pp=k=>Q.filter(x=>x.p==k).length,tot=Math.max(co+xc,1);
 $("ch").innerHTML=bars("Casos por estado",[["Pendientes",n(0),"--c2"],["En proceso",n(1),"--c4"],["Atendidos",n(2),"--c3"]])+bars("Casos por prioridad",[["Alta",pp(1),"--c2"],["Media",pp(2),"--c4"],["Baja",pp(3),"--c3"]])+bars("Dinero de préstamos",[["Cobrado",co,"--c3",money(co)],["Por cobrar",xc,"--c1",money(xc)]])}
$("rst").onclick=()=>{const b=$("rst");if(!b.dataset.s){b.dataset.s=1;b.textContent="¿Seguro? Toca otra vez para borrar todo";return}C.length=0;Q.length=0;A.length=0;delete b.dataset.s;b.textContent="Borrar todos los datos";say("Se borraron todos los datos.");draw()};
function prio(t,d){const x=(t+" "+d).toLowerCase();
 if(/fraude|estafa|robo|bloqueo|bloquear|suplant|hack|clonad/.test(x))return 1;
 if(/cobro|error|demora|tard|descuent|cargo/.test(x))return 2;return 3}
$("fq").onsubmit=e=>{e.preventDefault();
 if(!C.length)return say("Registra un cliente primero.","err");
 const d=$("qd").value.trim();if(!d)return say("Escribe la descripción.","err");
 const t=$("qt").value,p=SEC.test(t)?1:prio(t,d);
 Q.push({c:+$("qc").value,t,d,p,e:0,a:-1});asg(Q[Q.length-1]);$("qd").value="";
 say("Caso registrado con prioridad "+N[p].toLowerCase()+".");draw()};
function drawQ(){Q.forEach(asg);
 const v=$("qc").value;$("qc").innerHTML=C.map((c,i)=>`<option value="${i}">${i+1}. ${esc(c.nom)} (C.C. ${esc(c.ced)})</option>`).join("");if(v&&C[v])$("qc").value=v;
 const v2=$("sk").value;$("sk").innerHTML=$("qc").innerHTML;if(v2&&C[v2])$("sk").value=v2;
 const o=Q.map((q,i)=>({q,i})).sort((a,b)=>a.q.p-b.q.p||a.i-b.i);
 $("tq").innerHTML=o.map(({q,i})=>`<tr><td>${i+1}</td><td>${esc(C[q.c].nom)}</td><td>${q.t}</td><td style="white-space:normal;min-width:180px">${esc(q.d)}</td><td><span class="pill p${q.p}">${N[q.p]}</span></td><td><span class="pill s${q.e}">${ES[q.e]}</span></td><td>${asn(q)}</td><td>${q.e<2?`<button class="btn s" data-q="${i}">${q.e==0?"Pasar a en proceso":"Marcar atendida"}</button>`:""}</td></tr>`).join("");
 $("eq").style.display=Q.length?"none":"block";
 const SG=Q.map((q,i)=>({q,i})).filter(({q})=>SEC.test(q.t));
 $("ts").innerHTML=SG.map(({q,i})=>`<tr><td>${esc(C[q.c].nom)}</td><td>${q.t}</td><td style="white-space:normal;min-width:180px">${esc(q.d)}</td><td>${asn(q)}</td><td><span class="pill s${q.e}">${ES[q.e]}</span></td><td>${btnQ(q,i)}</td></tr>`).join("");
 $("es").style.display=SG.length?"none":"block";
 $("ta").innerHTML=A.map((x,i)=>{const l=carga(i);return `<tr><td>${esc(x.nom)}</td><td>${x.esp}</td><td>${l}</td><td><span class="pill ${l<3?"s2":"p1"}">${l<3?"Disponible":"Ocupado"}</span></td></tr>`}).join("");
 $("ea").style.display=A.length?"none":"block";
 document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{Q[b.dataset.q].e++;say("Estado actualizado.");draw()})}
function draw(){save();drawQ();
 $("tc").innerHTML=C.map((c,i)=>({c,i})).filter(({c})=>(c.nom+" "+c.ced).toLowerCase().includes($("bus").value.trim().toLowerCase())).map(({c,i})=>`<tr><td>${i+1}</td><td>${esc(c.nombre)}</td><td>${esc(c.ape)}</td><td>${esc(c.ced)}</td><td>${c.sol}</td><td><span class="pill p${c.pri}">${N[c.pri]}</span></td><td><span class="pill ${c.at?"s2":"s0"}">${c.at?"Atendido":"Pendiente"}</span></td><td>${c.at?"":`<button class="btn s" data-i="${i}">Marcar atendido</button> `}<button class="btn s del" data-d="${i}">Eliminar</button></td></tr>`).join("");
 $("ec").style.display=C.length?"none":"block";
 document.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>{C[b.dataset.i].at=true;say("Cliente atendido correctamente.");draw()});
 document.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{if(!b.dataset.s){b.dataset.s=1;b.textContent="¿Seguro?";return}const i=+b.dataset.d;C.splice(i,1);for(let k=Q.length-1;k>=0;k--){if(Q[k].c==i)Q.splice(k,1);else if(Q[k].c>i)Q[k].c--}say("Cliente eliminado junto con sus casos.");draw()});
 const v=$("sc").value;$("sc").innerHTML=C.map((c,i)=>`<option value="${i}">${i+1}. ${esc(c.nom)} (C.C. ${esc(c.ced)})</option>`).join("");if(v&&C[v])$("sc").value=v;
 const c=cur();$("info").textContent=!c?"No hay clientes registrados.":!c.tot?"Sin préstamo.":`Prestado: ${money(c.pre)} · Total: ${money(c.tot)} · Saldo: ${money(c.sal)} · Mora: ${c.mora} días`;
 const M=C.filter(x=>x.mora>0&&x.sal>0);
 $("tm").innerHTML=M.map(x=>`<tr><td>${esc(x.nom)}</td><td>${esc(x.ced)}</td><td>${money(x.sal)}</td><td>${x.mora}</td><td><span class="pill ${x.mora<=30?"p2":"p1"}">${x.mora<=30?"Leve":x.mora<=90?"Moderada":"Grave"}</span></td></tr>`).join("");
 $("em").style.display=M.length?"none":"block";
 let cp=0,ac=0,pg=0,mo=0,pr=0,xc=0,co=0,mm=0;
 C.forEach(x=>{if(x.tot>0){cp++;pr+=x.pre;xc+=x.sal;co+=x.tot-x.sal;if(!x.sal)pg++;else{ac++;if(x.mora>0){mo++;mm+=x.sal}}}});
 const at=C.filter(x=>x.at).length,pc=ac?Math.floor(mo*100/ac):0;
 const S=[["Total de clientes",C.length],["Atendidos",at],["Pendientes",C.length-at],["Con préstamo",cp],["Préstamos activos",ac],["Préstamos pagados",pg],["Total prestado",money(pr)],["Total cobrado",money(co)],["Total por cobrar",money(xc)],["Clientes en mora",mo],["Monto en mora",money(mm)],["Morosidad",pc+"%"],["Casos registrados",Q.length],["Casos pendientes",Q.filter(x=>x.e==0).length],["Casos en proceso",Q.filter(x=>x.e==1).length],["Casos atendidos",Q.filter(x=>x.e==2).length],["Casos de prioridad alta",Q.filter(x=>x.p==1).length],["Asesores",A.length]];
 $("gr").innerHTML=S.map(s=>`<div class="stat"><b>${s[1]}</b><span>${s[0]}</span></div>`).join("");charts(pr,co,xc);kpi(mo)}
function kpi(mo){const k=[["Clientes",C.length],["Casos abiertos",Q.filter(x=>x.e<2).length],["Clientes en mora",mo],["Asesores",A.length]];
 $("kp").innerHTML=k.map(x=>`<div class="kpi"><b>${x[1]}</b><span>${x[0]}</span></div>`).join("")}
$("ayuda").onclick=()=>{document.querySelector('nav button[data-t="inf"]').click();window.scrollTo({top:0})};
$("sc").onchange=draw;draw();
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{const g=b.dataset.go;document.querySelector('nav button[data-t="'+g+'"]').click();setTimeout(()=>{$(g).scrollIntoView({behavior:"smooth",block:"start"});const f=$(g=="cli"?"nom":"sk");if(f)setTimeout(()=>f.focus({preventScroll:true}),600)},60)});document.querySelector('a[href="#integrantes"]').onclick=e=>{e.preventDefault();$("integrantes").scrollIntoView({behavior:"smooth"})};
(function(){document.documentElement.classList.add("mv");
const prev={},num=t=>{const n=parseFloat(t.replace(/[^\d,]/g,"").replace(",","."));return isNaN(n)?null:[n,t[0]=="$"?"$":"",t.endsWith("%")?"%":""]};
function run(){document.querySelectorAll(".kpi b,.stat b").forEach((el,i)=>{const k=(el.closest("#kp")?"k":"s")+i,t=el.textContent,o=num(t),pv=prev[k];prev[k]=t;if(!o||t===pv)return;
const from=pv&&num(pv)?num(pv)[0]:0,to=o[0],int=Number.isInteger(from)&&Number.isInteger(to),t0=performance.now();
(function f(now){const x=Math.min(1,(now-t0)/750),v=from+(to-from)*(1-Math.pow(1-x,3));el.textContent=x<1?o[1]+(int?Math.round(v):v).toLocaleString("es-CO",{maximumFractionDigits:2})+o[2]:t;if(x<1)requestAnimationFrame(f)})(t0)})}
const d0=draw;draw=function(){d0();run()};run();
const h=document.querySelector("header");
h.addEventListener("pointermove",e=>{const r=h.getBoundingClientRect();h.style.setProperty("--mx",((e.clientX-r.left)/r.width-.5).toFixed(3));h.style.setProperty("--my",((e.clientY-r.top)/r.height-.5).toFixed(3))});
h.addEventListener("pointerleave",()=>{h.style.setProperty("--mx",0);h.style.setProperty("--my",0)});
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.2});
document.querySelectorAll(".mem").forEach((m,i)=>{m.style.transitionDelay=i*.15+"s";io.observe(m)})})();
(function(){const root=document.documentElement,mt=$("mvt"),h=document.querySelector("header");
let off=false;try{off=localStorage.getItem("dygaMv")=="no"}catch(e){}
function setMv(o){off=o;root.classList.toggle("nomo",o);mt.textContent="Movimiento: "+(o?"no":"sí");try{localStorage.setItem("dygaMv",o?"no":"sí")}catch(e){}}
setMv(off);mt.onclick=()=>setMv(!off);
const cv=$("net"),cx=cv.getContext("2d"),col=getComputedStyle(root).getPropertyValue("--dot").trim()||"#ffc933";let W=0,H=0,P=[],m={x:-999,y:-999};
function rs(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;P=Array.from({length:Math.round(W*H/15000)},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.7,vy:(Math.random()-.5)*.7}))}
rs();addEventListener("resize",rs);
h.addEventListener("pointermove",e=>{const r=cv.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top});h.addEventListener("pointerleave",()=>{m.x=-999});
(function t(){if(!off){cx.clearRect(0,0,W,H);cx.fillStyle=cx.strokeStyle=col;
P.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;const dm=Math.hypot(p.x-m.x,p.y-m.y);if(dm<150){p.x+=(m.x-p.x)*.015;p.y+=(m.y-p.y)*.015}
cx.globalAlpha=.85;cx.beginPath();cx.arc(p.x,p.y,2.2,0,6.3);cx.fill();
for(let j=i+1;j<P.length;j++){const q=P[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<120){cx.globalAlpha=(1-d/120)*.5;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}
if(dm<170){cx.globalAlpha=(1-dm/170)*.9;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(m.x,m.y);cx.stroke()}})}
requestAnimationFrame(t)})();
const WD=["registrar clientes","priorizar casos urgentes","detectar fraudes","controlar la mora","ver reportes en vivo"],tp=$("tp");let wi=0,ci=0,dl=false;
(function ty(){const w=WD[wi];ci+=dl?-1:1;tp.textContent=w.slice(0,ci);let d=dl?35:70;if(!dl&&ci==w.length){dl=true;d=1400}else if(dl&&ci==0){dl=false;wi=(wi+1)%WD.length;d=300}setTimeout(ty,d)})();
["kp","gr"].forEach(id=>{const el=$(id);el.addEventListener("pointermove",e=>{const c=e.target.closest(".kpi,.stat");if(!c)return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(600px) rotateX(${(-y*14).toFixed(1)}deg) rotateY(${(x*14).toFixed(1)}deg) translateY(-4px) scale(1.03)`});el.addEventListener("pointerout",e=>{const c=e.target.closest(".kpi,.stat");if(c)c.style.transform=""})});
document.addEventListener("click",e=>{const b=e.target.closest(".btn");if(!b||off)return;const r=b.getBoundingClientRect(),s=document.createElement("span"),z=Math.max(r.width,r.height)*2;s.className="rip";s.style.cssText=`width:${z}px;height:${z}px;left:${e.clientX-r.left-z/2}px;top:${e.clientY-r.top-z/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),650)});
const sp=$("sp");addEventListener("scroll",()=>{sp.style.width=(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100)+"%"},{passive:true})})();
document.querySelectorAll("nav button").forEach(b=>b.addEventListener("click",()=>{setTimeout(()=>{$(b.dataset.t).scrollIntoView({behavior:"smooth",block:"start"});const t=b.parentElement,r=b.getBoundingClientRect(),q=t.getBoundingClientRect();t.scrollBy({left:r.left-q.left-q.width/2+r.width/2,behavior:"smooth"})},60)}));
