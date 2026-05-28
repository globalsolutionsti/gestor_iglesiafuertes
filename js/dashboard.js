/* =====================================================
DASHBOARD
===================================================== */

function loadDashboard(){

mostrarLoader();

const callbackName =
"dashboard_" + Date.now();

const script =
document.createElement("script");

/* =====================================================
CALLBACK
===================================================== */

window[callbackName] = function(result){

try{

if(!result || !result.status){

ocultarLoader();

Swal.fire({
icon:"error",
title:"Error obteniendo datos"
});

return;

}

const data =
result.data || [];

/* =====================================================
QUITAR ENCABEZADOS
===================================================== */

const registros =
data.slice(1);

/* =====================================================
TOTAL SERVIDORES
===================================================== */

document.getElementById(
"totalServidores"
).innerText =
registros.length;

/* =====================================================
SERVIDORES ACTIVOS
===================================================== */

const activos =
registros.filter(r=>
String(r[12] || "")
.toUpperCase() === "ACTIVO"
);

document.getElementById(
"totalActivos"
).innerText =
activos.length;

/* =====================================================
MINISTERIOS UNICOS
===================================================== */

const ministerios =
new Set();

registros.forEach(r=>{

if(r[6]){
ministerios.add(r[6]);
}

if(r[7]){
ministerios.add(r[7]);
}

if(r[8]){
ministerios.add(r[8]);
}

if(r[9]){
ministerios.add(r[9]);
}

});

document.getElementById(
"totalMinisterios"
).innerText =
ministerios.size;

/* =====================================================
EVENTOS DEMO
===================================================== */

document.getElementById(
"totalEventos"
).innerText = 0;

/* =====================================================
RESUMEN ESTADISTICAS
===================================================== */

const contenedor =
document.getElementById(
"estadisticasDashboard"
);

let html = "";

/* =====================================================
CONTAR POR MINISTERIO
===================================================== */

const conteoMinisterios = {};

registros.forEach(r=>{

const ministerio =
r[6] || "Sin Ministerio";

if(!conteoMinisterios[ministerio]){

conteoMinisterios[ministerio] = 0;

}

conteoMinisterios[ministerio]++;

});

/* =====================================================
RENDER
===================================================== */

Object.keys(conteoMinisterios)
.forEach(min=>{

html += `

<div class="activity-item d-flex justify-content-between align-items-center">

<div>

<i class="fa fa-users text-primary me-2"></i>

${min}

</div>

<span class="badge bg-primary">

${conteoMinisterios[min]}

</span>

</div>

`;

});

if(html === ""){

html = `

<div class="activity-item">
No existen estadísticas
</div>

`;

}

contenedor.innerHTML = html;

/* =====================================================
CLICK CARD
===================================================== */

const cardServidores =
document.getElementById(
"cardServidores"
);

if(cardServidores){

cardServidores.onclick = function(){

window.location.href =
"servidores.html";

};

}

ocultarLoader();

/* =====================================================
LIMPIEZA
===================================================== */

delete window[callbackName];

if(script){
script.remove();
}

}catch(error){

ocultarLoader();

console.error(error);

Swal.fire({
icon:"error",
title:error.toString()
});

}

};

/* =====================================================
LLAMADA JSONP
===================================================== */

script.src =
`${API_URL}?action=getServidores&callback=${callbackName}`;

script.onerror = function(){

ocultarLoader();

Swal.fire({
icon:"error",
title:"Error conexión Apps Script"
});

};

document.body.appendChild(script);

}

/* =====================================================
LOADER
===================================================== */

function mostrarLoader(){

if(document.getElementById("loader")){
return;
}

document.body.insertAdjacentHTML(

"beforeend",

`

<div
id="loader"
style="
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(255,255,255,.7);
display:flex;
justify-content:center;
align-items:center;
z-index:99999;
">

<div
class="spinner-border text-primary"
style="
width:4rem;
height:4rem;
">
</div>

</div>

`

);

}

function ocultarLoader(){

const loader =
document.getElementById("loader");

if(loader){
loader.remove();
}

}

/* =====================================================
INIT
===================================================== */

document.addEventListener(
"DOMContentLoaded",
function(){

loadDashboard();

}
);
