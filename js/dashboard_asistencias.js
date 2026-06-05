const params =
new URLSearchParams(
window.location.search
);

const idTemporada =
params.get("id");

document.addEventListener(
"DOMContentLoaded",
function(){

cargarDashboard();

}
);

function cargarDashboard(){

const callback =
"dashboardAsis_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(!result.status){

alert(result.message);
return;

}

document.getElementById(
"totalRegistros"
).innerHTML =
result.totales.registros;

document.getElementById(
"totalAsistencias"
).innerHTML =
result.totales.asistencias;

document.getElementById(
"porcentajeGeneral"
).innerHTML =
result.totales.porcentaje + "%";

/* =====================
GRUPOS
===================== */

let htmlGrupos = "";

result.grupos
.slice(0,10)
.forEach((g,index)=>{

const medalla =

index===0 ? "🥇" :
index===1 ? "🥈" :
index===2 ? "🥉" :
"🏅";

htmlGrupos +=

`
<div class="mb-2">

${medalla}
<b>${g.grupo}</b>

<br>

${g.porcentaje}%

</div>
`;

});

document.getElementById(
"rankingGrupos"
).innerHTML =
htmlGrupos;

/* =====================
SESIONES
===================== */

let htmlSesiones = "";

result.sesiones.forEach(s=>{

htmlSesiones +=

`
<div class="mb-2">

<b>${s.sesion}</b>

<br>

${s.porcentaje}%

</div>
`;

});

document.getElementById(
"rankingSesiones"
).innerHTML =
htmlSesiones;

/* =====================
PERSONAS
===================== */

let htmlPersonas = "";

result.personas
.slice(0,10)
.forEach(p=>{

htmlPersonas +=

`
<div class="mb-2">

<b>${p.nombre}</b>

<br>

${p.porcentaje}%

</div>
`;

});

document.getElementById(
"rankingPersonas"
).innerHTML =
htmlPersonas;

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getDashboardAsistencias`
+
`&callback=${callback}`
+
`&idTemporada=${idTemporada}`;

document.body.appendChild(script);

}
