const params =
new URLSearchParams(
window.location.search
);

const idTemporada =
params.get("id");

/* ==========================================
INICIO
========================================== */

document.addEventListener(
"DOMContentLoaded",
function(){

cargarSesiones();

}
);

/* ==========================================
SESIONES
========================================== */

function cargarSesiones(){

const callback =
"sesiones_" +
Date.now() +
"_" +
Math.floor(
Math.random()*100000
);

const script =
document.createElement("script");

window[callback] = function(result){

const contenedor =
document.getElementById(
"contenedorSesiones"
);

contenedor.innerHTML = "";

if(!result.status){

contenedor.innerHTML =
"Error cargando sesiones";

return;

}

const sesiones =
result.data || [];

document.getElementById(
"tituloTemporada"
).innerHTML =
"Temporada " + nombre;
  
if(sesiones.length === 0){

contenedor.innerHTML =
"No existen sesiones";

return;

}

sesiones.forEach(sesion=>{

contenedor.innerHTML += `

<div class="card mb-3">

<div class="card-header">

<h5 class="mb-0">

${sesion[3]}

</h5>

</div>

<div class="card-body">

<div
id="grupos_${sesion[0]}">

Cargando grupos...

</div>

</div>

</div>

`;

cargarGruposSesion(
sesion[0]
);

});

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getSesiones`
+
`&callback=${callback}`
+
`&temporadaId=${idTemporada}`;

document.body.appendChild(script);

}

/* ==========================================
GRUPOS DE LA SESION
========================================== */

function cargarGruposSesion(
idSesion
){

const callback =
"grupos_" +
idSesion.replace(/[^a-zA-Z0-9]/g,"")
+
"_"
+
Date.now()
+
"_"
+
Math.floor(
Math.random()*100000
);

const script =
document.createElement("script");

window[callback] = function(result){

const div =
document.getElementById(
`grupos_${idSesion}`
);

if(!div){
return;
}

if(!result.status){

div.innerHTML =
"Error cargando grupos";

return;

}

const grupos =
result.data || [];

let html = `

<table class="table table-bordered">

<thead>

<tr>

<th>Grupo</th>
<th>Estado</th>

</tr>

</thead>

<tbody>

`;

grupos.forEach(g=>{

html += `

<tr>

<td>${g[4]}</td>

<td>${g[5]}</td>

</tr>

`;

});

html += `

</tbody>

</table>

`;

div.innerHTML = html;

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getSesionGrupos`
+
`&callback=${callback}`
+
`&idSesion=${idSesion}`;

document.body.appendChild(script);

}
