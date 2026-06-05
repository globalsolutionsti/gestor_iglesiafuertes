const params =
new URLSearchParams(
window.location.search
);

const idTemporada =
params.get("idTemporada");

const idSesion =
params.get("idSesion");

const idGrupo =
params.get("idGrupo");

document.addEventListener(
"DOMContentLoaded",
function(){

cargarInfoGrupo();

cargarParticipantesAsistencia();

}
);

function cargarInfoGrupo(){

const callback =
"info_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(result.status){

document.getElementById(
"infoGrupo"
).innerHTML =

`
<div class="alert alert-primary">

<b>📅 Temporada:</b>
${result.temporada}

<br>

<b>📖 Sesión:</b>
${result.sesion}

<br>

<b>👥 Grupo:</b>
${result.grupo}

</div>
`;

}

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getInfoAsistenciaGrupo`
+
`&callback=${callback}`
+
`&idTemporada=${idTemporada}`
+
`&idSesion=${idSesion}`
+
`&idGrupo=${idGrupo}`;

document.body.appendChild(script);

}

function cargarParticipantesAsistencia(){

const callback =
"asis_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

const contenedor =
document.getElementById(
"listaParticipantes"
);

if(!result.status){

contenedor.innerHTML =

`
<div class="alert alert-danger">

Error cargando participantes

</div>
`;

return;

}

const participantes =
result.data || [];

if(participantes.length === 0){

contenedor.innerHTML =

`
<div class="alert alert-warning">

No existen participantes en este grupo

</div>
`;

return;

}

let html =

`
<div class="card">

<div class="card-body">
`;

participantes.forEach(p=>{

html +=

`
<div class="form-check mb-3">

<input
class="form-check-input participante"
type="checkbox"
checked
value="${p[5]}"
data-nombre="${p[6]}">

<label
class="form-check-label">

${p[6]}

</label>

</div>
`;

});

html +=
`
</div>
</div>
`;

contenedor.innerHTML =
html;

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getParticipantesGrupo`
+
`&callback=${callback}`
+
`&idTemporada=${idTemporada}`
+
`&idSesion=${idSesion}`
+
`&idGrupo=${idGrupo}`;

document.body.appendChild(script);

}


function guardarAsistenciaGrupo(){

const checks =
document.querySelectorAll(
".participante"
);

let total = 0;

checks.forEach(c=>{

if(c.checked){
total++;
}

});

Swal.fire({

icon:"success",

title:
"Asistentes seleccionados",

text:
total + " participantes"

});

}
