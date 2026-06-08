let procesando = false;

const html5QrCode =
new Html5Qrcode("reader");

function iniciarScanner(){

html5QrCode.start(

{
facingMode:"environment"
},

{
fps:10,
qrbox:300
},

onScanSuccess

);

}

function onScanSuccess(idPersona){

if(procesando){
return;
}

procesando = true;

registrarAsistencia(idPersona);

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
✅ Bienvenido<br>
${result.nombre}
`;

}else{

mensaje.className =
"error";

mensaje.innerHTML =

`
❌ ${result.message}
`;

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


