const form =
document.getElementById("loginForm");

form.addEventListener(

"submit",

function(e){

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

/* =====================================================
CALLBACK JSONP
===================================================== */

const callbackName =
"login_callback_" + Date.now();

/* =====================================================
FUNCIÓN GLOBAL
===================================================== */

window[callbackName] = function(response){

ocultarLoader();

try{

if(response.status){

localStorage.setItem(

"user",

JSON.stringify(
response.user
)

);

window.location.href =
"dashboard.html";

}else{

Swal.fire({

icon:"error",
title:response.message

});

}

}catch(error){

Swal.fire({

icon:"error",
title:error.toString()

});

}

/* =====================================================
LIMPIAR
===================================================== */

try{

delete window[callbackName];

script.remove();

}catch(e){}

};

/* =====================================================
SCRIPT JSONP
===================================================== */

const script =
document.createElement("script");

script.src =

`${API_URL}?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&callback=${callbackName}`;

script.onerror = function(){

ocultarLoader();

Swal.fire({

icon:"error",
title:"Error conexión Apps Script"

});

};

document.body.appendChild(script);

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

<div class="loader-overlay"
id="loader"
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
">

</div>

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
