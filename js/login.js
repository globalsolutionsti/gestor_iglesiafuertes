const form =
document.getElementById(
"loginForm"
);

form.addEventListener(

"submit",

async function(e){

e.preventDefault();

mostrarLoader();

const email =
document.getElementById(
"email"
).value;

const password =
document.getElementById(
"password"
).value;

try{

const response =
await fetch(

`${API_URL}?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`

);

const data =
await response.json();

ocultarLoader();

if(data.status){

localStorage.setItem(

"user",
JSON.stringify(data.user)

);

window.location.href =
"dashboard.html";

}else{

Swal.fire({

icon:"error",
title:data.message

});

}

}catch(error){

ocultarLoader();

Swal.fire({

icon:"error",
title:error.toString()

});

}

}

);

/* =====================================================
LOADER
===================================================== */

function mostrarLoader(){

if(document.getElementById("loader")){
return;
}

document.body.insertAdjacentHTML(

"beforeend",

`

<div id="loader"
style="
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(255,255,255,.7);
display:flex;
justify-content:center;
align-items:center;
z-index:99999;
">

<div class="spinner-border text-primary"
style="
width:4rem;
height:4rem;
"></div>

</div>

`

);

}

function ocultarLoader(){

const loader =
document.getElementById(
"loader"
);

if(loader){

loader.remove();

}

}
