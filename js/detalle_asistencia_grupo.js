const params =
new URLSearchParams(
window.location.search
);

const idTemporada =
params.get("idTemporada");

const idGrupo =
params.get("idGrupo");

document.addEventListener(
"DOMContentLoaded",
function(){

cargarDetalle();

}
);

function cargarDetalle(){

const callback =
"detalle_" +
Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

if(!result.status){

alert(
result.message
);

return;

}

/* ======================
ENCABEZADOS
====================== */

/* ======================
ENCABEZADOS
====================== */

let thead =
`
<tr>

<th>
Participante
</th>
`;

result.sesiones.forEach(s=>{

thead +=
`
<th class="text-center">

${s}

</th>
`;

});

thead +=
`
<th class="text-center">

Total

</th>

<th class="text-center">

%

</th>

</tr>
`;

document.getElementById(
"theadDetalle"
).innerHTML =
thead;

/* ======================
FILAS
====================== */

let tbody = "";

for(let nombre in result.personas){

const persona =
result.personas[nombre];

tbody +=
`<tr>`;

tbody +=
`
<td>

${nombre}

</td>
`;

result.sesiones.forEach(s=>{

const valor =
persona.asistencias[s];

tbody +=
`
<td class="text-center">

${valor=="SI"
? "✅"
: "❌"}

</td>
`;

});

const total =
persona.total;

const porcentaje =
Math.round(
(total /
result.totalSesiones)
*100
);

tbody +=
`
<td class="text-center">

${total}

</td>

<td class="text-center">

${porcentaje}%

</td>
`;

tbody +=
`</tr>`;

});

document.getElementById(
"tbodyDetalle"
).innerHTML =
tbody;

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getDetalleAsistenciaGrupo`
+
`&callback=${callback}`
+
`&idTemporada=${idTemporada}`
+
`&idGrupo=${idGrupo}`;

document.body.appendChild(script);

}
