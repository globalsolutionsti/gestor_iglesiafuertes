const params =
new URLSearchParams(
window.location.search
);

const idPersona =
params.get("idPersona");

const idTemporada =
params.get("idTemporada");

document.addEventListener(
"DOMContentLoaded",
cargarHistorial
);

function cargarHistorial(){

const callback =
"historial_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){
console.log(result);
console.table(result.historial);
 
if(!result.status){

document.getElementById(
"tablaHistorial"
).innerHTML =

`
<tr>
<td colspan="2">

${result.message}

</td>
</tr>
`;
return;

}

document.getElementById(
"infoParticipante"
).innerHTML =

`

<div class="card shadow-sm">

<div class="card-body">

<h4>

${result.nombre}

</h4>

<hr>

<div class="row text-center">

<div class="col">

<h3>

${result.asistencias}

</h3>

<div>

Asistencias

</div>

</div>

<div class="col">

<h3>

${result.totalSesiones}

</h3>

<div>

Sesiones

</div>

</div>

<div class="col">

<h3>

${result.porcentaje}%

</h3>

<div>

Cumplimiento

</div>

</div>

</div>

<br>

<div class="progress">

<div

class="progress-bar
${result.porcentaje >= 80
? 'bg-success'
: result.porcentaje >= 60
? 'bg-warning'
: 'bg-danger'}"

style="width:${result.porcentaje}%">

${result.porcentaje}%

</div>

</div>

</div>

</div>

`;

let html = "";

if(result.historial.length === 0){

html =

`
<tr>

<td colspan="4" class="text-center">

No existen asistencias registradas

</td>

</tr>
`;

}
else{

result.historial.forEach(h=>{

html +=

`
<tr>

<td>

${h.sesion}

</td>

<td>

${h.fecha
? formatearFecha(h.fecha)
: "-"}

</td>

<td>

${h.asistio

? '<span class="badge bg-success">PRESENTE</span>'

: '<span class="badge bg-danger">AUSENTE</span>'

}

</td>

<td>

${h.fechaRegistro
? formatearFechaHora(h.fechaRegistro)
: "-"}

</td>

</tr>
`;

});
}

 html +=

`

<tr class="table-light">

<td colspan="4">

<b>

Total de registros:

${result.historial.length}

</b>

</td>

</tr>

`; 
  
document.getElementById(
"tablaHistorial"
).innerHTML =
html;

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getHistorialParticipante`
+
`&callback=${callback}`
+
`&idPersona=${idPersona}`
+
`&idTemporada=${idTemporada}`;

document.body.appendChild(script);

}


function formatearFecha(fechaISO){

const fecha =
new Date(fechaISO);

const dia =
String(fecha.getDate()).padStart(2,'0');

const mes =
String(fecha.getMonth()+1).padStart(2,'0');

const anio =
fecha.getFullYear();

return `${dia}/${mes}/${anio}`;

}

function formatearFechaHora(fechaISO){

const fecha =
new Date(fechaISO);

const dia =
String(fecha.getDate()).padStart(2,'0');

const mes =
String(fecha.getMonth()+1).padStart(2,'0');

const anio =
fecha.getFullYear();

const hora =
String(fecha.getHours()).padStart(2,'0');

const minuto =
String(fecha.getMinutes()).padStart(2,'0');

return `${dia}/${mes}/${anio} ${hora}:${minuto}`;

}
