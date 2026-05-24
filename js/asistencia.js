function onScanSuccess(decodedText){

registrar(decodedText);

}

const html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras().then(devices => {

html5QrCode.start(
devices[0].id,
{
fps:10,
qrbox:250
},
onScanSuccess
);

});

async function registrar(numeroServidor){

const response = await fetch(
`${API_URL}?action=registrarAsistencia`,
{
method:"POST",
body:JSON.stringify({
servidorId:numeroServidor
})
}
);

const data = await response.json();

alert(data.message);

}
