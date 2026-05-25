const params =
new URLSearchParams(
window.location.search
);

const id =
params.get("id");

async function cargarPerfil(){

try{

const response =
await fetch(

`${API_URL}?action=getPerfilServidor&id=${id}`

);

const result =
await response.json();

if(!result.status){

Swal.fire({

icon:"error",
title:result.message

});

return;

}

const s =
result.servidor;

/* ======================================
HEADER
====================================== */

document.getElementById(
"fotoServidor"
).src =
s.foto || "https://i.pravatar.cc/200";

document.getElementById(
"nombreServidor"
).innerText =
`${s.nombre} ${s.apellidos}`;

document.getElementById(
"ministerioPrincipal"
).innerText =
s.ministerio;

document.getElementById(
"numeroServidor"
).innerText =
s.numero;

document.getElementById(
"email"
).innerText =
s.email;

document.getElementById(
"telefono"
).innerText =
s.telefono;

document.getElementById(
"grupo"
).innerText =
s.grupo;

document.getElementById(
"fechaIngreso"
).innerText =
s.fecha;

/* ======================================
TIMELINE
====================================== */

let timelineHTML = "";

result.timeline.forEach(item=>{

timelineHTML += `

<div class="timeline-item">

<h6>${item.evento}</h6>

<small class="text-muted">
${item.fecha}
</small>

</div>

`;

});

document.getElementById(
"timelineContent"
).innerHTML =
timelineHTML;

/* ======================================
FORMACION
====================================== */

let formacionHTML = "";

result.formacion.forEach(item=>{

let clase = "";

let icono = "";

if(item.estado === "APROBADO"){

clase = "status-aprobado";
icono = "fa-circle-check";

}

else if(item.estado === "CURSANDO"){

clase = "status-cursando";
icono = "fa-clock";

}

else{

clase = "status-pendiente";
icono = "fa-circle";

}

formacionHTML += `

<div class="level-card">

<div>

<h6>${item.nivel}</h6>

<small>${item.fecha || ''}</small>

</div>

<div class="${clase}">

<i class="fa ${icono}"></i>

${item.estado}

</div>

</div>

`;

});

document.getElementById(
"formacionContent"
).innerHTML =
formacionHTML;

/* ======================================
ASISTENCIA
====================================== */

document.getElementById(
"porcentajeAsistencia"
).innerText =
result.asistencia + "%";

document.getElementById(
"barraAsistencia"
).style.width =
result.asistencia + "%";

document.getElementById(
"barraAsistencia"
).innerText =
result.asistencia + "%";

}catch(error){

console.error(error);

Swal.fire({

icon:"error",
title:error.toString()

});

}

}

cargarPerfil();
