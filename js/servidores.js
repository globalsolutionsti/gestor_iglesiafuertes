let tabla;
let editando = false;
let servidorEditando = null;

async function cargarServidores(){

mostrarLoader();

const response = await fetch(
`${API_URL}?action=getServidores`
);

const data = await response.json();

let html = "";

for(let i=1;i<data.data.length;i++){

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

<button class="btn btn-primary btn-sm"
onclick='abrirEditar(${JSON.stringify(s)})'>

<i class="fa fa-edit"></i>

</button>

<button class="btn btn-danger btn-sm"
onclick="eliminar('${s[0]}')">

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

id: servidorEditando,

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

const accion = editando
? "actualizarServidor"
: "crearServidor";

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
document.getElementById("modalServidor")
).hide();

limpiarFormulario();

cargarServidores();

}

function abrirEditar(s){

editando = true;

servidorEditando = s[0];

document.getElementById("numeroServidor").value = s[1];
document.getElementById("nombre").value = s[2];
document.getElementById("apellidos").value = s[3];
document.getElementById("telefono").value = s[4];
document.getElementById("email").value = s[5];
document.getElementById("ministerio").value = s[9];
document.getElementById("grupoConexion").value = s[10];
document.getElementById("foto").value = s[13];

new bootstrap.Modal(
document.getElementById("modalServidor")
).show();

}

function limpiarFormulario(){

editando = false;
servidorEditando = null;

document.querySelectorAll("input")
.forEach(input=>input.value="");

}

async function eliminar(id){

Swal.fire({

title:"¿Eliminar servidor?",
icon:"warning",
showCancelButton:true

}).then(async(result)=>{

if(result.isConfirmed){

mostrarLoader();

const response = await fetch(
`${API_URL}?action=eliminarServidor`,
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

cargarServidores();

}

});

}

function exportarExcel(){

let wb = XLSX.utils.table_to_book(
document.getElementById("tabla")
);

XLSX.writeFile(wb,"servidores.xlsx");

}

function exportarPDF(){

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

doc.text("Reporte Servidores",20,20);

doc.save("reporte.pdf");

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
