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

const btnGeneral =
document.getElementById(
"btnDashboardGeneral"
);

if(btnGeneral){

btnGeneral.href =
`dashboard_grupos.html?id=${idTemporada}`;

}

const btnAsistencias =
document.getElementById(
"btnDashboardAsistencias"
);

if(btnAsistencias){

btnAsistencias.href =
`dashboard_asistencias.html?id=${idTemporada}`;

}

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
  
if(sesiones.length === 0){

contenedor.innerHTML =
"No existen sesiones";

return;

}

sesiones.forEach(sesion=>{

const badgeEstado =

sesion[4] == "ABIERTA"

? `<span class="badge bg-success ms-2">ABIERTA</span>`

: `<span class="badge bg-danger ms-2">CERRADA</span>`;

contenedor.innerHTML += `

<div class="card mb-3">

<div class="card-header">

<h5 class="mb-0">

${sesion[3]}

${badgeEstado}

<div class="float-end d-flex gap-2">

<button
class="btn btn-success btn-sm"
onclick="abrirSesion('${sesion[0]}')">

<i class="fa fa-lock-open"></i>

Abrir

</button>

<button
class="btn btn-danger btn-sm"
onclick="cerrarSesion('${sesion[0]}')">

<i class="fa fa-lock"></i>

Cerrar

</button>

<a
href="dashboard_grupos.html?id=${idTemporada}"
class="btn btn-primary btn-sm">

<i class="fa fa-chart-pie"></i>

Dashboard

</a>

</div>

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
ABRIR SESION
========================================== */

function abrirSesion(idSesion){

actualizarEstadoSesion(
idSesion,
"abrirSesion"
);

}

/* ==========================================
CERRAR SESION
========================================== */

function cerrarSesion(idSesion){

actualizarEstadoSesion(
idSesion,
"cerrarSesion"
);

}

/* ==========================================
ACTUALIZAR
========================================== */

function actualizarEstadoSesion(

idSesion,
accion

){

const callback =

"estado_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(result.status){

Swal.fire({

icon:"success",

title:"Estado actualizado"

}).then(()=>{

cargarSesiones();

});

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

`${API_URL}?action=${accion}`
+
`&callback=${callback}`
+
`&idSesion=${idSesion}`;

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
<th width="180">
Acciones
</th>

</tr>

</thead>

<tbody>

`;

grupos.forEach(g=>{

html += `

<tr>

<td>

${g[4]}

</td>

<td>

${g[5]}

</td>

<td>

<a
href="participantes_grupo.html?idTemporada=${g[1]}&idSesion=${g[2]}&idGrupo=${g[3]}"
class="btn btn-primary btn-sm">

<i class="fa fa-users"></i>
Participantes

</a>

</td>

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
