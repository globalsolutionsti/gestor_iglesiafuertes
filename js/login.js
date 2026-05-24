document.getElementById("loginForm")
.addEventListener("submit", async(e)=>{

e.preventDefault();

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

try{

const response = await fetch(

`${API_URL}?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,

{
method:"GET"
}

);

const data = await response.json();

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

console.error(error);

Swal.fire({

icon:"error",
title:"Error conexión Apps Script"

});

}

});
