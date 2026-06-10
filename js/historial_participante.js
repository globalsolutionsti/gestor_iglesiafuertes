const params =
new URLSearchParams(
window.location.search
);

const idPersona =
params.get("idPersona");

const idTemporada =
params.get("idTemporada");

document.addEventListener(
"DOMContentLoaded",
cargarHistorial
);

function cargarHistorial(){

const callback =
"historial_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(!result.status){

document.getElementById(
"tablaHistorial"
).innerHTML =

`
<tr>
<td colspan="2">

${result.message}

</td>
</tr>
`;
return;

}

document.getElementById(
"infoParticipante"
).innerHTML =

`
<div class="alert alert-info">

<b>Nombre:</b>
${result.nombre}

<br>

<b>Asistencias:</b>
${result.asistencias}

de

${result.totalSesiones}

<br>

<b>Porcentaje:</b>
${result.porcentaje}%

</div>
`;

let html = "";

result.historial.forEach(h=>{

html +=

`
<tr>

<td>
${h.sesion}
</td>

<td>

${h.asistio
? "✅"
: "❌"}

</td>

</tr>
`;

});

document.getElementById(
"tablaHistorial"
).innerHTML =
html;

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getHistorialParticipante`
+
`&callback=${callback}`
+
`&idPersona=${idPersona}`
+
`&idTemporada=${idTemporada}`;

document.body.appendChild(script);

}
