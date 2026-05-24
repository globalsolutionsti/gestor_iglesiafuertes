async function cargarEventos(){

const response = await fetch(
`${API_URL}?action=getEventos`
);

const data = await response.json();

let html = "";

for(let i=1; i<data.data.length; i++){

html += `
<div class="evento-card">
<h4>${data.data[i][1]}</h4>
<p>${data.data[i][3]}</p>
</div>
`;

}

document.getElementById("listaEventos")
.innerHTML = html;

}

cargarEventos();
