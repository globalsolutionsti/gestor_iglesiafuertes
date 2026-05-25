let tabla = null;
let fotoBase64 = "";

/* =====================================================
CARGAR SERVIDORES
===================================================== */

function cargarServidores(){

mostrarLoader();

const callbackName =
"jsonp_callback_" + Date.now();

const script =
document.createElement("script");

/* =====================================================
TIMEOUT SEGURIDAD
===================================================== */

const timeout = setTimeout(()=>{

ocultarLoader();

Swal.fire({

icon:"error",
title:"Apps Script tardó demasiado"

});

},15000);

/* =====================================================
CALLBACK JSONP
===================================================== */

window[callbackName] = function(response){

clearTimeout(timeout);

try{

if(!response.status){

Swal.fire({

icon:"error",
title:response.message ||
"Error cargando servidores"

});

ocultarLoader();
return;

}

const data =
response.data || [];

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

<td>

<button
class="btn btn-primary btn-sm">

<i class="fa fa-edit"></i>

</button>

<button
class="btn btn-danger btn-sm">

<i class="fa fa-trash"></i>

</button>

</td>

</tr>

`;

}

/* =====================================================
DESTRUIR TABLA
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
destroy:true

});

/* =====================================================
OCULTAR LOADER
===================================================== */

ocultarLoader();

/* =====================================================
LIMPIAR CALLBACK
===================================================== */

delete window[callbackName];

if(script.parentNode){

script.parentNode.removeChild(script);

}

}catch(error){

console.error(error);

ocultarLoader();

Swal.fire({

icon:"error",
title:error.toString()

});

}

};

/* =====================================================
URL JSONP
===================================================== */

script.src =

`${API_URL}?action=getServidores&callback=${callbackName}`;

/* =====================================================
INSERTAR SCRIPT
===================================================== */

document.body.appendChild(script);

}

/* =====================================================
ACTIVAR CAMARA
===================================================== */

async function activarCamara(){

try{

const video =
document.getElementById(
"camera"
);

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
document.getElementById(
"camera"
);

const canvas =
document.getElementById(
"canvas"
);

const preview =
document.getElementById(
"previewFoto"
);

canvas.width =
video.videoWidth;

canvas.height =
video.videoHeight;

const ctx =
canvas.getContext("2d");

ctx.drawImage(
video,
0,
0
);

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
document.getElementById(
"numeroServidor"
).value,

nombre:
document.getElementById(
"nombre"
).value,

apellidos:
document.getElementById(
"apellidos"
).value,

telefono:
document.getElementById(
"telefono"
).value,

email:
document.getElementById(
"email"
).value,

ministerio:
document.getElementById(
"ministerio"
).value,

grupoConexion:
document.getElementById(
"grupoConexion"
).value,

fechaIngreso:
document.getElementById(
"fechaIngreso"
).value,

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
title:"Servidor guardado"

});

/* =====================================================
CERRAR MODAL
===================================================== */

const modal =
bootstrap.Modal.getInstance(
document.getElementById(
"modalServidor"
)
);

if(modal){

modal.hide();

}

/* =====================================================
LIMPIAR CAMPOS
===================================================== */

[
"numeroServidor",
"nombre",
"apellidos",
"telefono",
"email",
"ministerio",
"grupoConexion",
"fechaIngreso"

].forEach(id => {

const el =
document.getElementById(id);

if(el){

el.value = "";

}

});

/* =====================================================
RESET FOTO
===================================================== */

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

/* =====================================================
DETENER CAMARA
===================================================== */

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

/* =====================================================
RECARGAR TABLA
===================================================== */

setTimeout(()=>{

cargarServidores();

},800);

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
LOADER
===================================================== */

function mostrarLoader(){

if(document.getElementById("loader")){
return;
}

document.body.insertAdjacentHTML(

"beforeend",

`

<div id="loader"

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
document.getElementById(
"loader"
);

if(loader){

loader.remove();

}

}

/* =====================================================
INIT
===================================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

cargarServidores();

}

);
