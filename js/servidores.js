let tabla;

async function cargarServidores(){

mostrarLoader();

const callbackName =
"jsonp_callback_" + Date.now();

window[callbackName] = function(response){

let html = "";

const data = response.data;

for(let i=1;i<data.length;i++){

const s = data[i];

html += `

<tr>

<td>

<img src="${
s[13] || 'https://i.pravatar.cc/50'
}"

class="avatar">

</td>

<td>

<a href="perfil.html?numero=${s[1]}"
class="perfil-link">

${s[2]} ${s[3]}

</a>

</td>

<td>${s[9]}</td>

<td>${s[10]}</td>

<td>

<span class="badge bg-success">
${s[12]}
</span>

</td>

<td>

<button class="btn btn-primary btn-sm">

<i class="fa fa-edit"></i>

</button>

<button class="btn btn-danger btn-sm">

<i class="fa fa-trash"></i>

</button>

</td>

</tr>

`;

}

document.getElementById(
"tablaServidores"
).innerHTML = html;

if(tabla){

tabla.destroy();

}

tabla = $('#tabla').DataTable();

ocultarLoader();

document.body.removeChild(script);

delete window[callbackName];

};

const script =
document.createElement("script");

script.src =

`${API_URL}?action=getServidores&callback=${callbackName}`;

document.body.appendChild(script);

}

cargarServidores();

function mostrarLoader(){

document.body.insertAdjacentHTML(

"beforeend",

`

<div class="loader-overlay"
id="loader">

<div class="loader"></div>

</div>

`

);

}

function ocultarLoader(){

const loader =
document.getElementById("loader");

if(loader){

loader.remove();

}

}
