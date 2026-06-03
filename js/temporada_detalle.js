const params =
new URLSearchParams(
window.location.search
);

const idTemporada =
params.get("id");

function cargarSesiones(){

const callback =
"sesiones_" + Date.now();

const script =
document.createElement("script");

window[callback] = function(result){

const tbody =
document.getElementById(
"tablaSesiones"
);

tbody.innerHTML = "";

if(!result.status){

tbody.innerHTML = `

<tr>
<td colspan="4">
Error cargando sesiones
</td>
</tr>

`;

return;

}

const sesiones =
result.data || [];

if(sesiones.length === 0){

tbody.innerHTML = `

<tr>
<td colspan="4">
No existen sesiones
</td>
</tr>

`;

return;

}

sesiones.forEach(s=>{

tbody.innerHTML += `

<tr>

<td>${s[2]}</td>

<td>${s[3]}</td>

<td>

<span class="badge bg-success">

${s[4]}

</span>

</td>

<td>

<button
class="btn btn-primary btn-sm">

Ver

</button>

</td>

</tr>

`;

});

delete window[callback];

script.remove();

};

script.src =

`${API_URL}?action=getSesionesTemporada`
+
`&callback=${callback}`
+
`&idTemporada=${idTemporada}`;

document.body.appendChild(script);

}

document.addEventListener(
"DOMContentLoaded",
function(){

cargarSesiones();

}
);
