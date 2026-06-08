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

const selector =
document.getElementById("selectorCamara");

selector.innerHTML =
"<option>Cargando cámaras...</option>";

/* ==========================
DESPERTAR CAMARAS IOS
========================== */

try{

await navigator.mediaDevices.getUserMedia({
video:true
});

}catch(e){}

/* ==========================
OBTENER CAMARAS
========================== */

const cameras =
await Html5Qrcode.getCameras();

selector.innerHTML = "";

if(cameras.length === 0){

selector.innerHTML =
"<option>No se detectaron cámaras</option>";

return;

}

cameras.forEach(cam=>{

const option =
document.createElement("option");

option.value =
cam.id;

option.text =
cam.label || "Cámara";

selector.appendChild(option);

});

/* ==========================
SELECCIONAR FRONTAL IOS
========================== */

let frontal = cameras.find(c =>

c.label.toLowerCase().includes("front") ||
c.label.toLowerCase().includes("frontal")

);

if(frontal){

selector.value =
frontal.id;

}

}catch(error){

console.error(error);

document.getElementById(
"selectorCamara"
).innerHTML =

"<option>Error cargando cámaras</option>";

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
