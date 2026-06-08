const params =
new URLSearchParams(
window.location.search
);

const idTemporada =
params.get("id");

let dashboardTimer = null;

document.addEventListener(
"DOMContentLoaded",
function(){

cargarDashboard();

/* =====================
AUTO REFRESH
===================== */

dashboardTimer = setInterval(

function(){

cargarDashboard();

},

10000

);

}
);

function cargarDashboard(){
if(window.dashboardCargando){
return;
}

window.dashboardCargando = true;
  
const callback =
"dashboardAsis_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(!result.status){

window.dashboardCargando = false;

console.error(
result.message
);

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

document.getElementById(
"ultimaActualizacion"
).innerHTML =

"Actualizado: " +

new Date().toLocaleTimeString();

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

/* =====================
GRUPO VS SESION
===================== */

if(result.grupoSesion){

console.log(
"grupoSesion:",
result.grupoSesion
);
  
let sesionesUnicas = [];

result.grupoSesion.forEach(g=>{

Object.keys(g.sesiones)
.forEach(s=>{

if(!sesionesUnicas.includes(s)){

sesionesUnicas.push(s);

}

});

});

/* CABECERA */

let thead =
"<tr><th class='text-center'>Grupo</th>";

sesionesUnicas.forEach(s=>{

thead +=
`<th class="text-center">${s}</th>`;

});

thead += "</tr>";

document.getElementById(
"theadGrupoSesion"
).innerHTML =
thead;

/* TABLA */

let htmlTabla = "";

result.grupoSesion.forEach(g=>{

htmlTabla += "<tr>";

htmlTabla +=
`
<td>

<a
href="detalle_asistencia_grupo.html?idTemporada=${idTemporada}&idGrupo=${g.idGrupo}"
class="fw-semibold text-decoration-none">

${g.grupo}

</a>

</td>
`;
sesionesUnicas.forEach(s=>{

const valor =
g.sesiones[s] || 0;

htmlTabla +=
`<td class="text-center fw-bold">${valor}</td>`;

});

htmlTabla += "</tr>";

});

document.getElementById(
"tablaGrupoSesion"
).innerHTML =
htmlTabla;

}

window.dashboardCargando = false;

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
