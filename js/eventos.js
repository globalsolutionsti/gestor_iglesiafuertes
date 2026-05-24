let tablaEventos;
let editandoEvento = false;
let eventoEditando = null;

async function cargarEventos(){

mostrarLoader();

const response = await fetch(
`${API_URL}?action=getEventos`
);

const data = await response.json();

let html = "";

for(let i=1; i<data.data.length; i++){

const e = data.data[i];

html += `

<tr>

<td>${e[1]}</td>

<td>
<span class="badge bg-primary">
${e[2]}
</span>
</td>

<td>${e[3]}</td>

<td>${e[4]}</td>

<td>

<span class="badge ${
e[5] == 'ACTIVO'
? 'bg-success'
: 'bg-danger'
}">

${e[5]}

</span>

</td>

<td>

<button class="btn btn-primary btn-sm"
onclick='editarEvento(${JSON.stringify(e)})'>

<i class="fa fa-edit"></i>

</button>

<button class="btn btn-danger btn-sm"
onclick="eliminarEvento('${e[0]}')">

<i class="fa fa-trash"></i>

</button>

</td>

</tr>
`;

}

document.getElementById("bodyEventos")
.innerHTML = html;

if(tablaEventos){
tablaEventos.destroy();
}

tablaEventos = $('#tablaEventos').DataTable();

ocultarLoader();

}

cargarEventos();

async function guardarEvento(){

const body = {

id:eventoEditando,

nombre:
document.getElementById("nombreEvento").value,

tipo:
document.getElementById("tipoEvento").value,

fecha:
document.getElementById("fechaEvento").value,

hora:
document.getElementById("horaEvento").value,

estado:
document.getElementById("estadoEvento").value

};

const accion = editandoEvento
? "actualizarEvento"
: "crearEvento";

mostrarLoader();

const response = await fetch(
`${API_URL}?action=${accion}`,
{
method:"POST",
body:JSON.stringify(body)
}
);

const data = await response.json();

ocultarLoader();

Swal.fire({
icon:"success",
title:data.message
});

bootstrap.Modal.getInstance(
document.getElementById("modalEvento")
).hide();

limpiarFormularioEvento();

cargarEventos();

}

function editarEvento(e){

editandoEvento = true;

eventoEditando = e[0];

document.getElementById("nombreEvento").value = e[1];
document.getElementById("tipoEvento").value = e[2];
document.getElementById("fechaEvento").value = e[3];
document.getElementById("horaEvento").value = e[4];
document.getElementById("estadoEvento").value = e[5];

new bootstrap.Modal(
document.getElementById("modalEvento")
).show();

}

async function eliminarEvento(id){

Swal.fire({

title:"¿Eliminar evento?",
icon:"warning",
showCancelButton:true

}).then(async(result)=>{

if(result.isConfirmed){

mostrarLoader();

const response = await fetch(
`${API_URL}?action=eliminarEvento`,
{
method:"POST",
body:JSON.stringify({id:id})
}
);

const data = await response.json();

ocultarLoader();

Swal.fire({
icon:"success",
title:data.message
});

cargarEventos();

}

});

}

function limpiarFormularioEvento(){

editandoEvento = false;
eventoEditando = null;

document.getElementById("nombreEvento").value = "";
document.getElementById("tipoEvento").value = "Servicio";
document.getElementById("fechaEvento").value = "";
document.getElementById("horaEvento").value = "";
document.getElementById("estadoEvento").value = "ACTIVO";

}

function mostrarLoader(){

document.body.insertAdjacentHTML(
"beforeend",
`
<div class="loader-overlay" id="loader">
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
