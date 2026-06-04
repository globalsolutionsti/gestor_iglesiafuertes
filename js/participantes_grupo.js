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

document.getElementById(
"infoGrupo"
).innerHTML =

`
<div class="alert alert-info">

<b>Temporada:</b>
${idTemporada}

<br>

<b>Sesión:</b>
${idSesion}

<br>

<b>Grupo:</b>
${idGrupo}

</div>
`;

cargarParticipantes();

}
);

function cargarParticipantes(){

const tbody =
document.getElementById(
"tablaParticipantes"
);

tbody.innerHTML =

`
<tr>
<td colspan="3">
Sin participantes registrados
</td>
</tr>
`;

}

function abrirModalParticipante(){

Swal.fire({

icon:"info",

title:
"En el siguiente paso cargaremos los servidores y congregantes"

});

}
