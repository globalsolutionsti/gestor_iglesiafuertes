/* =====================================================
CARGAR CATALOGO GRUPOS
===================================================== */

function cargarGrupos(){

const callbackName =
"grupos_" + Date.now();

const script =
document.createElement("script");

window[callbackName] = function(result){

try{

const select =
document.getElementById("grupo");

if(!select){
return;
}

select.innerHTML = "";

if(!result || !result.status){

select.innerHTML =
"<option>Error cargando grupos</option>";

return;

}

const grupos =
result.data || [];

grupos.forEach(g=>{

select.innerHTML += `

<option value="${g}">
${g}
</option>

`;

});

}catch(error){

console.error(error);

}

delete window[callbackName];

if(script){
script.remove();
}

};

script.src =
`${API_URL}?action=getCatalogoGrupos&callback=${callbackName}`;

document.body.appendChild(script);

}

/* =====================================================
CARGAR TEMPORADAS
===================================================== */

function cargarTemporadas(){

const callbackName =
"temporadas_" + Date.now();

const script =
document.createElement("script");

window[callbackName] = function(result){

const tbody =
document.getElementById("tablaTemporadas");

if(!tbody){
return;
}

tbody.innerHTML = "";

if(!result || !result.status){

tbody.innerHTML = `

<tr>
<td colspan="5">
Error cargando temporadas
</td>
</tr>

`;

return;

}

const data =
result.data || [];

if(data.length <= 1){

tbody.innerHTML = `

<tr>
<td colspan="5">
No existen temporadas
</td>
</tr>

`;

return;

}

for(let i=1;i<data.length;i++){

const row = data[i];

tbody.innerHTML += `

<tr>

<td>${row[0]}</td>
<td>${row[1]}</td>
<td>${row[2]}</td>
<td>${row[3]}</td>

<td>

<span class="badge bg-success">
Activa
</span>

</td>

</tr>

`;

}

};

script.src =
`${API_URL}?action=getTemporadas&callback=${callbackName}`;

document.body.appendChild(script);

}

/* =====================================================
GUARDAR TEMPORADA
===================================================== */

function guardarTemporada(){

const temporada =
document.getElementById("temporada").value;

const anio =
document.getElementById("anio").value;

const grupo =
document.getElementById("grupo").value;

const callbackName =
"guardar_" + Date.now();

const script =
document.createElement("script");

window[callbackName] = function(result){

if(result.status){

Swal.fire({

icon:"success",
title:"Temporada guardada"

});

cargarTemporadas();

const modal =
bootstrap.Modal.getInstance(
document.getElementById("modalTemporada")
);

if(modal){
modal.hide();
}

}else{

Swal.fire({

icon:"error",
title:result.message

});

}

};

script.src =

`${API_URL}?action=guardarTemporada&callback=${callbackName}&temporada=${encodeURIComponent(temporada)}&anio=${encodeURIComponent(anio)}&grupo=${encodeURIComponent(grupo)}&sesiones=[]`;

document.body.appendChild(script);

}

/* =====================================================
MENU MOVIL
===================================================== */

function toggleSidebar(){

const sidebar =
document.querySelector(".sidebar");

const overlay =
document.getElementById("sidebarOverlay");

if(sidebar){
sidebar.classList.toggle("active");
}

if(overlay){
overlay.classList.toggle("active");
}

}

/* =====================================================
INIT
===================================================== */

document.addEventListener(
"DOMContentLoaded",
function(){

cargarGrupos();
cargarTemporadas();

}
);
