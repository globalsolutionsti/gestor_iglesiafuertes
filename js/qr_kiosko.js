let procesando = false;

let html5QrCode = null;

let camaraActual = null;

/* ===================================
INICIAR
=================================== */

document.addEventListener(
"DOMContentLoaded",
async function(){

const selector =
document.getElementById(
"selectorCamara"
);

selector.innerHTML =

`
<option value="frontal">
Cámara Frontal
</option>

<option value="trasera">
Cámara Trasera
</option>
`;

camaraActual = {
facingMode:"user"
};

await iniciarScanner();

}
);

document.addEventListener(
"change",
function(e){

if(
e.target &&
e.target.id === "selectorCamara"
){

cambiarCamara();

}

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

try{

await navigator.mediaDevices.getUserMedia({
video:true
});

}catch(e){

console.log(e);

}

/* ==========================
OBTENER CAMARAS
========================== */

const cameras =
await Html5Qrcode.getCameras();

selector.innerHTML = "";

/* ==========================
NO DEVOLVIO CAMARAS
(IPAD ANTIGUO)
========================== */

if(!cameras || cameras.length === 0){

selector.innerHTML =

`
<option value="frontal">
Cámara Frontal
</option>

<option value="trasera">
Cámara Trasera
</option>
`;

camaraActual = {
facingMode:"user"
};

await iniciarScanner();

return;

}

/* ==========================
CAMARAS DETECTADAS
========================== */

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
BUSCAR FRONTAL
========================== */

let frontal = cameras.find(c =>

(c.label || "")
.toLowerCase()
.includes("front")

||

(c.label || "")
.toLowerCase()
.includes("frontal")

);

if(frontal){

selector.value =
frontal.id;

camaraActual =
frontal.id;

}else{

camaraActual =
cameras[0].id;

}
await iniciarScanner();
}
catch(error){

console.error(error);

/* ==========================
FALLBACK IOS 12
========================== */

const selector =
document.getElementById("selectorCamara");

selector.innerHTML =

`
<option value="frontal">
Cámara Frontal
</option>

<option value="trasera">
Cámara Trasera
</option>
`;

camaraActual = {
facingMode:"user"
};
await iniciarScanner();
}

}

async function cambiarCamara(){

const selector =
document.getElementById("selectorCamara");

const valor =
selector.value;

/* ==========================
IOS ANTIGUO
========================== */

if(valor === "frontal"){

camaraActual = {
facingMode:"user"
};

}
else if(valor === "trasera"){

camaraActual = {
facingMode:"environment"
};

}
else{

camaraActual = valor;

}

await reiniciarScanner();

}

/* ===================================
INICIAR SCANNER
=================================== */

async function iniciarScanner(){

try{

if(html5QrCode){

try{

await html5QrCode.stop();

}catch(e){}

}

html5QrCode =
new Html5Qrcode("reader");

await html5QrCode.start(

camaraActual || {
facingMode:"user"
},

{
fps:15,
qrbox:300
},

onScanSuccess

);

}catch(error){

console.error(
"ERROR CAMARA:",
error
);

}

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
