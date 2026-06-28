const zona =
document.getElementById("dropZone");

const archivo =
document.getElementById("archivoExcel");

zona.addEventListener(

"dragover",

e=>{

e.preventDefault();

zona.classList.add(
"dragover"
);

}

);

zona.addEventListener(

"dragleave",

()=>{

zona.classList.remove(
"dragover"
);

}

);

zona.addEventListener(

"drop",

e=>{

e.preventDefault();

zona.classList.remove(
"dragover"
);

archivo.files =
e.dataTransfer.files;

leerArchivo();

}

);

archivo.addEventListener(

"change",

leerArchivo

);

function leerArchivo(){

const file =
archivo.files[0];

if(!file){
return;
}

document.getElementById(
"archivoSeleccionado"
).innerHTML =

"<b>Archivo:</b> " +
file.name;

animarBarra();

}

function animarBarra(){

let porcentaje = 0;

const barra =
document.getElementById(
"barraImportacion"
);

const timer =
setInterval(()=>{

porcentaje += 5;

barra.style.width =
porcentaje+"%";

barra.innerHTML =
porcentaje+"%";

if(porcentaje>=100){

clearInterval(timer);

}

},40);

}
