async function loadDashboard(){

const response = await fetch(
`${API_URL}?action=getServidores`
);

const data = await response.json();

document.getElementById("totalServidores")
.innerText = data.data.length - 1;

const ctx = document.getElementById('chart');

new Chart(ctx, {
type: 'line',
data: {
labels: ['Lun','Mar','Mie','Jue','Vie'],
datasets: [{
label: 'Asistencias',
data: [12,19,8,15,20],
borderWidth: 3
}]
}
});

}

loadDashboard();
