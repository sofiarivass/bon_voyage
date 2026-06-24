class Viaje {
    id;
    imagen;
    color;
    pais;
    ciudad;
    ida;
    vuelta;
    presupuesto;
    notas;
    estado;
    dias;

    constructor(imagen, color, pais, ciudad, ida, vuelta, presupuesto, notas, estado) {
        this.id = Date.now();
        this.imagen = imagen;
        this.color = color;
        this.pais = pais;
        this.ciudad = ciudad;
        this.ida = ida;
        this.vuelta = vuelta;
        this.presupuesto = presupuesto;
        this.notas = notas;
        this.estado = estado;
        this.dias = calcularDias(ida, vuelta);
    }
}


let viajes = [];
let viajes_guardados = JSON.parse(localStorage.getItem("viajes"));
let filtro_seleccionado = "todos";
let viaje_seleccionado = null;
let editando = false;
let id = null;
let imagen_actual = "";


// guarda los viajes recuperados en el array principal
if (viajes_guardados) {
    viajes = viajes_guardados;
}


// referencias a elementos del dom
let titulo_modal = document.getElementById("modal-form-label");
let form_modal = document.getElementById("form-modal");
let contenedor = document.getElementById("viajes-container");
let vista_previa = document.getElementById("vista-previa");
let modal_detalles = document.getElementById("modal-detalle-body");
let filtro = document.getElementById("form-filtros");


// click en botón nuevo viaje
document.getElementById('btn-nuevo-viaje').addEventListener('click', function() {
    editando = false;
    titulo_modal.innerText = "Crear viaje";
    form_modal.reset();
    imagen_actual = "https://placehold.net/default.svg";

    actualizarPreview();
});


// actualizar preview en tiempo real
document.getElementById("color").addEventListener("input", actualizarPreview);
document.getElementById("pais").addEventListener("input", actualizarPreview);


// cargar imagen seleccionada
document.getElementById("imagen-viaje").addEventListener("change", function() {
    let inputImagen = document.getElementById("imagen-viaje");
    let archivo = inputImagen.files[0];
    if (archivo) {
        let reader = new FileReader();
        reader.onload = function(e) {
            imagen_actual = e.target.result;
            actualizarPreview();
        };
        reader.readAsDataURL(archivo);
    }
});


// submit del formulario
form_modal.addEventListener("submit", (event) => {
    // validar fechas
    let fecha_ida = fechaLocal(document.getElementById("ida").value);
    let fecha_vuelta = fechaLocal(document.getElementById("vuelta").value);
    if (fecha_vuelta < fecha_ida) {
        alert("La fecha de vuelta no puede ser anterior a la fecha de ida");
        event.preventDefault(); // evita que se cierre el modal
        return;
    }

    // validar solapamiento con otros viajes
    for (let i = 0; i < viajes.length; i++) {
        // si estoy editando, ignoro el mismo viaje
        if (editando && viajes[i].id == id) {
            continue;
        }
        let ida_existente = fechaLocal(viajes[i].ida);
        let vuelta_existente = fechaLocal(viajes[i].vuelta);
        // condición de solapamiento
        if (fecha_ida <= vuelta_existente && fecha_vuelta >= ida_existente) {
            alert("Ya tenés un viaje en esas fechas");
            event.preventDefault();
            return;
        }
    }

    // recuperar imagen, convertirla a base64 y guardar el viaje
    let inputImagen = document.getElementById("imagen-viaje");
    let archivo = inputImagen.files[0];
    if (archivo) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let imgURL = e.target.result;
            guardarViaje(imgURL);
        };
        reader.readAsDataURL(archivo);
    } else {
        if (editando) {
            guardarViaje(imagen_actual);
        } else {
            guardarViaje("https://placehold.net/default.svg");
        }
    }
});


// click en botón editar viaje
document.getElementById('btn-editar-viaje').addEventListener('click', function() {
    editando = true;
    titulo_modal.innerText = "Editar viaje";
    id = viaje_seleccionado.id;
    imagen_actual = viaje_seleccionado.imagen;

    document.getElementById("color").value = viaje_seleccionado.color;
    document.getElementById("pais").value = viaje_seleccionado.pais;
    document.getElementById("ciudad").value = viaje_seleccionado.ciudad;
    document.getElementById("ida").value = viaje_seleccionado.ida;
    document.getElementById("vuelta").value = viaje_seleccionado.vuelta;
    document.getElementById("presupuesto").value = viaje_seleccionado.presupuesto;
    document.getElementById("notas").value = viaje_seleccionado.notas;

    actualizarPreview();
});


// click en botón eliminar viaje
document.getElementById('btn-eliminar-viaje').addEventListener('click', function() {
    let confirmar = confirm("¿Seguro que querés eliminar este viaje?");
    if (!confirmar) return;

    // elimina el viaje seleccionado del array
    viajes = viajes.filter(viaje => viaje.id !== viaje_seleccionado.id);
    // guardar cambios
    localStorage.setItem("viajes", JSON.stringify(viajes));
    // cerrar modal
    let modal = bootstrap.Modal.getInstance(document.getElementById('modal-detalles'));
    modal.hide();

    // reconstruir interfaz
    cargarViajes();
});


// filtrar viajes
filtro.addEventListener("input", function() {
    if (document.getElementById("todos").checked) {
        filtro_seleccionado = "todos";
    } else if (document.getElementById("pendientes").checked) {
        filtro_seleccionado = "pendientes";
    } else if (document.getElementById("en_curso").checked) {
        filtro_seleccionado = "en_curso";
    } else if (document.getElementById("completados").checked) {
        filtro_seleccionado = "completados";
    }

    cargarViajes();
});



// actualiza la vista previa del form
function actualizarPreview() {
    let color = document.getElementById("color").value;
    let pais = document.getElementById("pais").value;

    vista_previa.innerHTML = `
        <label class="form-label">Vista previa</label>
        <div class="preview-imagen card-viaje-media"
            style="background-image: url('${imagen_actual}');">
            <span class="placa-viaje" style="background: ${color}">
                ${pais}
            </span>
        </div>
    `;
}


// guardar viaje
function guardarViaje(img) {
    const { color, pais, ciudad, ida, vuelta, presupuesto, notas } = form;
    let estado = "";
    let dias = calcularDias(ida, vuelta);

    // calcular estado del viaje
    let hoy = new Date();
    if (hoy < fechaLocal(ida)) {
        estado = "Pendiente";
    } else if (hoy >= fechaLocal(ida) && hoy <= fechaLocal(vuelta)) {
        estado = "En curso";
    } else {
        estado = "Completado";
    }

    if (!editando) {
        // crear nuevo viaje
        let viaje = new Viaje(
            img,
            color,
            pais,
            ciudad,
            ida,
            vuelta,
            presupuesto,
            notas,
            estado,
            dias
        );

        setViajes([...viajes, viaje]);
    } else {
        // editar viaje
        const viajesActualizados = viajes.map(v => {
            if (v.id == id) {
                return { ...v, imagen: img, color, pais, ciudad, ida, vuelta, presupuesto, notas, estado, dias: calcularDias(ida, vuelta) };
            }
            return v;
        });
        setViajes(viajesActualizados);
    }

    // guardar cambios

    // Si era un viaje nuevo, usás la variable correspondiente.
    localStorage.setItem("viajes", JSON.stringify(viajesActualizados)); 
    // NOTA: Borrás por completo la línea 'cargarViajes();
}


// renderiza las cards de los viajes
const viajesFiltrados = viajes
    .filter(viaje => {
        if (filtroSeleccionado === "todos") return true;
        if (filtroSeleccionado === "pendientes") return viaje.estado === "Pendiente";
        if (filtroSeleccionado === "en_curso") return viaje.estado === "En curso";
        if (filtroSeleccionado === "completados") return viaje.estado === "Completado";
        return true;
    })
    .sort((a, b) => fechaLocal(a.ida) - fechaLocal(b.ida));


// actualizar estados automáticamente
function actualizarEstados() {
    let hoy = new Date();
    for (let i = 0; i < viajes.length; i++) {
        let fecha_ida = fechaLocal(viajes[i].ida);
        let fecha_vuelta = fechaLocal(viajes[i].vuelta);
        if (hoy < fecha_ida) {
            viajes[i].estado = "Pendiente";
        } else if (hoy >= fecha_ida && hoy <= fecha_vuelta) {
            viajes[i].estado = "En curso";
        } else {
            viajes[i].estado = "Completado";
        }
    }
}


// cálculos del dashboard
function calculosDashboard() {
    let total = 0;
    let dias = 0;
    let planificados = 0;
    let completados = 0;

    for (let i = 0; i < viajes.length; i++) {
        if (viajes[i].estado == "Pendiente" || viajes[i].estado == "En curso") {
            planificados++;
        } else if (viajes[i].estado == "Completado") {
            completados++;
        }

        total += parseFloat(viajes[i].presupuesto);
        dias += viajes[i].dias;
    }

    return { planificados, completados, total, dias };
}


// FUNCIONES AUXILIARES

// convertir fechas a zona horaria local
function fechaLocal(fecha) {
    let partes = fecha.split("-");
    return new Date(partes[0], partes[1] - 1, partes[2]);
}


// calcular dias del viaje
function calcularDias(ida, vuelta) {
    let fecha_ida = fechaLocal(ida);
    let fecha_vuelta = fechaLocal(vuelta);
    let diferencia = fecha_vuelta - fecha_ida;
    // milisegundos a días
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
}


// formatea fechas para mostrarlas en pantalla
function formatearFecha(fecha) {
    let f = fechaLocal(fecha);
    let dia = f.getDate();
    let mes = f.getMonth();
    let anio = f.getFullYear();
    let meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return dia + " " + meses[mes] + ", " + anio;
}


// cargar viajes al iniciar la aplicación
cargarViajes();