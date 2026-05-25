let tabla = null;
let fotoBase64 = "";

/* =====================================================
CARGAR SERVIDORES
===================================================== */

function cargarServidores(){

mostrarLoader();

const callbackName =
"servidores_callback_" + Date.now();

/* =====================================================
CALLBACK GLOBAL
===================================================== */

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
RECORRER SERVIDORES
===================================================== */

for(let i=1;i<data.length;i++){

const s = data[i];

html += `

<tr>

<td>

<img src="${
s[10] || 'https://i.pravatar.cc/150'
}"

class="rounded-circle"

style="
width:50px;
height:50px;
object-fit:cover;
border:2px solid #0d6efd;
">

</td>

<td>

<a href="perfil.html?id=${s[1]}"
class="fw-bold text-decoration-none">

${s[2]} ${s[3]}

</a>

</td>

<td>${s[6] || ''}</td>

<td>${s[7] || ''}</td>

<td>

<span class="badge bg-success">

${s[9] || 'ACTIVO'}

</span>

</td>

<td class="d-flex gap-2">

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

</td>

</tr>

`;

}

/* =====================================================
DESTRUIR DATATABLE
===================================================== */

if($.fn.DataTable.isDataTable('#tabla')){

$('#tabla').DataTable().destroy();

}

/* =====================================================
RENDER TABLA
===================================================== */

document.getElementById(
"tablaServidores"
).innerHTML = html;

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

/* =====================================================
LIMPIAR CALLBACK
===================================================== */

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

video:{
facingMode:"user"
},
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

canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

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

ministerio:
document.getElementById("ministerio").value,

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
"ministerio",
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
title:"Módulo editar próximamente"

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
