let procesando = false;

let html5QrCode = null;

let camaraActual = null;

/* ===================================
INICIAR
=================================== */

document.addEventListener(
"DOMContentLoaded",
async function(){

await cargarCamaras();

}
);

/* ===================================
OBTENER CAMARAS
=================================== */

async function cargarCamaras(){

try{

const devices =
await Html5Qrcode.getCameras();

const select =
document.getElementById(
"cameraSelect"
);

select.innerHTML = "";

if(devices.length === 0){

select.innerHTML =
"<option>No hay cámaras</option>";

return;

}

/* ==========================
LLENAR COMBO
========================== */

devices.forEach(device=>{

const option =
document.createElement("option");

option.value =
device.id;

option.text =
device.label ||
`Cámara ${device.id}`;

select.appendChild(option);

});

/* ==========================
SELECCIONAR FRONTAL
SI EXISTE
========================== */

let frontal = devices.find(d=>

(d.label || "")
.toLowerCase()
.includes("front")

);

if(frontal){

camaraActual =
frontal.id;

select.value =
frontal.id;

}else{

camaraActual =
devices[0].id;

}

/* ==========================
CAMBIO MANUAL
========================== */

select.addEventListener(
"change",
async function(){

camaraActual =
this.value;

await reiniciarScanner();

}
);

await iniciarScanner();

}catch(error){

console.error(error);

}

}

/* ===================================
INICIAR SCANNER
=================================== */

async function iniciarScanner(){

html5QrCode =
new Html5Qrcode("reader");

await html5QrCode.start(

camaraActual,

{
fps:15,
qrbox:300
},

onScanSuccess

);

}

/* ===================================
REINICIAR SCANNER
=================================== */

async function reiniciarScanner(){

try{

if(html5QrCode){

await html5QrCode.stop();

await html5QrCode.clear();

}

}catch(error){

console.log(error);

}

await iniciarScanner();

}

/* ===================================
QR DETECTADO
=================================== */

function onScanSuccess(qrTexto){

if(procesando){
return;
}

procesando = true;

/* ==========================
EXTRAER ID
========================== */

let idPersona = qrTexto;

if(qrTexto.startsWith("PERSONA:")){

idPersona =
qrTexto.replace(
"PERSONA:",
""
).trim();

}

console.log(
"ID EXTRAIDO:",
idPersona
);

registrarAsistencia(
idPersona
);

}

/* ===================================
REGISTRAR
=================================== */

function registrarAsistencia(idPersona){

const callback =
"kiosko_" + Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

const mensaje =
document.getElementById(
"mensaje"
);

if(result.status){

mensaje.className =
"ok";

mensaje.innerHTML =

`
✅ BIENVENIDO

<br><br>

${result.nombre}
`;

reproducirSonidoOK();

}else{

mensaje.className =
"error";

mensaje.innerHTML =

`
❌

${result.message}
`;

reproducirSonidoError();

}

setTimeout(()=>{

mensaje.className = "";

mensaje.innerHTML =
"Esperando QR...";

procesando = false;

},3000);

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=registrarAsistenciaQR`
+
`&callback=${callback}`
+
`&idPersona=${encodeURIComponent(idPersona)}`;

document.body.appendChild(script);

}

/* ===================================
SONIDOS
=================================== */

function reproducirSonidoOK(){

const audio =
new Audio(
"https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"
);

audio.play();

}

function reproducirSonidoError(){

const audio =
new Audio(
"https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
);

audio.play();

}
