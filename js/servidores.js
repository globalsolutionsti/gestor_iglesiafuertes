let tabla;

async function cargarServidores(){

mostrarLoader();

const callbackName =
"jsonp_callback_" + Date.now();

window[callbackName] = function(response){

const data = response.data;

let html = "";

for(let i=1;i<data.length;i++){

const s = data[i];

html += `

<tr>

<td>

<img src="${
s[10] || 'https://i.pravatar.cc/150'
}"

class="avatar">

</td>

<td>

<a href="perfil.html?id=${s[1]}"
class="perfil-link">

${s[2]} ${s[3]}

</a>

</td>

<td>${s[6]}</td>

<td>${s[7]}</td>

<td>

<span class="badge bg-success">

${s[9]}

</span>

</td>

<td>

<button class="btn btn-primary btn-sm">

<i class="fa fa-edit"></i>

</button>

<button class="btn btn-danger btn-sm">

<i class="fa fa-trash"></i>

</button>

</td>

</tr>

`;

}

document.getElementById(
"tablaServidores"
).innerHTML = html;

if(tabla){

tabla.destroy();

}

tabla = $("#tabla").DataTable({

responsive:true,
pageLength:10

});

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

cargarServidores();

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

if(data.status){

Swal.fire({

icon:"success",
title:"Servidor guardado"

});

bootstrap.Modal
.getInstance(
document.getElementById(
"modalServidor"
)
)
.hide();

// LIMPIAR TABLA

if(tabla){

tabla.destroy();

}

// RECARGAR LISTADO

cargarServidores();

// LIMPIAR FORMULARIO

document
.getElementById(
"numeroServidor"
).value = "";

document
.getElementById(
"nombre"
).value = "";

document
.getElementById(
"apellidos"
).value = "";

document
.getElementById(
"telefono"
).value = "";

document
.getElementById(
"email"
).value = "";

document
.getElementById(
"ministerio"
).value = "";

document
.getElementById(
"groupoConexion"
).value = "";

document
.getElementById(
"fechaIngreso"
).value = "";

fotoBase64 = "";

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
