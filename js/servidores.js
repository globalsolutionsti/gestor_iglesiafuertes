let fotoBase64 = "";

async function activarCamara(){

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

}

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

ctx.drawImage(
video,
0,
0
);

fotoBase64 =
canvas.toDataURL("image/jpeg");

preview.src = fotoBase64;

preview.style.display = "block";

}

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

const response = await fetch(

API_URL + "?action=guardarServidor",

{
method:"POST",
body:JSON.stringify(body)
}

);

const data =
await response.json();

ocultarLoader();

Swal.fire({

icon:data.status
? "success"
: "error",

title:data.message

});

if(data.status){

location.reload();

}

}catch(error){

ocultarLoader();

Swal.fire({

icon:"error",
title:error.toString()

});

}

}

function mostrarLoader(){

document.body.insertAdjacentHTML(

"beforeend",

`

<div class="loader-overlay"
id="loader">

<div class="loader"></div>

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
