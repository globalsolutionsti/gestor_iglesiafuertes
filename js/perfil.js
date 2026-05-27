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

/* ======================================
NORMALIZAR CAMPOS
COMPATIBLE CON ARRAY Y OBJETO
====================================== */

const esArray = Array.isArray(s);

/* ======================================
CAMPOS
====================================== */

const foto = esArray
? (s[13] || "")
: (s.foto || s.FOTO || s.Foto || "");

const nombre = esArray
? (s[2] || "")
: (s.nombre || s.NOMBRE || "");

const apellidos = esArray
? (s[3] || "")
: (s.apellidos || s.APELLIDOS || "");

const numero = esArray
? (s[1] || "")
: (s.numero || s.NUMERO || "");

const telefono = esArray
? (s[4] || "")
: (s.telefono || s.TELEFONO || "");

const email = esArray
? (s[5] || "")
: (s.email || s.EMAIL || "");

const ministerio1 = esArray
? (s[6] || "")
: (
s.ministerio1 ||
s.MINISTERIO1 ||
s.ministerio ||
s.MINISTERIO ||
""
);

const ministerio2 = esArray
? (s[7] || "")
: (s.ministerio2 || s.MINISTERIO2 || "");

const ministerio3 = esArray
? (s[8] || "")
: (s.ministerio3 || s.MINISTERIO3 || "");

const ministerio4 = esArray
? (s[9] || "")
: (s.ministerio4 || s.MINISTERIO4 || "");

const grupo = esArray
? (s[10] || "")
: (s.grupo || s.GRUPO || "");

const fecha = esArray
? (s[11] || "")
: (s.fecha || s.FECHA || "");

const estado = esArray
? (s[12] || "ACTIVO")
: (s.estado || s.ESTADO || "ACTIVO");

/* ======================================
DEBUG
====================================== */

console.log("Servidor:", s);
console.log("Foto:", foto);
console.log("Ministerio:", ministerio1);

/* ======================================
HEADER
====================================== */

/* ======================================
FOTO SERVIDOR
====================================== */

const fotoServidor =
document.getElementById("fotoServidor");

/* ======================================
VALIDAR FOTO
====================================== */

let fotoFinal = foto || "";

/* ======================================
MOSTRAR FOTO SOLO SI EXISTE
====================================== */

if (fotoFinal && String(fotoFinal).trim() !== "") {

    fotoServidor.onload = function () {
        fotoServidor.style.display = "block";
    };

    fotoServidor.onerror = function () {

        this.style.display = "block";

        this.src =
        "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(nombre + " " + apellidos) +
        "&background=0D6EFD&color=fff&size=256";

    };

    fotoServidor.src = fotoFinal;

} else {

    fotoServidor.style.display = "block";

    fotoServidor.src =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(nombre + " " + apellidos) +
    "&background=0D6EFD&color=fff&size=256";

}

/* ======================================
SI FALLA IMAGEN
====================================== */

fotoServidor.onerror = function(){

this.src =
"https://i.pravatar.cc/200?img=12";

};

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
${ministerio1 || "Sin Ministerio"}
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
