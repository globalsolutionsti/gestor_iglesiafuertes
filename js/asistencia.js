let scannerActivo = false;

async function iniciarScanner(){

const html5QrCode = new Html5Qrcode("reader");

const config = {
fps:10,
qrbox:250
};

html5QrCode.start(

{ facingMode:"environment" },

config,

async(qrCodeMessage)=>{

if(scannerActivo) return;

scannerActivo = true;

navigator.vibrate(200);

const audio = new Audio(
'https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg'
);

audio.play();

registrarAsistencia(qrCodeMessage);

setTimeout(()=>{
scannerActivo = false;
},3000);

}

);

}

iniciarScanner();

async function registrarAsistencia(numeroServidor){

mostrarLoader();

const evento = prompt(
"Nombre del evento actual:"
);

const response = await fetch(
`${API_URL}?action=registrarAsistencia`,
{
method:"POST",
body:JSON.stringify({

numeroServidor,
evento

})
}
);

const data = await response.json();

ocultarLoader();

Swal.fire({
icon:data.status ? "success":"error",
title:data.message
});

document.getElementById("resultadoAsistencia")
.innerHTML = `

<h4>${numeroServidor}</h4>
<p>${evento}</p>

`;

cargarAsistencias();

}

async function cargarAsistencias(){

const response = await fetch(
`${API_URL}?action=getAsistencias`
);

const data = await response.json();

let html = "";

for(let i=1;i<data.data.length;i++){

const a = data.data[i];

html += `

<tr>

<td>${a[1]}</td>
<td>${a[2]}</td>
<td>${a[3]}</td>
<td>${a[4]}</td>

</tr>
`;

}

document.getElementById("bodyAsistencias")
.innerHTML = html;

$('#tablaAsistencias').DataTable();

}

cargarAsistencias();

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
