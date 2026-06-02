function cargarTemporadas(){

const callback =
"tmp_" + Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

const tbody =
document.getElementById(
"tablaTemporadas"
);

tbody.innerHTML = "";

const data =
result.data || [];

for(let i=1;i<data.length;i++){

const row = data[i];

tbody.innerHTML += `

<tr>

<td>${row[0]}</td>
<td>${row[1]}</td>
<td>${row[2]}</td>
<td>${row[3]}</td>
<td>${row[4]}</td>

</tr>

`;

}

delete window[callback];

script.remove();

};

script.src =
`${API_URL}?action=getTemporadas&callback=${callback}`;

document.body.appendChild(script);

}

function guardarTemporada(){

const nombre =
document.getElementById("nombreTemporada").value.trim();

const anio =
document.getElementById("anio").value;

const numSesiones =
document.getElementById("numSesiones").value;

if(nombre === ""){

Swal.fire({
icon:"warning",
title:"Capture el nombre de la temporada"
});

return;

}

const callback =
"save_" + Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

console.log("Respuesta Apps Script:", result);

try{

if(result && result.status){

const modalElement =
document.getElementById("modalTemporada");

const modal =
bootstrap.Modal.getInstance(modalElement);

if(modal){
modal.hide();
}

Swal.fire({
icon:"success",
title:"Temporada guardada correctamente"
}).then(()=>{

cargarTemporadas();

});

}else{

Swal.fire({
icon:"error",
title:
(result && result.message)
? result.message
: "Error al guardar temporada"
});

}

}catch(error){

console.error(error);

Swal.fire({
icon:"error",
title:error.toString()
});

}

delete window[callback];

if(script){
script.remove();
}

};

script.onerror = function(){

console.error("Error JSONP");

Swal.fire({
icon:"error",
title:"Error conexión Apps Script"
});

};

script.src =

`${API_URL}?action=guardarTemporada`
+
`&callback=${callback}`
+
`&nombre=${encodeURIComponent(nombre)}`
+
`&anio=${encodeURIComponent(anio)}`
+
`&numSesiones=${encodeURIComponent(numSesiones)}`;

document.body.appendChild(script);

}

document.addEventListener(
"DOMContentLoaded",
function(){

cargarTemporadas();

}
);
