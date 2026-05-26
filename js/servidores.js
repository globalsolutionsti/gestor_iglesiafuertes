let tabla = null;
let fotoBase64 = "";

/* =====================================================
CARGAR SERVIDORES
===================================================== */

function cargarServidores(){

mostrarLoader();

const callbackName =
"cb_" + Date.now();

const script =
document.createElement("script");

window[callbackName] = function(result){

try{

if(!result.status){

ocultarLoader();

Swal.fire({
icon:"error",
title:result.message || "Error obteniendo servidores"
});

return;

}

const data =
result.data || [];

let html = "";

/* =====================================================
SIN REGISTROS
===================================================== */

if(data.length <= 1){

html = `

<tr>

<td colspan="6" class="text-center py-5">

<i class="fa fa-users fa-3x text-muted mb-3"></i>

<div class="fw-bold">
No hay registros
</div>

</td>

</tr>

`;

}else{

for(let i=1;i<data.length;i++){

let s = data[i] || [];

/* =====================================================
NORMALIZAR COLUMNAS
===================================================== */

while(s.length < 14){
s.push("");
}

/* =====================================================
IGNORAR FILAS TOTALMENTE VACIAS
===================================================== */

const filaVacia =
s.every(campo => String(campo).trim() === "");

if(filaVacia){
continue;
}

/* =====================================================
DATOS
===================================================== */

const foto =
s[13] && s[13] !== ""
? s[13]
: "https://i.pravatar.cc/150?img=12";

const nombre =
`${s[2] || ''} ${s[3] || ''}`;

const ministerios = [

s[6],
s[7],
s[8],
s[9]

].filter(x => x && x !== "");

let ministeriosHTML = "";

ministerios.forEach(m=>{

ministeriosHTML += `

<span class="ministerio-chip">
${m}
</span>

`;

});

/* =====================================================
IMPORTANTE:
SIEMPRE 6 COLUMNAS EXACTAS
===================================================== */

html += `

<tr>

<td class="text-center align-middle">

<img
src="${foto}"
class="servidor-foto"
onerror="this.src='https://i.pravatar.cc/150?img=12'">

</td>

<td class="align-middle">

<div class="fw-bold fs-6">
${nombre}
</div>

<div class="small text-muted">
<i class="fa fa-id-card"></i>
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
${ministeriosHTML}
</td>

<td class="align-middle">

<span class="badge bg-light text-dark border">
${s[10] || ''}
</span>

</td>

<td class="align-middle">

<span class="badge bg-success">
${s[12] || 'ACTIVO'}
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

}

/* =====================================================
RENDER TABLA
===================================================== */

const tbody =
document.getElementById("tablaServidores");

tbody.innerHTML = html;

/* =====================================================
DESTRUIR DATATABLE
===================================================== */

if($.fn.DataTable.isDataTable('#tabla')){

$('#tabla').DataTable().clear().destroy();

}

/* =====================================================
REINICIALIZAR DATATABLE
===================================================== */

tabla = $('#tabla').DataTable({

responsive:true,
pageLength:10,
destroy:true,
autoWidth:false,

language:{
url:"https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
}

});

ocultarLoader();

/* =====================================================
LIMPIEZA
===================================================== */

delete window[callbackName];

if(script){
script.remove();
}

}catch(error){

ocultarLoader();

console.error(error);

Swal.fire({
icon:"error",
title:error.toString()
});

}

};

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
CARGAR MINISTERIOS
===================================================== */

function cargarMinisterios(){

const callbackName =
"ministerios_" + Date.now();

const script =
document.createElement("script");

window[callbackName] = function(result){

try{

if(!result.status){
return;
}

const ministerios =
result.data || [];

const selects = [

"ministerioPrincipal",
"ministerioSec1",
"ministerioSec2",
"ministerioSec3"

];

selects.forEach(id=>{

const select =
document.getElementById(id);

if(!select){
return;
}

select.innerHTML =
`<option value="">Seleccionar</option>`;

ministerios.forEach(m=>{

select.innerHTML += `
<option value="${m}">
${m}
</option>
`;

});

});

delete window[callbackName];

if(script){
script.remove();
}

}catch(error){

console.error(error);

}

};

script.src =
`${API_URL}?action=getMinisterios&callback=${callbackName}`;

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
API_URL + "?action=guardarServidor",
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
document.getElementById("modalServidor")
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
document.getElementById("previewFoto");

if(preview){

preview.style.display = "none";
preview.src = "";

}

const video =
document.getElementById("camera");

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

<div
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

<div
class="spinner-border text-primary"
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
cargarMinisterios();

}
);
