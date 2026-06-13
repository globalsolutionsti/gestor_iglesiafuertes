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
"dashboard_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(!result.status){

alert(
result.message
);

return;

}

const temporada =
result.temporada;

document.getElementById(
"tituloTemporada"
).innerHTML =
"Dashboard - " +
temporada[1];

document.getElementById(
"infoTemporada"
).innerHTML =

`
<div class="alert alert-primary">

<b>Temporada:</b>
${temporada[1]}

|
<b>Año:</b>
${temporada[2]}

|
<b>Sesiones:</b>
${temporada[3]}

|
<b>Estado:</b>
${temporada[4]}

</div>
`;

document.getElementById(
"totalParticipantes"
).innerHTML =
result.totales.participantes;

document.getElementById(
"totalServidores"
).innerHTML =
result.totales.servidores;

document.getElementById(
"totalCongregantes"
).innerHTML =
result.totales.congregantes;

document.getElementById(
"totalLideres"
).innerHTML =
result.totales.lideres;

document.getElementById(
"totalPastores"
).innerHTML =
result.totales.pastores;

document.getElementById(
"totalCoordinadores"
).innerHTML =
result.totales.coordinadores;

document.getElementById(
"totalGruposActivos"
).innerHTML =
result.totales.gruposActivos;

document.getElementById(
"totalSesionesActivas"
).innerHTML =
result.totales.sesiones;

let colorSemaforo =
"success";

let mensajeSemaforo =
"Excelente";

if(
result.totales.participantes < 50
){

colorSemaforo =
"danger";

mensajeSemaforo =
"Atención";

}
else if(
result.totales.participantes < 100
){

colorSemaforo =
"warning";

mensajeSemaforo =
"En crecimiento";

}

document.getElementById(
"semaforoEjecutivo"
).innerHTML =

`

<div class="alert alert-${colorSemaforo}">

<h5>

<i class="fa fa-chart-line"></i>

Estado General:
${mensajeSemaforo}

</h5>

Participantes:
${result.totales.participantes}

|

Grupos:
${result.totales.gruposActivos}

|

Sesiones:
${result.totales.sesiones}

</div>

`;
  
let ranking = "";

result.grupos
.slice(0,3)
.forEach((g,index)=>{

const medalla =

index===0 ? "🥇" :
index===1 ? "🥈" :
"🥉";

ranking +=

`
<div class="mb-3">

<h5>

${medalla}
${g.grupo}

</h5>

<div>

${g.total}
participantes

</div>

</div>
`;

});

document.getElementById(
"rankingGrupos"
).innerHTML =
ranking;

let html = "";

result.grupos.forEach(g=>{

html +=

`
<tr>

<td>
${g.grupo}
</td>

<td>
${g.total}
</td>

</tr>
`;

});

document.getElementById(
"tablaGrupos"
).innerHTML =
html;

let htmlSesiones = "";

result.sesiones.forEach(s=>{

htmlSesiones +=

`
<tr>

<td>
${s.sesion}
</td>

<td>
${s.total}
</td>

</tr>
`;

});

document.getElementById(
"tablaSesiones"
).innerHTML =
htmlSesiones;

  
delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getDashboardGrupos`
+
`&callback=${callback}`
+
`&idTemporada=${idTemporada}`;

document.body.appendChild(script);

}
