async function cargarServidores(){

const response = await fetch(
`${API_URL}?action=getServidores`
);

const data = await response.json();

let html = "";

for(let i=1; i<data.data.length; i++){

html += `
<tr>
<td>${data.data[i][0]}</td>
<td>${data.data[i][2]}</td>
<td>${data.data[i][9]}</td>
</tr>
`;

}

document.getElementById("tablaServidores")
.innerHTML = html;

}

cargarServidores();

function mostrarFormulario(){

alert("Formulario siguiente etapa");

}
