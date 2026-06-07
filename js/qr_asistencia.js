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

document.getElementById(
"resultado"
).innerHTML =

`
<div class="alert alert-success">

QR Detectado:

<br>

<b>${texto}</b>

</div>
`;

html5QrCode.stop();

}

document.addEventListener(
"DOMContentLoaded",
iniciarScanner
);
