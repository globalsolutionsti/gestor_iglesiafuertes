/* =====================================================
DASHBOARD
===================================================== */

async function loadDashboard(){

try{

mostrarLoader();

/* =====================================================
OBTENER ESTADISTICAS
===================================================== */

const response = await fetch(
`${API_URL}?action=estadisticas`
);

const data = await response.json();

console.log("DASHBOARD:", data);

/* =====================================================
VALIDAR RESPUESTA
===================================================== */

if(!data){

throw new Error(
"No se recibieron estadísticas"
);

}

/* =====================================================
TOTALES
===================================================== */

document.getElementById(
"totalServidores"
).innerText =
data.totalServidores || 0;

document.getElementById(
"totalEventos"
).innerText =
data.totalEventos || 0;

document.getElementById(
"totalAsistencias"
).innerText =
data.totalAsistencias || 0;

/* =====================================================
CARD SERVIDORES
===================================================== */

const cardServidores =
document.getElementById(
"cardServidores"
);

if(cardServidores){

cardServidores.addEventListener(
"click",
function(){

window.location.href =
"servidores.html";

}
);

}

/* =====================================================
GRAFICA
===================================================== */

const ctx =
document.getElementById('chart');

/* =====================================================
DESTRUIR CHART PREVIO
===================================================== */

if(window.dashboardChart){

window.dashboardChart.destroy();

}

/* =====================================================
CREAR GRAFICA
===================================================== */

window.dashboardChart =
new Chart(ctx, {

type:'bar',

data:{

labels:[
'Servidores',
'Eventos',
'Asistencias'
],

datasets:[{

label:'Sistema',

data:[
data.totalServidores || 0,
data.totalEventos || 0,
data.totalAsistencias || 0
],

borderWidth:2

}]

},

options:{

responsive:true,
maintainAspectRatio:false

}

});

ocultarLoader();

}catch(error){

ocultarLoader();

console.error(error);

Swal.fire({

icon:"error",
title:error.toString()

});

}

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
