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

console.log("PERFIL:", result);

if(!result.status){

Swal.fire({

icon:"error",
title:result.message

});

return;

}

/* ======================================
DATOS SERVIDOR
====================================== */

const s =
result.servidor || {};

/* ======================================
NORMALIZAR CAMPOS
====================================== */

const foto =
s.foto ||
s.FOTO ||
s[13] ||
"https://i.pravatar.cc/200";

const nombre =
s.nombre ||
s.NOMBRE ||
s[2] ||
"";

const apellidos =
s.apellidos ||
s.APELLIDOS ||
s[3] ||
"";

const numero =
s.numero ||
s.NUMERO ||
s[1] ||
"";

const telefono =
s.telefono ||
s.TELEFONO ||
s[4] ||
"";

const email =
s.email ||
s.EMAIL ||
s[5] ||
"";

const ministerio1 =
s.ministerio1 ||
s.MINISTERIO1 ||
s[6] ||
"";

const ministerio2 =
s.ministerio2 ||
s.MINISTERIO2 ||
s[7] ||
"";

const ministerio3 =
s.ministerio3 ||
s.MINISTERIO3 ||
s[8] ||
"";

const ministerio4 =
s.ministerio4 ||
s.MINISTERIO4 ||
s[9] ||
"";

const grupo =
s.grupo ||
s.GRUPO ||
s[10] ||
"";

const fecha =
s.fecha ||
s.FECHA ||
s[11] ||
"";

const estado =
s.estado ||
s.ESTADO ||
s[12] ||
"ACTIVO";

/* ======================================
HEADER
====================================== */

document.getElementById(
"fotoServidor"
).src = foto;

document.getElementById(
"nombreServidor"
).innerText =
`${nombre} ${apellidos}`;

/* ======================================
MINISTERIO PRINCIPAL
====================================== */

document.getElementById(
"ministerioPrincipal"
).innerHTML =
`
<div class="fw-semibold text-muted mb-1">
Ministerio Principal
</div>

<div class="fs-5 fw-bold text-primary">
${ministerio1}
</div>
`;

/* ======================================
MINISTERIOS SECUNDARIOS
====================================== */

let secundariosHTML = "";

const secundarios = [

ministerio2,
ministerio3,
ministerio4

].filter(x =>
x && String(x).trim() !== ""
);

if(secundarios.length > 0){

secundariosHTML += `
<div class="mt-2">
`;

secundarios.forEach(min=>{

secundariosHTML += `

<span class="badge bg-light text-dark border me-1 mb-1">

${min}

</span>

`;

});

secundariosHTML += `
</div>
`;

}

document.getElementById(
"ministeriosSecundarios"
).innerHTML =
secundariosHTML;

/* ======================================
ESTADO
====================================== */

const estadoBadge =
document.querySelector(
".badge.bg-success"
);

if(estadoBadge){

estadoBadge.innerText =
estado;

}

/* ======================================
INFO GENERAL
====================================== */

document.getElementById(
"numeroServidor"
).innerText =
numero;

document.getElementById(
"email"
).innerText =
email;

document.getElementById(
"telefono"
).innerText =
telefono;

document.getElementById(
"grupo"
).innerText =
grupo;

document.getElementById(
"fechaIngreso"
).innerText =
fecha;

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

const asistencia =
result.asistencia || 0;

document.getElementById(
"porcentajeAsistencia"
).innerText =
asistencia + "%";

document.getElementById(
"barraAsistencia"
).style.width =
asistencia + "%";

document.getElementById(
"barraAsistencia"
).innerText =
asistencia + "%";

}catch(error){

console.error(error);

Swal.fire({

icon:"error",
title:error.toString()

});

}

}

cargarPerfil();
