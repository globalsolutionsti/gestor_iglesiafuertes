async function loadDashboard(){

mostrarLoader();

const response = await fetch(
`${API_URL}?action=estadisticas`
);

const data = await response.json();

document.getElementById("totalServidores")
.innerText = data.totalServidores;

const ctx = document.getElementById('chart');

new Chart(ctx, {

type:'bar',

data:{

labels:[
'Servidores',
'Eventos',
'Asistencias'
],

datasets:[{

label:'Sistema',

data:[
data.totalServidores,
data.totalEventos,
data.totalAsistencias
],

borderWidth:2

}]

}

});

ocultarLoader();

}

loadDashboard();
