const params =
new URLSearchParams(
window.location.search
);

const idTemporada =
params.get("idTemporada");

const idGrupo =
params.get("idGrupo");

document.addEventListener(
"DOMContentLoaded",
function(){

console.log(
idTemporada,
idGrupo
);

}
);
