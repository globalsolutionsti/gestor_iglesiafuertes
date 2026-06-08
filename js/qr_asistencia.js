const html5QrCode =
new Html5Qrcode(
"reader"
);

function iniciarScanner(){

html5QrCode.start(

{
facingMode:"environment"
},

{
fps:10,
qrbox:250
},

onScanSuccess

);

}

function onScanSuccess(texto){

registrarAsistencia(
texto.trim()
);

}

function registrarAsistencia(idPersona){

const callback =
"asistencia_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(result.status){

document.getElementById(
"resultado"
).innerHTML =

`
<div class="alert alert-success">

<h5>
✅ Asistencia Registrada
</h5>

<b>
${result.nombre}
</b>

<br>

Sesión:
${result.idSesion}

</div>
`;

Swal.fire({

icon:"success",

title:"Asistencia registrada",

text:result.nombre,

timer:2000,

showConfirmButton:false

});

}else{

document.getElementById(
"resultado"
).innerHTML =

`
<div class="alert alert-danger">

${result.message}

</div>
`;

Swal.fire({

icon:"warning",

title:result.message,

timer:2500,

showConfirmButton:false

});

}

delete window[callback];

script.remove();

setTimeout(()=>{

iniciarScanner();

},1500);

};

html5QrCode.stop().then(()=>{

script.src =

`${API_URL}?action=registrarAsistenciaQR`
+
`&callback=${callback}`
+
`&idPersona=${encodeURIComponent(idPersona)}`;

document.body.appendChild(script);

});

}

document.addEventListener(
"DOMContentLoaded",
iniciarScanner
);
