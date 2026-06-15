let mapaGrupos = {};
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

if(!result || !result.status){

ocultarLoader();

Swal.fire({
icon:"error",
title:
(result && result.message)
? result.message
: "Error obteniendo servidores"
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

<td colspan="7" class="text-center py-5">

<i class="fa fa-users fa-3x text-muted mb-3"></i>

<div class="fw-bold">
No hay registros
</div>

</td>

</tr>

`;

}else{

/* =====================================================
RECORRER FILAS
===================================================== */

for(let i = 1; i < data.length; i++){

let s = data[i] || [];

/* =====================================================
NORMALIZAR COLUMNAS
===================================================== */

while(s.length < 17){
s.push("");
}

/* =====================================================
IGNORAR FILAS VACIAS
===================================================== */

const filaVacia =
s.every(campo =>
String(campo).trim() === ""
);

if(filaVacia){
continue;
}

/* =====================================================
COLUMNAS
=====================================================

0 ID
1 NUMERO
2 NOMBRE
3 APELLIDOS
4 TELEFONO
5 EMAIL
6 MINISTERIO PRINCIPAL
7 MINISTERIO SEC1
8 MINISTERIO SEC2
9 MINISTERIO SEC3
10 GRUPO
11 FECHA
12 ESTADO
13 FOTO

===================================================== */

const foto =
s[16] && String(s[16]).trim() !== ""
? s[16]
: "https://i.pravatar.cc/150?img=12";

const nombre =
`${s[2] || ""} ${s[3] || ""}`.trim();

const ministerioPrincipal =
s[9] || "";

const ministeriosSecundarios = [

s[10],
s[11],
s[12]

].filter(x =>
x && String(x).trim() !== ""
);

let ministeriosHTML = "";

ministeriosSecundarios.forEach(m=>{

ministeriosHTML += `

<span class="ministerio-chip">
${m}
</span>

`;

});

/* =====================================================
SIEMPRE EXACTAMENTE 6 COLUMNAS
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

<a
href="perfil.html?id=${s[0]}"
class="text-decoration-none">

${nombre}

</a>

</div>

<div class="small text-muted">
<i class="fa fa-id-card"></i>
${s[1] || ""}
</div>

<div class="small text-muted">
<i class="fa fa-phone"></i>
${s[7] || ""}
</div>

<div class="small text-muted">
<i class="fa fa-envelope"></i>
${s[8] || ""}
</div>

</td>

<td class="align-middle">

<span class="badge bg-primary">
${ministerioPrincipal}
</span>

</td>

<td class="align-middle">
${ministeriosHTML}
</td>

<td class="align-middle">

<span class="badge bg-light text-dark border">
${mapaGrupos[s[13]] || ""}
</span>

</td>

<td class="align-middle">

<span class="badge bg-success">
${s[15] || "ACTIVO"}
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

if(!tbody){

ocultarLoader();

console.error(
"No existe tbody #tablaServidores"
);

return;

}

/* =====================================================
DESTRUIR DATATABLE
===================================================== */

if($.fn.DataTable.isDataTable('#tabla')){

$('#tabla').DataTable().clear().destroy();

}

/* =====================================================
LIMPIAR TABLA
===================================================== */

tbody.innerHTML = "";

/* =====================================================
INSERTAR HTML
===================================================== */

tbody.innerHTML = html;

/* =====================================================
VALIDAR COLUMNAS
EVITA ERROR _DT_CellIndex
===================================================== */

const filas =
document.querySelectorAll(
"#tabla tbody tr"
);

filas.forEach(fila=>{

const columnas =
fila.querySelectorAll("td").length;

/* =====================================================
AHORA SON 7 COLUMNAS
===================================================== */

if(columnas !== 7){

console.warn(
"Fila inválida eliminada:",
fila
);

fila.remove();

}

});

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

if(!result || !result.status){
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

function cargarGrupos(){

const callbackName =
"grupos_" + Date.now();

const script =
document.createElement("script");

window[callbackName] = function(result){

if(!result.status){
return;
}

const select =
document.getElementById(
"grupoConexion"
);

select.innerHTML =
'<option value="">Seleccione Grupo</option>';

result.data.forEach(g=>{

mapaGrupos[g.id] =
g.nombre;

select.innerHTML += `
<option value="${g.id}">
${g.nombre}
</option>
`;

});

delete window[callbackName];

script.remove();

};

script.src =
`${API_URL}?action=getGrupos&callback=${callbackName}`;

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

/* =====================================================
TOMAR FOTO
OPTIMIZADA PARA APPS SCRIPT
===================================================== */

/* =====================================================
TOMAR FOTO
ULTRA OPTIMIZADA JSONP
===================================================== */

function tomarFoto(){

const video =
document.getElementById("camera");

const canvas =
document.getElementById("canvas");

const preview =
document.getElementById("previewFoto");

/* =====================================================
REDUCIR TAMAÑO EXTREMADAMENTE
===================================================== */
if(
!video.videoWidth ||
!video.videoHeight
){
   Swal.fire({
      icon:"warning",
      title:"La cámara aún no está lista"
   });
   return;
}
const MAX_WIDTH = 350;

const scale =
MAX_WIDTH / video.videoWidth;

canvas.width =
MAX_WIDTH;

canvas.height =
video.videoHeight * scale;

const ctx =
canvas.getContext("2d");

/* =====================================================
SUAVIZAR IMAGEN
===================================================== */

ctx.imageSmoothingEnabled = true;

ctx.imageSmoothingQuality = "medium";

/* =====================================================
CAPTURAR
===================================================== */

ctx.drawImage(
video,
0,
0,
canvas.width,
canvas.height
);

/* =====================================================
COMPRESION MUY ALTA
===================================================== */

fotoBase64 =
canvas.toDataURL(
"image/jpeg",
0.30
);

/* =====================================================
VALIDAR
===================================================== */

console.log(
"Tamaño Base64:",
fotoBase64.length
);

console.log(
"Tamaño KB:",
Math.round(fotoBase64.length / 1024)
);
   
if(fotoBase64.length > 90000){

Swal.fire({
icon:"warning",
title:"Imagen demasiado grande",
text:"Intenta acercarte más a la cámara"
});

fotoBase64 = "";

return;

}

/* =====================================================
PREVIEW
===================================================== */
console.log(
"Base64 final:",
fotoBase64.length
);
 
preview.src =
fotoBase64;

preview.style.display =
"block";

}

/* =====================================================
GUARDAR SERVIDOR
SIN CORS
USANDO JSONP
===================================================== */

function guardarServidor(){

mostrarLoader();

const body = {

nombre:
document.getElementById("nombre").value,

apellidos:
document.getElementById("apellidos").value,

edad:
document.getElementById("edad").value,

estadoCivil:
document.getElementById("estadoCivil").value,

anioNacimiento:
document.getElementById("anioNacimiento").value,

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

tipoPersona:
document.getElementById("tipoPersona").value,   

foto:fotoBase64

};
/* =====================================================
CALLBACK
===================================================== */

const callbackName =
"guardar_" + Date.now();

window[callbackName] = function(data){

ocultarLoader();

try{

if(data.status){

/* =====================================================
CERRAR MODAL
===================================================== */

const modalElement =
document.getElementById("modalServidor");

const modal =
bootstrap.Modal.getInstance(modalElement);

if(modal){

modal.hide();

document.body.classList.remove("modal-open");

document.body.style.overflow = "";

document.body.style.paddingRight = "";

document
.querySelectorAll(".modal-backdrop")
.forEach(el=>el.remove());

}

/* =====================================================
DETENER CAMARA
===================================================== */

const video =
document.getElementById("camera");

if(video && video.srcObject){

video.srcObject
.getTracks()
.forEach(track=>track.stop());

video.srcObject = null;

}

/* =====================================================
ALERTA
===================================================== */

Swal.fire({
icon:"success",
title:"Asistente guardado correctamente"
});

limpiarFormulario();

/* =====================================================
RECARGAR TABLA
===================================================== */

setTimeout(()=>{

cargarServidores();

},500);

}else{

Swal.fire({
icon:"error",
title:data.message || "Error guardando Asistente"
});

}

}catch(error){

console.error(error);

Swal.fire({
icon:"error",
title:error.toString()
});

}

/* =====================================================
LIMPIEZA
===================================================== */

delete window[callbackName];

if(script){
script.remove();
}

};

/* =====================================================
ENVIAR DATOS
===================================================== */

const script =
document.createElement("script");

/* =====================================================
PARAMETROS
===================================================== */

const params =
new URLSearchParams({

action:"guardarServidor",
callback:callbackName,

tipoPersona:body.tipoPersona,  
nombre:body.nombre,
apellidos:body.apellidos,
edad:body.edad,
estadoCivil:body.estadoCivil,
anioNacimiento:body.anioNacimiento,
 
telefono:body.telefono,
email:body.email,

ministerioPrincipal:body.ministerioPrincipal,
ministerioSec1:body.ministerioSec1,
ministerioSec2:body.ministerioSec2,
ministerioSec3:body.ministerioSec3,

grupoConexion:body.grupoConexion,
fechaIngreso:body.fechaIngreso,
foto:body.foto

});

/* =====================================================
URL FINAL
===================================================== */
const urlFinal =
`${API_URL}?${params.toString()}`;

console.log(
"LONGITUD URL:",
urlFinal.length
);

console.log(
"LONGITUD FOTO:",
body.foto.length
);
 
script.src = urlFinal;

/* =====================================================
ERROR
===================================================== */

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
LIMPIAR FORMULARIO
===================================================== */

function limpiarFormulario(){

const campos = [

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


function validarTipoPersona(){

const tipo =
document.getElementById(
"tipoPersona"
).value;

const bloque =
document.getElementById(
"bloqueMinisterios"
);

if(tipo === "CONGREGANTE"){

bloque.style.display =
"none";

}else{

bloque.style.display =
"block";

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
cargarGrupos();
   
/* ==========================
TIPO PERSONA
========================== */

document
.getElementById("tipoPersona")
.addEventListener(
"change",
validarTipoPersona
);

validarTipoPersona();
   
}
);

function validarTipoPersona(){

const tipo =
document.getElementById(
"tipoPersona"
).value;

const mostrar =
tipo !== "CONGREGANTE";

document.getElementById(
"bloqueMinisterioPrincipal"
).style.display =
mostrar ? "block" : "none";

document.getElementById(
"bloqueMinisterio1"
).style.display =
mostrar ? "block" : "none";

document.getElementById(
"bloqueMinisterio2"
).style.display =
mostrar ? "block" : "none";

document.getElementById(
"bloqueMinisterio3"
).style.display =
mostrar ? "block" : "none";

}
