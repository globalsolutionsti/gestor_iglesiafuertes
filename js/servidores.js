let tabla = null;
let fotoBase64 = "";

/* =====================================================
CARGAR MINISTERIOS
===================================================== */
async function cargarMinisterios(){
  try{
    const response = await fetch(`${API_URL}?action=getMinisterios`);
    const result = await response.json();
    if(!result.status) return;

    const selects = ["ministerioPrincipal","ministerioSec1","ministerioSec2","ministerioSec3"];
    selects.forEach(id=>{
      const select = document.getElementById(id);
      if(!select) return;
      select.innerHTML = `<option value="">Seleccione</option>`;
      result.data.forEach(min=>{
        select.innerHTML += `<option value="${min.nombre}">${min.nombre}</option>`;
      });
    });

  }catch(error){console.error(error);}
}

/* =====================================================
CARGAR SERVIDORES
===================================================== */
async function cargarServidores(){
  mostrarLoader();
  const callbackName = "servidores_callback_" + Date.now();
  window[callbackName] = async function(result){
    try{
      if(!result.status){ocultarLoader();Swal.fire({icon:"error",title:result.message});return;}
      const data = result.data || [];
      let html = "";
      for(let i=1;i<data.length;i++){
        const s = data[i];
        html += `
<tr>
<td><img src="${s[13]||'https://i.pravatar.cc/150'}" class="rounded-circle" style="width:50px;height:50px;object-fit:cover;border:2px solid #0d6efd;"></td>
<td><a href="perfil.html?id=${s[0]}" class="fw-bold text-decoration-none">${s[2]} ${s[3]}</a></td>
<td>${s[6]||''}</td>
<td>${s[10]||''}</td>
<td><span class="badge bg-success">${s[12]||'ACTIVO'}</span></td>
<td>
<button class="btn btn-primary btn-sm"><i class="fa fa-edit"></i></button>
<button class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
</td>
</tr>`;
      }

      if($.fn.DataTable.isDataTable('#tabla')) $('#tabla').DataTable().destroy();
      document.getElementById("tablaServidores").innerHTML = html;
      tabla = $('#tabla').DataTable({responsive:true,pageLength:10,destroy:true,language:{url:"https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"}});
      ocultarLoader();
      delete window[callbackName]; script.remove();
    }catch(error){ocultarLoader(); console.error(error); Swal.fire({icon:"error",title:error.toString()});}
  };
  const script = document.createElement("script");
  script.src = `${API_URL}?action=getServidores&callback=${callbackName}`;
  script.onerror = ()=>{ocultarLoader();Swal.fire({icon:"error",title:"Error conexión Apps Script"});};
  document.body.appendChild(script);
}

/* =====================================================
GUARDAR SERVIDOR
===================================================== */
async function guardarServidor(){
  mostrarLoader();
  const body = {
    numeroServidor:document.getElementById("numeroServidor").value,
    nombre:document.getElementById("nombre").value,
    apellidos:document.getElementById("apellidos").value,
    telefono:document.getElementById("telefono").value,
    email:document.getElementById("email").value,
    ministerioPrincipal:document.getElementById("ministerioPrincipal").value,
    ministerioSec1:document.getElementById("ministerioSec1").value,
    ministerioSec2:document.getElementById("ministerioSec2").value,
    ministerioSec3:document.getElementById("ministerioSec3").value,
    grupoConexion:document.getElementById("grupoConexion").value,
    fechaIngreso:document.getElementById("fechaIngreso").value,
    foto:fotoBase64
  };
  try{
    const response = await fetch(`${API_URL}?action=guardarServidor`,{method:"POST",body:JSON.stringify(body)});
    const data = await response.json();
    ocultarLoader();
    if(data.status){
      Swal.fire({icon:"success",title:"Servidor guardado correctamente"});
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalServidor"));
      if(modal) modal.hide();
      limpiarFormulario();
      setTimeout(()=>{cargarServidores();},500);
    } else {Swal.fire({icon:"error",title:data.message});}
  }catch(error){ocultarLoader();Swal.fire({icon:"error",title:error.toString()});}
}

/* =====================================================
LIMPIAR FORMULARIO
===================================================== */
function limpiarFormulario(){
  const campos = ["numeroServidor","nombre","apellidos","telefono","email","ministerioPrincipal","ministerioSec1","ministerioSec2","ministerioSec3","grupoConexion","fechaIngreso"];
  campos.forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.value="";
  });
  fotoBase64="";
  const preview = document.getElementById("previewFoto");
  if(preview){preview.style.display="none"; preview.src="";}
  const video = document.getElementById("camera");
  if(video && video.srcObject){video.srcObject.getTracks().forEach(track=>track.stop()); video.srcObject=null;}
}

/* =====================================================
CAMARA
===================================================== */
async function activarCamara(){try{const video=document.getElementById("camera");const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false});video.srcObject=stream;}catch(error){Swal.fire({icon:"error",title:"No se pudo activar cámara"});}}
function tomarFoto(){const video=document.getElementById("camera");const canvas=document.getElementById("canvas");const preview=document.getElementById("previewFoto");canvas.width=video.videoWidth;canvas.height=video.videoHeight;const ctx=canvas.getContext("2d");ctx.drawImage(video,0,0);fotoBase64=canvas.toDataURL("image/jpeg",0.8);preview.src=fotoBase64;preview.style.display="block";}

/* =====================================================
INIT
===================================================== */
document.addEventListener("DOMContentLoaded",function(){cargarMinisterios();cargarServidores();});
