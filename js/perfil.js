const params = new URLSearchParams(
window.location.search
);

const numero = params.get("numero");

async function cargarPerfil(){

const response = await fetch(
`${API_URL}?action=getServidor&numero=${numero}`
);

const data = await response.json();

const s = data.servidor;

document.getElementById("nombrePerfil")
.innerText = s[2] + " " + s[3];

document.getElementById("ministerioPerfil")
.innerText = s[9];

document.getElementById("fotoPerfil")
.src = s[13];

document.getElementById("qrPerfil")
.src = s[14];

}

cargarPerfil();
