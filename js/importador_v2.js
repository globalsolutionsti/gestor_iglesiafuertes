/*=========================================
IMPORTADOR V2
=========================================*/

function abrirImportadorV2(){

    Swal.fire({

        title:"Importador Profesional V2",

        width:1400,

        html:`

        <div class="container-fluid">

            <div class="row mb-3">

                <div class="col-md-12">

                    <div
                    class="alert alert-primary">

                        <h4>

                            Importación de Asistentes

                        </h4>

                        Seleccione un archivo Excel para comenzar.

                    </div>

                </div>

            </div>

            <div class="row">

                <div class="col-md-12">

                    <input

                        type="file"

                        id="archivoImportacionV2"

                        class="form-control"

                        accept=".xlsx,.xls"

                    >

                </div>

            </div>

            <hr>

            <div
            id="panelVistaPreviaV2">

                <div
                class="alert alert-secondary">

                    Aún no se ha cargado ningún archivo.

                </div>

            </div>

        </div>

        `,

        showCancelButton:true,

        confirmButtonText:

        "Leer Archivo",

        cancelButtonText:

        "Cerrar",

        preConfirm:()=>{

            const archivo =

            document.getElementById(
                "archivoImportacionV2"
            ).files[0];

            if(!archivo){

                Swal.showValidationMessage(

                    "Seleccione un archivo."

                );

                return false;

            }

            leerArchivoImportadorV2(
                archivo
            );

            return false;

        }

    });

}


function leerArchivoImportadorV2(archivo){

    console.log(

        "Archivo seleccionado:",

        archivo.name

    );

    Swal.fire({

        icon:"success",

        title:"Archivo recibido",

        html:`

        ${archivo.name}

        <br><br>

        Esta es la primera prueba del Importador V2.

        `

    });

}
