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

/* =========================
JSONP CALLBACK
========================= */

const callbackName =
"login_callback_" + Date.now();

window[callbackName] = function(response){

ocultarLoader();

try{

if(response.status){

/* =========================
GUARDAR SESION
========================= */

localStorage.setItem(

"user",

JSON.stringify(
response.user
)

);

/* =========================
REDIRECT
========================= */

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

/* =========================
LIMPIAR CALLBACK
========================= */

delete window[callbackName];

script.remove();

};

/* =========================
SCRIPT JSONP
========================= */

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
id="loader">

<div class="loader"></div>

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
