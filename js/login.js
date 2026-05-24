document.getElementById("loginForm")
.addEventListener("submit",(e)=>{

e.preventDefault();

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

mostrarLoader();

const callbackName =
"jsonp_callback_" + Date.now();

window[callbackName] = function(data){

ocultarLoader();

if(data.status){

localStorage.setItem(
"user",
JSON.stringify(data.user)
);

Swal.fire({

icon:"success",
title:"Bienvenido"

}).then(()=>{

window.location.href =
"dashboard.html";

});

}else{

Swal.fire({

icon:"error",
title:data.message

});

}

document.body.removeChild(script);

delete window[callbackName];

};

const script =
document.createElement("script");

script.src =

`${API_URL}?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&callback=${callbackName}`;

document.body.appendChild(script);

});

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
