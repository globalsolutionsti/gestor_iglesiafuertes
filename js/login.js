document.getElementById("loginForm")
.addEventListener("submit", async(e)=>{

e.preventDefault();

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

mostrarLoader();

try{

const response = await fetch(

`${API_URL}?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,

{
method:"GET",
mode:"cors"
}

);

const data = await response.json();

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

}catch(error){

ocultarLoader();

console.error(error);

Swal.fire({

icon:"error",
title:"Error Apps Script",
text:"Revisa permisos de implementación"

});

}

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
