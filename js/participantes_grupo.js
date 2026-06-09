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

cargarInformacionGrupo();

cargarParticipantes();

}
);

function cargarInformacionGrupo(){

const callback =
"infoGrupo_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(result.status){

document.getElementById(
"infoGrupo"
).innerHTML =

`
<div class="alert alert-info">

<b>Temporada:</b>
${result.temporada}

<br>

<b>Sesión:</b>
${result.sesion}

<br>

<b>Grupo:</b>
${result.grupo}

</div>
`;

}

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getInfoGrupo`
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
onclick="verPerfil('${p[5]}')"
title="Ver Perfil">

<i class="fa fa-user"></i>

</button>

<button
class="btn btn-success btn-sm me-1"
onclick="capturarAsistencia('${p[0]}')"
title="Asistencia">

<i class="fa fa-clipboard-check"></i>

</button>

<button
class="btn btn-warning btn-sm me-1"
onclick="cambiarGrupo('${p[0]}')"
title="Cambiar Grupo">

<i class="fa fa-arrows-rotate"></i>

</button>

<button
class="btn btn-dark btn-sm me-1"
onclick="mostrarQR(
'${p[5]}',
'${p[6]}',
'${p[4]}',
'${idGrupo}'
)"
title="Código QR">

<i class="fa fa-qrcode"></i>

</button>

<button
class="btn btn-danger btn-sm"
onclick="darBajaParticipante('${p[0]}')"
title="Dar Baja">

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

function cambiarGrupo(idParticipante){

const callback =
"grupos_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(!result.status){

Swal.fire({
icon:"error",
title:"Error obteniendo grupos"
});

return;

}

const grupos =
result.data || [];

let opciones = "";

grupos.forEach(g=>{

opciones +=
`<option value="${g[3]}">
${g[4]}
</option>`;

});

Swal.fire({

title:"Cambiar Grupo",

html:

`<select
id="nuevoGrupo"
class="form-select">

${opciones}

</select>`,

showCancelButton:true,

confirmButtonText:
"Cambiar"

}).then(res=>{

if(!res.isConfirmed){
return;
}

guardarCambioGrupo(
idParticipante,
document.getElementById(
"nuevoGrupo"
).value
);

});

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getGruposTemporada`
+
`&callback=${callback}`
+
`&idTemporada=${idTemporada}`;

document.body.appendChild(script);

}

function guardarCambioGrupo(
idParticipante,
idGrupo
){

const callback =
"cambio_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(result.status){

Swal.fire({

icon:"success",
title:"Grupo actualizado"

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

`${API_URL}?action=cambiarGrupoParticipante`
+
`&callback=${callback}`
+
`&idParticipante=${idParticipante}`
+
`&idGrupo=${idGrupo}`;

document.body.appendChild(script);

}

function darBajaParticipante(idParticipante){

Swal.fire({

title:"¿Dar de baja participante?",

text:
"El participante dejará de pertenecer al grupo",

icon:"warning",

showCancelButton:true,

confirmButtonText:"Dar de Baja",

cancelButtonText:"Cancelar"

}).then(result=>{

if(!result.isConfirmed){
return;
}

const callback =
"baja_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(resp){

if(resp.status){

Swal.fire({

icon:"success",

title:
"Participante dado de baja"

});

cargarParticipantes();

}else{

Swal.fire({

icon:"error",

title:
resp.message

});

}

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=darBajaParticipante`
+
`&callback=${callback}`
+
`&idParticipante=${idParticipante}`;

document.body.appendChild(script);

});

}


function verPerfil(idPersona){

window.location.href =

`perfil.html?id=${idPersona}`;

}

function capturarAsistencia(idParticipante){

Swal.fire({

icon:"info",
title:"Módulo de asistencia en construcción",
text:"Participante: " + idParticipante

});

}

function abrirAsistenciaGrupo(){

window.location.href =

"asistencia_grupo.html"
+
"?idTemporada=" + idTemporada
+
"&idSesion=" + idSesion
+
"&idGrupo=" + idGrupo;

}

function mostrarQR(
idPersona,
nombre
){

const contenidoQR =
`PERSONA:${idPersona}`;

const urlQR =

`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(contenidoQR)}`;

Swal.fire({

title:nombre,

html:

`
<div class="text-center">

<img
id="imagenQR"
src="${urlQR}"
class="img-fluid mb-3">

<br>

<b>${contenidoQR}</b>

<br><br>

<a
href="${urlQR}"
download="QR_${idPersona}.png"
target="_blank"
class="btn btn-success">

<i class="fa fa-download"></i>

Descargar QR

</a>

</div>
`,

width:550

});

}
