async function guardarNivel(){

const body = {

nombre:
document.getElementById("nombreNivel").value,

descripcion:
document.getElementById("descripcionNivel").value,

estado:
document.getElementById("estadoNivel").value

};

const response = await fetch(
`${API_URL}?action=crearNivel`,
{
method:"POST",
body:JSON.stringify(body)
}
);

const data = await response.json();

Swal.fire({
icon:"success",
title:data.message
});

cargarNiveles();

}

async function cargarNiveles(){

const response = await fetch(
`${API_URL}?action=getNiveles`
);

const data = await response.json();

let html = "";

for(let i=1;i<data.data.length;i++){

const n = data.data[i];

html += `

<tr>

<td>${n[1]}</td>
<td>${n[2]}</td>
<td>${n[3]}</td>

</tr>
`;

}

document.getElementById("bodyNiveles")
.innerHTML = html;

$('#tablaNiveles').DataTable();

}

cargarNiveles();
