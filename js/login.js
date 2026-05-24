document.getElementById("loginForm")
.addEventListener("submit", async(e)=>{

e.preventDefault();

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const response = await fetch(
`${API_URL}?action=login&email=${email}&password=${password}`
);

const data = await response.json();

if(data.status){

localStorage.setItem("user", JSON.stringify(data.user));

window.location = "dashboard.html";

}else{

alert(data.message);

}

});
