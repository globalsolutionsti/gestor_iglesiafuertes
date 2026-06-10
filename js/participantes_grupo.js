const params =
new URLSearchParams(
window.location.search
);

const idTemporada =
params.get("idTemporada");

const idSesion =
params.get("idSesion");

const idGrupo =
params.get("idGrupo");
let participantesCache = [];

document.addEventListener(
"DOMContentLoaded",
function(){

cargarInformacionGrupo();

cargarParticipantes();

}
);

function cargarInformacionGrupo(){

const callback =
"infoGrupo_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(result.status){

document.getElementById(
"infoGrupo"
).innerHTML =

`
<div class="alert alert-info">

<b>Temporada:</b>
${result.temporada}

<br>

<b>Sesión:</b>
${result.sesion}

<br>

<b>Grupo:</b>
${result.grupo}

</div>
`;

}

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getInfoGrupo`
+
`&callback=${callback}`
+
`&idTemporada=${idTemporada}`
+
`&idSesion=${idSesion}`
+
`&idGrupo=${idGrupo}`;

document.body.appendChild(script);

}

function cargarParticipantes(){

const callback =
"participantes_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

const tbody =
document.getElementById(
"tablaParticipantes"
);

tbody.innerHTML = "";

if(!result.status){

tbody.innerHTML =

`
<tr>
<td colspan="4">

Error cargando participantes

</td>
</tr>
`;

return;

}

const participantes =
result.data || [];

participantesCache =
participantes;

if(participantes.length === 0){

tbody.innerHTML =

`
<tr>
<td colspan="4">

Sin participantes registrados

</td>
</tr>
`;

return;

}

participantes.forEach(p=>{

tbody.innerHTML +=

`

<tr>

<td>

${p[6]}

</td>

<td>

${p[4]}

</td>

<td>

${p[7]}

</td>

<td>

<button
class="btn btn-info btn-sm me-1"
onclick="verPerfil('${p[5]}')"
title="Ver Perfil">

<i class="fa fa-user"></i>

</button>

<button
class="btn btn-secondary btn-sm me-1"
onclick="verHistorial('${p[5]}')"
title="Historial">

<i class="fa fa-chart-column"></i>

</button>


<button
class="btn btn-success btn-sm me-1"
onclick="capturarAsistencia('${p[0]}')"
title="Asistencia">

<i class="fa fa-clipboard-check"></i>

</button>

<button
class="btn btn-warning btn-sm me-1"
onclick="cambiarGrupo('${p[0]}')"
title="Cambiar Grupo">

<i class="fa fa-arrows-rotate"></i>

</button>

<button
class="btn btn-dark btn-sm me-1"
onclick="mostrarQR(
'${p[5]}',
'${p[6]}',
'${p[4]}',
'${idGrupo}'
)"
title="Código QR">

<i class="fa fa-qrcode"></i>

</button>

<button
class="btn btn-danger btn-sm"
onclick="darBajaParticipante('${p[0]}')"
title="Dar Baja">

<i class="fa fa-user-slash"></i>

</button>

</td>

</tr>

`;

});

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getParticipantesGrupo`
+
`&callback=${callback}`
+
`&idTemporada=${idTemporada}`
+
`&idSesion=${idSesion}`
+
`&idGrupo=${idGrupo}`;

document.body.appendChild(script);

}

function abrirModalParticipante(){

const callback =
"personas_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(!result.status){

Swal.fire(
"Error",
"Cargando personas",
"error"
);

return;

}

let opciones = "";

result.data.forEach(p=>{

opciones +=

`

<option
value="${p.id}"
data-tipo="${p.tipo}"
data-nombre="${p.nombre}">

${p.nombre}
(${p.tipo})

</option>

`;

});

Swal.fire({

title:
"Agregar Participante",

html:

`

<select
id="personaSeleccionada"
class="form-select">

${opciones}

</select>

`,

showCancelButton:true,

confirmButtonText:
"Agregar"

}).then(r=>{

if(!r.isConfirmed){
return;
}

const select =
document.getElementById(
"personaSeleccionada"
);

const option =
select.options[
select.selectedIndex
];

guardarParticipante(

option.value,

option.dataset.nombre,

option.dataset.tipo

);

});

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getPersonas`
+
`&callback=${callback}`;

document.body.appendChild(script);

}

function guardarParticipante(
idPersona,
nombre,
tipo
){

const callback =
"guardar_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(result.status){

Swal.fire({

icon:"success",
title:"Participante agregado"

});

cargarParticipantes();

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

`${API_URL}?action=guardarParticipanteGrupo`
+
`&callback=${callback}`
+
`&idTemporada=${idTemporada}`
+
`&idSesion=${idSesion}`
+
`&idGrupo=${idGrupo}`
+
`&idPersona=${idPersona}`
+
`&nombre=${encodeURIComponent(nombre)}`
+
`&tipo=${tipo}`;

document.body.appendChild(script);

}

function verPerfil(idPersona){

Swal.fire({

icon:"info",

title:
"Próximamente",

text:
"Ver perfil del participante"

});

}

function cambiarGrupo(idParticipante){

const callback =
"grupos_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(!result.status){

Swal.fire({
icon:"error",
title:"Error obteniendo grupos"
});

return;

}

const grupos =
result.data || [];

let opciones = "";

grupos.forEach(g=>{

opciones +=
`<option value="${g[3]}">
${g[4]}
</option>`;

});

Swal.fire({

title:"Cambiar Grupo",

html:

`<select
id="nuevoGrupo"
class="form-select">

${opciones}

</select>`,

showCancelButton:true,

confirmButtonText:
"Cambiar"

}).then(res=>{

if(!res.isConfirmed){
return;
}

guardarCambioGrupo(
idParticipante,
document.getElementById(
"nuevoGrupo"
).value
);

});

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getGruposTemporada`
+
`&callback=${callback}`
+
`&idTemporada=${idTemporada}`;

document.body.appendChild(script);

}

function guardarCambioGrupo(
idParticipante,
idGrupo
){

const callback =
"cambio_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(result.status){

Swal.fire({

icon:"success",
title:"Grupo actualizado"

});

cargarParticipantes();

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

`${API_URL}?action=cambiarGrupoParticipante`
+
`&callback=${callback}`
+
`&idParticipante=${idParticipante}`
+
`&idGrupo=${idGrupo}`;

document.body.appendChild(script);

}

function darBajaParticipante(idParticipante){

Swal.fire({

title:"¿Dar de baja participante?",

text:
"El participante dejará de pertenecer al grupo",

icon:"warning",

showCancelButton:true,

confirmButtonText:"Dar de Baja",

cancelButtonText:"Cancelar"

}).then(result=>{

if(!result.isConfirmed){
return;
}

const callback =
"baja_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(resp){

if(resp.status){

Swal.fire({

icon:"success",

title:
"Participante dado de baja"

});

cargarParticipantes();

}else{

Swal.fire({

icon:"error",

title:
resp.message

});

}

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=darBajaParticipante`
+
`&callback=${callback}`
+
`&idParticipante=${idParticipante}`;

document.body.appendChild(script);

});

}


function verPerfil(idPersona){

window.location.href =

`perfil.html?id=${idPersona}`;

}

function capturarAsistencia(idParticipante){

Swal.fire({

icon:"info",
title:"Módulo de asistencia en construcción",
text:"Participante: " + idParticipante

});

}

function abrirAsistenciaGrupo(){

window.location.href =

"asistencia_grupo.html"
+
"?idTemporada=" + idTemporada
+
"&idSesion=" + idSesion
+
"&idGrupo=" + idGrupo;

}

function mostrarQR(
idPersona,
nombre,
tipo="PARTICIPANTE",
grupo=""
){

const contenidoQR =
`PERSONA:${idPersona}`;

const urlQR =

`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(contenidoQR)}`;

Swal.fire({

title:"Credencial Digital",

width:700,

html:`

<div
id="credencialWhatsapp"
style="
width:540px;
height:675px;
margin:auto;
background:white;
border-radius:25px;
padding:30px;
box-shadow:0 0 15px rgba(0,0,0,.2);
text-align:center;
">

<div
style="
margin-bottom:20px;
">

<img
src="img/logo_conexion.png"
style="
max-width:320px;
width:100%;
height:auto;
">

</div>

<div
style="
font-size:20px;
color:#666;
margin-bottom:25px;
">

Credencial Digital

</div>

<img
src="${urlQR}"
style="
width:350px;
height:350px;
">

<br><br>

<h2
style="
font-weight:bold;
">

${nombre}

</h2>

<div
style="
font-size:20px;
color:#555;
">

${tipo}

</div>

<br>

<div>

<b>ID:</b>

${idPersona}

</div>

<br>

<div
style="
font-size:18px;
color:#777;
">

Presenta este código
para registrar asistencia

</div>

</div>

<br>

<button
class="btn btn-success"
onclick="descargarCredencialPNG(
'${idPersona}'
)">

<i class="fa fa-download"></i>

Descargar Credencial

</button>

`

});

}

function descargarCredencial(
idPersona,
nombre,
tipo
){

const contenidoQR =
`PERSONA:${idPersona}`;

const urlQR =

`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(contenidoQR)}`;

const ventana =
window.open("","_blank");

ventana.document.write(`

<html>

<head>

<title>${nombre}</title>

<style>

body{

font-family:Arial;
text-align:center;
padding:20px;

}

.credencial{

border:2px solid #0d6efd;
border-radius:20px;
padding:20px;
max-width:450px;
margin:auto;

}

.logo{

font-size:24px;
font-weight:bold;
margin-bottom:15px;

}

.qr{

width:180px;

}

.nombre{

font-size:22px;
font-weight:bold;

}

.tipo{

font-size:18px;
color:#666;

}

</style>

</head>

<body>

<div class="credencial">

<div class="logo">

GRUPOS DE CONEXIÓN

</div>

<img
src="${urlQR}"
class="qr">

<br><br>

<div class="nombre">

${nombre}

</div>

<div class="tipo">

${tipo}

</div>

<br>

<b>ID:</b>

${idPersona}

</div>

<script>

window.onload=function(){

window.print();

}

</script>

</body>

</html>

`);

}

function descargarCredencialPNG(idPersona){

const credencial =
document.getElementById(
"credencialWhatsapp"
);

html2canvas(
credencial,
{
scale:3,
useCORS:true,
allowTaint:true
}
)
.then(canvas=>{

const link =
document.createElement("a");

link.download =
`Credencial_${idPersona}.png`;

link.href =
canvas.toDataURL(
"image/png"
);

link.click();

});

}
async function descargarCredencialesGrupo(){

if(participantesCache.length === 0){

Swal.fire(
"Sin datos",
"No existen participantes",
"warning"
);

return;

}

const confirmar =
await Swal.fire({

title:
"Descargar credenciales",

text:
"Se descargarán todas las credenciales del grupo",

icon:"question",

showCancelButton:true,

confirmButtonText:
"Descargar"

});

if(!confirmar.isConfirmed){
return;
}

for(let i=0;i<participantesCache.length;i++){

const p =
participantesCache[i];

await generarCredencialMasiva(

p[5], // idPersona
p[6], // nombre
p[4]  // tipo

);

await esperar(1000);

}

Swal.fire({

icon:"success",

title:
"Proceso terminado"

});

}


function esperar(ms){

return new Promise(resolve=>{

setTimeout(
resolve,
ms
);

});

}

async function generarCredencialMasiva(

idPersona,
nombre,
tipo

){

const contenidoQR =
`PERSONA:${idPersona}`;

const qrURL =

`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(contenidoQR)}`;

const contenedor =
document.createElement("div");

contenedor.style.width =
"540px";

contenedor.style.height =
"675px";

contenedor.style.background =
"white";

contenedor.style.padding =
"30px";

contenedor.style.position =
"fixed";

contenedor.style.left =
"-9999px";

contenedor.innerHTML =

`

<div style="text-align:center;">

<div style="margin-bottom:20px;">

<img
src="img/logo_conexion.png"
style="
max-width:320px;
width:100%;
height:auto;
">

</div>

<p>

Credencial Digital

</p>

<img
src="${qrURL}"
style="width:220px;height:220px;">

<br><br>

<h3>

${nombre}

</h3>

<div>

${tipo}

</div>

<br>

<div>

${idPersona}

</div>

</div>

`;

document.body.appendChild(
contenedor
);

await new Promise(resolve=>{

setTimeout(
resolve,
1500
);

});

const canvas =
await html2canvas(

contenedor,

{
scale:3,
useCORS:true
}

);

const link =
document.createElement("a");

link.download =

`${nombre}.png`;

link.href =
canvas.toDataURL(
"image/png"
);

link.click();

document.body.removeChild(
contenedor
);

}
