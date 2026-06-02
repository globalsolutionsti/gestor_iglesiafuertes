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
document.getElementById(
"nombreTemporada"
).value;

const anio =
document.getElementById(
"anio"
).value;

const numSesiones =
document.getElementById(
"numSesiones"
).value;

const callback =
"save_" + Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(result.status){

Swal.fire({

icon:"success",
title:"Temporada guardada"

});

cargarTemporadas();

bootstrap.Modal
.getInstance(
document.getElementById(
"modalTemporada"
)
)
.hide();

}else{

Swal.fire({

icon:"error",
title:result.message

});

}

delete window[callback];

script.remove();

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
