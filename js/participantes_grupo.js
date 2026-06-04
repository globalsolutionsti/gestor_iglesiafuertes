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

const callback =
"participantes_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

const tbody =
document.getElementById(
"tablaParticipantes"
);

tbody.innerHTML = "";

if(!result.status){

tbody.innerHTML =

`
<tr>
<td colspan="4">

Error cargando participantes

</td>
</tr>
`;

return;

}

const participantes =
result.data || [];

if(participantes.length === 0){

tbody.innerHTML =

`
<tr>
<td colspan="4">

Sin participantes registrados

</td>
</tr>
`;

return;

}

participantes.forEach(p=>{

tbody.innerHTML +=

`

<tr>

<td>

${p[6]}

</td>

<td>

${p[4]}

</td>

<td>

${p[7]}

</td>

<td>

<button
class="btn btn-info btn-sm me-1"
onclick="verPerfil('${p[5]}')">

<i class="fa fa-user"></i>

</button>

<button
class="btn btn-warning btn-sm me-1"
onclick="cambiarGrupo('${p[0]}')">

<i class="fa fa-arrows-rotate"></i>

</button>

<button
class="btn btn-danger btn-sm"
onclick="darBajaParticipante('${p[0]}')">

<i class="fa fa-user-slash"></i>

</button>

</td>

</tr>

`;

});

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

function guardarParticipante(
idPersona,
nombre,
tipo
){

const callback =
"guardar_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(result.status){

Swal.fire({

icon:"success",
title:"Participante agregado"

});

cargarParticipantes();

}else{

Swal.fire({

icon:"error",
title:result.message

});

}

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=guardarParticipanteGrupo`
+
`&callback=${callback}`
+
`&idTemporada=${idTemporada}`
+
`&idSesion=${idSesion}`
+
`&idGrupo=${idGrupo}`
+
`&idPersona=${idPersona}`
+
`&nombre=${encodeURIComponent(nombre)}`
+
`&tipo=${tipo}`;

document.body.appendChild(script);

}

function verPerfil(idPersona){

Swal.fire({

icon:"info",

title:
"Próximamente",

text:
"Ver perfil del participante"

});

}

function cambiarGrupo(idRegistro){

Swal.fire({

icon:"info",

title:
"Próximamente",

text:
"Cambiar participante de grupo"

});

}

function darBajaParticipante(idRegistro){

Swal.fire({

icon:"info",

title:
"Próximamente",

text:
"Dar de baja participante"

});

}
