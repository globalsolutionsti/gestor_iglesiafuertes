let tabla;

async function cargarServidores(){

mostrarLoader();

const response = await fetch(
`${API_URL}?action=getServidores`
);

const data = await response.json();

let html = "";

for(let i=1; i<data.data.length; i++){

const s = data.data[i];

html += `
<tr>

<td>
<img src="${s[13] || 'https://i.pravatar.cc/50'}"
class="avatar">
</td>

<td>
<a href="perfil.html?numero=${s[1]}"
class="perfil-link">
${s[2]} ${s[3]}
</a>
</td>

<td>${s[9]}</td>

<td>${s[10]}</td>

<td>
<span class="badge bg-success">
${s[12]}
</span>
</td>

<td>

<button class="btn btn-sm btn-primary"
onclick="editarServidor('${s[0]}')">

<i class="fa fa-edit"></i>

</button>

<button class="btn btn-sm btn-danger"
onclick="eliminarServidor('${s[0]}')">

<i class="fa fa-trash"></i>

</button>

</td>

</tr>
`;

}

document.getElementById("tablaServidores")
.innerHTML = html;

if(tabla){
tabla.destroy();
}

tabla = $('#tabla').DataTable();

ocultarLoader();

}

cargarServidores();

async function guardarServidor(){

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

foto:
document.getElementById("foto").value

};

mostrarLoader();

const response = await fetch(
`${API_URL}?action=crearServidor`,
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

cargarServidores();

}

function editarServidor(id){

Swal.fire({
icon:"info",
title:"Edición siguiente etapa"
});

}

function eliminarServidor(id){

Swal.fire({
title:"¿Eliminar servidor?",
icon:"warning",
showCancelButton:true
}).then((result)=>{

if(result.isConfirmed){

Swal.fire({
icon:"success",
title:"Servidor eliminado"
});

}

});

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

const loader = document.getElementById("loader");

if(loader){
loader.remove();
}

}
