let procesando = false;

let ultimoQR = "";
let ultimoTiempo = 0;

const html5QrCode =
new Html5Qrcode("reader");

function iniciarScanner(){

html5QrCode.start(

{
facingMode:"environment"
},

{
fps:15,
qrbox:300
},

onScanSuccess

);

}

function onScanSuccess(idPersona){

console.log(
"QR LEIDO:",
idPersona
);

if(procesando){
return;
}

procesando = true;

registrarAsistencia(
String(idPersona).trim()
);

}

function registrarAsistencia(idPersona){

const callback =
"kiosko_" + Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

const mensaje =
document.getElementById("mensaje");

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

document.addEventListener(
"DOMContentLoaded",
iniciarScanner
);
