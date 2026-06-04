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

const callback =
"personas_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(!result.status){

Swal.fire(
"Error",
"Cargando personas",
"error"
);

return;

}

let opciones = "";

result.data.forEach(p=>{

opciones +=

`

<option
value="${p.id}"
data-tipo="${p.tipo}"
data-nombre="${p.nombre}">

${p.nombre}
(${p.tipo})

</option>

`;

});

Swal.fire({

title:
"Agregar Participante",

html:

`

<select
id="personaSeleccionada"
class="form-select">

${opciones}

</select>

`,

showCancelButton:true,

confirmButtonText:
"Agregar"

}).then(r=>{

if(!r.isConfirmed){
return;
}

const select =
document.getElementById(
"personaSeleccionada"
);

const option =
select.options[
select.selectedIndex
];

guardarParticipante(

option.value,

option.dataset.nombre,

option.dataset.tipo

);

});

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getPersonas`
+
`&callback=${callback}`;

document.body.appendChild(script);

}
