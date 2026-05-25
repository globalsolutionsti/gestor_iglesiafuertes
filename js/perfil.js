const params =
new URLSearchParams(
window.location.search
);

const id = params.get("id");

cargarPerfil();

function cargarPerfil(){

mostrarLoader();

const callbackName =
"jsonp_callback_" + Date.now();

window[callbackName] = function(response){

const data = response.data;

const servidor =
data.find(s => s[1] == id);

if(!servidor){

Swal.fire({

icon:"error",
title:"Servidor no encontrado"

});

return;

}

document.getElementById(
"fotoServidor"
).src = servidor[10];

document.getElementById(
"nombreServidor"
).innerText =
servidor[2] + " " + servidor[3];

document.getElementById(
"ministerioServidor"
).innerText =
servidor[6];

document.getElementById(
"numeroServidor"
).innerText =
servidor[1];

document.getElementById(
"emailServidor"
).innerText =
servidor[5];

document.getElementById(
"telefonoServidor"
).innerText =
servidor[4];

document.getElementById(
"grupoServidor"
).innerText =
servidor[7];

document.getElementById(
"fechaIngreso"
).innerText =
servidor[8];

// ASISTENCIAS DEMO

document.getElementById(
"historialAsistencias"
).innerHTML = `

<div class="timeline-item">

<h6>Grupo Conexión</h6>

<p>Asistencia registrada</p>

</div>

<div class="timeline-item">

<h6>Evento General</h6>

<p>Participó en reunión especial</p>

</div>

`;

// FORMACIÓN DEMO

document.getElementById(
"historialFormacion"
).innerHTML = `

<div class="curso-card">

<h6>Fundamentos</h6>

<p>Completado</p>

</div>

<div class="curso-card">

<h6>Liderazgo</h6>

<p>En progreso</p>

</div>

`;

ocultarLoader();

document.body.removeChild(script);

delete window[callbackName];

};

const script =
document.createElement("script");

script.src =

`${API_URL}?action=getServidores&callback=${callbackName}`;

document.body.appendChild(script);

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
