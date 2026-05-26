let tabla = null;
let fotoBase64 = "";

/* =====================================================
CARGAR SERVIDORES
===================================================== */

function cargarServidores(){

mostrarLoader();

const callbackName =
"servidores_callback_" + Date.now();

window[callbackName] = function(result){

try{

if(!result.status){

ocultarLoader();

Swal.fire({

icon:"error",
title:result.message

});

return;

}

const data =
result.data || [];

let html = "";

/* =====================================================
VALIDAR DATOS
===================================================== */

if(data.length <= 1){

document.getElementById(
"tablaServidores"
).innerHTML = `

<tr>

<td colspan="6"
class="text-center py-5">

<i class="fa fa-users fa-3x text-muted mb-3"></i>

<div class="fw-bold">

No hay servidores registrados

</div>

</td>

</tr>

`;

ocultarLoader();

return;

}

/* =====================================================
ESTRUCTURA REAL
=====================================================

0  ID
1  NUMERO
2  NOMBRE
3  APELLIDOS
4  TELEFONO
5  EMAIL
6  MINISTERIO PRINCIPAL
7  MINISTERIO SEC1
8  MINISTERIO SEC2
9  MINISTERIO SEC3
10 GRUPO
11 FECHA
12 ESTADO
13 FOTO

===================================================== */

for(let i=1;i<data.length;i++){

const s = data[i];

if(!s || s.length === 0){
continue;
}

/* =====================================================
DATOS
===================================================== */

const foto =
s[13] && s[13] !== ""
? s[13]
: "https://i.pravatar.cc/150";

const nombreCompleto =
`${s[2] || ''} ${s[3] || ''}`;

const ministerioPrincipal =
s[6] || '';

const ministeriosSecundarios = [

s[7],
s[8],
s[9]

]
.filter(item => item && item !== "")
.join(" • ");

const grupo =
s[10] || '';

const estado =
s[12] || 'ACTIVO';

/* =====================================================
ROW HTML
===================================================== */

html += `

<tr>

<td class="align-middle text-center">

<img src="${foto}"

style="
width:60px;
height:60px;
object-fit:cover;
border-radius:50%;
border:3px solid #0d6efd;
box-shadow:0 4px 12px rgba(0,0,0,.18);
">

</td>

<td class="align-middle">

<a href="perfil.html?id=${s[0]}"
class="fw-bold text-decoration-none text-dark fs-6">

${nombreCompleto}

</a>

<div class="small text-muted mt-1">

<i class="fa fa-id-badge"></i>
${s[1] || ''}

</div>

<div class="small text-muted">

<i class="fa fa-phone"></i>
${s[4] || ''}

</div>

<div class="small text-muted">

<i class="fa fa-envelope"></i>
${s[5] || ''}

</div>

</td>

<td class="align-middle">

<div class="fw-bold text-primary mb-1">

${ministerioPrincipal}

</div>

${
ministeriosSecundarios
? `
<div class="small text-muted">

${ministeriosSecundarios}

</div>
`
: ''
}

</td>

<td class="align-middle">

<span class="badge bg-light text-dark border px-3 py-2">

${grupo}

</span>

</td>

<td class="align-middle">

<span class="badge bg-success px-3 py-2">

${estado}

</span>

</td>

<td class="align-middle">

<div class="d-flex gap-2 justify-content-center">

<button
class="btn btn-primary btn-sm"
onclick="editarServidor('${s[0]}')">

<i class="fa fa-edit"></i>

</button>

<button
class="btn btn-danger btn-sm"
onclick="eliminarServidor('${s[0]}')">

<i class="fa fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

}

/* =====================================================
RENDER TABLA
===================================================== */

document.getElementById(
"tablaServidores"
).innerHTML = html;

/* =====================================================
DESTRUIR DATATABLE
===================================================== */

if($.fn.DataTable.isDataTable('#tabla')){

$('#tabla').DataTable().destroy();

}

/* =====================================================
DATATABLE
===================================================== */

tabla = $('#tabla').DataTable({

responsive:true,
pageLength:10,
destroy:true,

language:{
url:"https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
}

});

ocultarLoader();

delete window[callbackName];

script.remove();

}catch(error){

ocultarLoader();

console.error(error);

Swal.fire({

icon:"error",
title:error.toString()

});

}

};

/* =====================================================
SCRIPT JSONP
===================================================== */

const script =
document.createElement("script");

script.src =

`${API_URL}?action=getServidores&callback=${callbackName}`;

script.onerror = function(){

ocultarLoader();

Swal.fire({

icon:"error",
title:"Error conexión Apps Script"

});

};

document.body.appendChild(script);

}

/* =====================================================
ACTIVAR CAMARA
===================================================== */

async function activarCamara(){

try{

const video =
document.getElementById("camera");

const stream =
await navigator.mediaDevices.getUserMedia({

video:true,
audio:false

});

video.srcObject = stream;

}catch(error){

Swal.fire({

icon:"error",
title:"No se pudo activar cámara"

});

}

}

/* =====================================================
TOMAR FOTO
===================================================== */

function tomarFoto(){

const video =
document.getElementById("camera");

const canvas =
document.getElementById("canvas");

const preview =
document.getElementById("previewFoto");

canvas.width =
video.videoWidth;

canvas.height =
video.videoHeight;

const ctx =
canvas.getContext("2d");

ctx.drawImage(video,0,0);

fotoBase64 =
canvas.toDataURL(
"image/jpeg",
0.8
);

preview.src =
fotoBase64;

preview.style.display =
"block";

}

/* =====================================================
GUARDAR SERVIDOR
===================================================== */

async function guardarServidor(){

mostrarLoader();

/* =====================================================
NUEVA ESTRUCTURA MINISTERIOS
===================================================== */

const body = {

numeroServidor:
document.getElementById("numeroServidor").value,

nombre:
document.getElementById("nombre").value,

apellidos:
document.getElementById("apellidos").value,

telefono:
document.getElementById("telefono").value,

email:
document.getElementById("email").value,

ministerioPrincipal:
document.getElementById("ministerioPrincipal").value,

ministerioSec1:
document.getElementById("ministerioSec1").value,

ministerioSec2:
document.getElementById("ministerioSec2").value,

ministerioSec3:
document.getElementById("ministerioSec3").value,

grupoConexion:
document.getElementById("grupoConexion").value,

fechaIngreso:
document.getElementById("fechaIngreso").value,

foto:fotoBase64

};

try{

const response =
await fetch(

API_URL +
"?action=guardarServidor",

{
method:"POST",
body:JSON.stringify(body)
}

);

const data =
await response.json();

ocultarLoader();

if(data.status){

Swal.fire({

icon:"success",
title:"Servidor guardado correctamente"

});

const modal =
bootstrap.Modal.getInstance(
document.getElementById(
"modalServidor"
)
);

if(modal){

modal.hide();

}

limpiarFormulario();

setTimeout(()=>{

cargarServidores();

},500);

}else{

Swal.fire({

icon:"error",
title:data.message

});

}

}catch(error){

ocultarLoader();

Swal.fire({

icon:"error",
title:error.toString()

});

}

}

/* =====================================================
LIMPIAR FORMULARIO
===================================================== */

function limpiarFormulario(){

const campos = [

"numeroServidor",
"nombre",
"apellidos",
"telefono",
"email",
"ministerioPrincipal",
"ministerioSec1",
"ministerioSec2",
"ministerioSec3",
"grupoConexion",
"fechaIngreso"

];

campos.forEach(id=>{

const el =
document.getElementById(id);

if(el){

el.value = "";

}

});

fotoBase64 = "";

const preview =
document.getElementById(
"previewFoto"
);

if(preview){

preview.style.display =
"none";

preview.src = "";

}

const video =
document.getElementById(
"camera"
);

if(video && video.srcObject){

video.srcObject
.getTracks()
.forEach(track=>track.stop());

video.srcObject = null;

}

}

/* =====================================================
EDITAR
===================================================== */

function editarServidor(id){

Swal.fire({

icon:"info",
title:"Módulo edición próximamente"

});

}

/* =====================================================
ELIMINAR
===================================================== */

function eliminarServidor(id){

Swal.fire({

title:"¿Eliminar servidor?",
text:"Esta acción no se puede deshacer",
icon:"warning",
showCancelButton:true,
confirmButtonText:"Eliminar"

});

}

/* =====================================================
EXPORTAR EXCEL
===================================================== */

function exportarExcel(){

const tablaHTML =
document.getElementById("tabla");

const workbook =
XLSX.utils.table_to_book(
tablaHTML,
{sheet:"Servidores"}
);

XLSX.writeFile(
workbook,
"servidores.xlsx"
);

}

/* =====================================================
EXPORTAR PDF
===================================================== */

function exportarPDF(){

window.print();

}

/* =====================================================
LOADER
===================================================== */

function mostrarLoader(){

if(document.getElementById("loader")){
return;
}

document.body.insertAdjacentHTML(

"beforeend",

`

<div class="loader-overlay"
id="loader"

style="
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(255,255,255,.7);
display:flex;
justify-content:center;
align-items:center;
z-index:99999;
">

<div class="spinner-border text-primary"

style="
width:4rem;
height:4rem;
">

</div>

</div>

`

);

}

function ocultarLoader(){

const loader =
document.getElementById("loader");

if(loader){

loader.remove();

}

}

/* =====================================================
INIT
===================================================== */

document.addEventListener(

"DOMContentLoaded",

function(){

cargarServidores();

}

);
