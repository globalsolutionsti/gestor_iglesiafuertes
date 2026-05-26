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
FOTO
====================================== */

const fotoServidor =
s.foto &&
String(s.foto).trim() !== ""
? s.foto
: "https://i.pravatar.cc/200";

document.getElementById(
"fotoServidor"
).src =
fotoServidor;

/* ======================================
NOMBRE
====================================== */

document.getElementById(
"nombreServidor"
).innerText =
`${s.nombre || ""} ${s.apellidos || ""}`;

/* ======================================
MINISTERIO PRINCIPAL
====================================== */

document.getElementById(
"ministerioPrincipal"
).innerHTML =
`
<span class="text-muted">
Ministerio Principal:
</span>
<span class="fw-bold text-primary">
${s.ministerio1 || "SIN MINISTERIO"}
</span>
`;

/* ======================================
MINISTERIOS SECUNDARIOS
====================================== */

let secundariosHTML = "";

const secundarios = [

s.ministerio2,
s.ministerio3,
s.ministerio4

].filter(x =>
x && String(x).trim() !== ""
);

secundarios.forEach(min=>{

secundariosHTML += `

<span
class="badge bg-light text-dark border me-1 mb-1">

${min}

</span>

`;

});

document.getElementById(
"ministeriosSecundarios"
).innerHTML =
secundariosHTML;

/* ======================================
INFO GENERAL
====================================== */

document.getElementById(
"numeroServidor"
).innerText =
s.numero || "";

document.getElementById(
"email"
).innerText =
s.email || "";

document.getElementById(
"telefono"
).innerText =
s.telefono || "";

document.getElementById(
"grupo"
).innerText =
s.grupo || "";

document.getElementById(
"fechaIngreso"
).innerText =
s.fecha || "";

/* ======================================
TIMELINE
====================================== */

let timelineHTML = "";

(result.timeline || []).forEach(item=>{

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

(result.formacion || []).forEach(item=>{

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
(result.asistencia || 0) + "%";

document.getElementById(
"barraAsistencia"
).style.width =
(result.asistencia || 0) + "%";

document.getElementById(
"barraAsistencia"
).innerText =
(result.asistencia || 0) + "%";

}catch(error){

console.error(error);

Swal.fire({

icon:"error",
title:error.toString()

});

}

}

cargarPerfil();
