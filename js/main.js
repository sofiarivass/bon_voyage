class Viaje {
    id;
    imagen;
    // color;
    pais;
    ciudad;
    ida;
    vuelta;
    presupuesto;
    notas;
    estado;
    dias;

    constructor(imagen, pais, ciudad, ida, vuelta, presupuesto, notas, estado) {
        this.id = Date.now();
        this.imagen = imagen;
        // this.color = color;
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

// UNSPLASH API - CREDENCIALES
const UNSPLASH_ACCESS_KEY = "GL9Xc8f5pLKivzb4S_pZ0NX18zOSOfm7xP4F4S5zzVA";

// click en botón nuevo viaje
document.getElementById('btn-nuevo-viaje').addEventListener('click', function () {
    editando = false;
    titulo_modal.innerText = "Crear viaje";
    form_modal.reset();
    imagen_actual = "https://placehold.net/default.svg";

    actualizarPreview();
});

// document.getElementById("color").addEventListener("input", actualizarPreview);
document.getElementById("pais").addEventListener("input", actualizarPreview);

// cargar imagen seleccionada (Subir propia)
document.getElementById("imagen-viaje").addEventListener("change", function () {
    let inputImagen = document.getElementById("imagen-viaje");
    let archivo = inputImagen.files[0];
    if (archivo) {
        let reader = new FileReader();
        reader.onload = function (e) {
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
        if (editando && viajes[i].id == id) {
            continue;
        }
        let ida_existente = fechaLocal(viajes[i].ida);
        let vuelta_existente = fechaLocal(viajes[i].vuelta);
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
        reader.onload = function (e) {
            let imgURL = e.target.result;
            guardarViaje(imgURL);
        };
        reader.readAsDataURL(archivo);
    } else {
        guardarViaje(imagen_actual);
    }
});

// click en botón editar viaje
document.getElementById('btn-editar-viaje').addEventListener('click', function () {
    editando = true;
    titulo_modal.innerText = "Editar viaje";
    id = viaje_seleccionado.id;
    imagen_actual = viaje_seleccionado.imagen;

    // document.getElementById("color").value = viaje_seleccionado.color;
    document.getElementById("pais").value = viaje_seleccionado.pais;
    document.getElementById("ciudad").value = viaje_seleccionado.ciudad;
    document.getElementById("ida").value = viaje_seleccionado.ida;
    document.getElementById("vuelta").value = viaje_seleccionado.vuelta;
    document.getElementById("presupuesto").value = viaje_seleccionado.presupuesto;
    document.getElementById("notas").value = viaje_seleccionado.notas;

    actualizarPreview();
});

// click en botón eliminar viaje
document.getElementById('btn-eliminar-viaje').addEventListener('click', function () {
    let confirmar = confirm("¿Seguro que querés eliminar este viaje?");
    if (!confirmar) return;

    viajes = viajes.filter(viaje => viaje.id !== viaje_seleccionado.id);
    localStorage.setItem("viajes", JSON.stringify(viajes));
    
    let modal = bootstrap.Modal.getInstance(document.getElementById('modal-detalles'));
    modal.hide();

    cargarViajes();
});

// filtrar viajes
filtro.addEventListener("input", function () {
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
    // let color = document.getElementById("color").value;
    let pais = document.getElementById("pais").value;

    vista_previa.innerHTML = `
        <label class="form-label">Vista previa</label>
        <div class="preview-imagen card-viaje-media"
            style="background-image: url('${imagen_actual}');">
            <span class="placa-viaje" style="background: black;">
                ${pais}
            </span>
        </div>
    `;
}

// guardar viaje
function guardarViaje(img) {
    // let color = document.getElementById("color").value;
    let pais = document.getElementById("pais").value;
    let ciudad = document.getElementById("ciudad").value;
    let ida = document.getElementById("ida").value;
    let vuelta = document.getElementById("vuelta").value;
    let presupuesto = document.getElementById("presupuesto").value;
    let notas = document.getElementById("notas").value;
    let estado = "";
    let dias = calcularDias(ida, vuelta);

    let hoy = new Date();
    if (hoy < fechaLocal(ida)) {
        estado = "Pendiente";
    } else if (hoy >= fechaLocal(ida) && hoy <= fechaLocal(vuelta)) {
        estado = "En curso";
    } else {
        estado = "Completado";
    }

    if (!editando) {
        let viaje = new Viaje(img, pais, ciudad, ida, vuelta, presupuesto, notas, estado);
        viajes.push(viaje);
    } else {
        for (let i = 0; i < viajes.length; i++) {
            if (viajes[i].id == id) {
                viajes[i].imagen = img;
                // viajes[i].color = color;
                viajes[i].pais = pais;
                viajes[i].ciudad = ciudad;
                viajes[i].ida = ida;
                viajes[i].vuelta = vuelta;
                viajes[i].presupuesto = presupuesto;
                viajes[i].notas = notas;
                viajes[i].estado = estado;
                viajes[i].dias = calcularDias(ida, vuelta);
            }
        }
    }

    localStorage.setItem("viajes", JSON.stringify(viajes));
    cargarViajes();
}

// renderiza las cards de los viajes
function cargarViajes() {
    actualizarEstados();
    calculosDashboard();

    contenedor.innerHTML = "";
    let viajesFiltrados = [];

    for (let i = 0; i < viajes.length; i++) {
        if (filtro_seleccionado == "todos") {
            viajesFiltrados.push(viajes[i]);
        } else if (filtro_seleccionado == "pendientes" && viajes[i].estado == "Pendiente") {
            viajesFiltrados.push(viajes[i]);
        } else if (filtro_seleccionado == "en_curso" && viajes[i].estado == "En curso") {
            viajesFiltrados.push(viajes[i]);
        } else if (filtro_seleccionado == "completados" && viajes[i].estado == "Completado") {
            viajesFiltrados.push(viajes[i]);
        }
    }

    viajesFiltrados.sort(function (a, b) {
        return fechaLocal(a.ida) - fechaLocal(b.ida);
    });

    if (viajes.length == 0) {
        contenedor.innerHTML = `<p id="no-viajes">No tenés viajes planificados</p>`;
        return;
    }

    if (viajesFiltrados.length == 0) {
        contenedor.innerHTML = `<p id="no-viajes">No hay viajes para este filtro</p>`;
        return;
    }

    for (let i = 0; i < viajesFiltrados.length; i++) {
        let viaje = viajesFiltrados[i];
        let card = document.createElement("div");
        card.className = "col-12 col-md-6 col-lg-4";

        card.innerHTML = `
            <div data-bs-toggle="modal" data-bs-target="#modal-detalles" class="card-viaje-link">
                <article class="card card-viaje border-0 h-100">
                    <div class="card-viaje-media" style="background-image: url('${viaje.imagen}');">
                        <span class="placa-viaje" style="background: black; color: #fff;">${viaje.pais}</span>
                    </div>
                    <div class="card-body card-viaje-body">
                        <h2 class="titulo-viaje">${viaje.ciudad}</h2>
                        <p class="fechas-viaje">${formatearFecha(viaje.ida)} - ${formatearFecha(viaje.vuelta)}</p>
                        <p class="precio-viaje" style="opacity: 0.6;">$${viaje.presupuesto}</p>
                    </div>
                </article>
            </div>
        `;

        card.onclick = function () {
            viaje_seleccionado = viaje;
            modal_detalles.innerHTML = `
                <div class="row g-4 align-items-start">
                    <div class="col-12 col-lg-5">
                        <div class="card border-0 h-100 shadow-sm overflow-hidden">
                            <div class="card-body p-0">
                                <div class="card-viaje-media" style="min-height: 308px; background-image: url('${viaje.imagen}');"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-7">
                        <div class="d-flex flex-wrap gap-2 mb-3">
                            <span class="badge rounded-pill" style="background: black; color: #fff;">${viaje.estado}</span>
                        </div>
                        <h2 class="h3 mb-2">${viaje.ciudad}</h2>
                        <p class="text-muted mb-4">${viaje.pais}</p>
                        <div class="row g-3 mb-4">
                            <div class="col-sm-6">
                                <div class="p-3 rounded-3 border bg-light h-100">
                                    <small class="text-uppercase text-muted d-block mb-1">Fecha de ida</small>
                                    <strong>${formatearFecha(viaje.ida)}</strong>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="p-3 rounded-3 border bg-light h-100">
                                    <small class="text-uppercase text-muted d-block mb-1">Fecha de vuelta</small>
                                    <strong>${formatearFecha(viaje.vuelta)}</strong>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="p-3 rounded-3 border bg-light h-100">
                                    <small class="text-uppercase text-muted d-block mb-1">Duración del viaje</small>
                                    <strong>${viaje.dias} días</strong>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="p-3 rounded-3 border bg-light h-100">
                                    <small class="text-uppercase text-muted d-block mb-1">Presupuesto est.</small>
                                    <strong>$${viaje.presupuesto}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-3 rounded-3 border mt-3">
                    <small class="text-uppercase text-muted d-block mb-2">Notas</small>
                    <p class="mb-0">${viaje.notas}</p>
                </div>
            `;
        };
        contenedor.appendChild(card);
    }
}

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

function calculosDashboard() {
    let viajes_planificados = document.getElementById("viajes-planificados");
    let viajes_completados = document.getElementById("viajes-completados");
    let presupuesto_total = document.getElementById("presupuesto-total");
    let dias_totales = document.getElementById("dias-totales");

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
        total += parseFloat(viajes[i].presupuesto) || 0;
        dias += viajes[i].dias || 0;
    }

    if (viajes.length == 0) {
        if(viajes_planificados) viajes_planificados.innerText = 0;
        if(viajes_completados) viajes_completados.innerText = 0;
        if(presupuesto_total) presupuesto_total.innerText = "$0";
        if(dias_totales) dias_totales.innerText = 0;
    } else {
        if(viajes_planificados) viajes_planificados.innerText = planificados;
        if(viajes_completados) viajes_completados.innerText = completados;
        if(presupuesto_total) presupuesto_total.innerText = `$${total}`;
        if(dias_totales) dias_totales.innerText = dias;
    }
}

// API UNSPLASH

// btn img aleatoria
document.getElementById("btn-img-aleatoria").addEventListener("click", async function () {
    let ciudad = document.getElementById("ciudad").value.trim();
    let pais = document.getElementById("pais").value.trim();

    if (!ciudad && !pais) {
        alert("Por favor, ingresá un país o ciudad primero para poder buscar una foto.");
        return;
    }
    await buscarFotoDestino(`${ciudad} ${pais}`);
});

// btn abrir galeria
document.getElementById("btn-abrir-galeria").addEventListener("click", function () {
    let buscadorUnsplash = document.getElementById("contenedor-buscador-unsplash");
    buscadorUnsplash.classList.toggle("d-none");

    let ciudad = document.getElementById("ciudad").value.trim();
    let pais = document.getElementById("pais").value.trim();
    
    if (ciudad && pais) {
        document.getElementById("input-busqueda-unsplash").value = `${ciudad} ${pais}`;
    } else if (ciudad) {
        document.getElementById("input-busqueda-unsplash").value = ciudad;
    } else if (pais) {
        document.getElementById("input-busqueda-unsplash").value = pais;
    }
});

// btn busqueda
document.getElementById("btn-busqueda").addEventListener("click", function () {
    let query = document.getElementById("input-busqueda-unsplash").value.trim();
    if (query) {
        buscarGaleriaUnsplash(query);
    }
});

// buscar img aleatoria
async function buscarFotoDestino(query) {
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape`;
    try {
        let respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Error al obtener foto aleatoria");
        let foto = await respuesta.json();
        
        imagen_actual = foto.urls.regular; // guarda la foto
        actualizarPreview(); // fuerza el renderizado en pantalla
    } catch (error) {
        console.error(error);
        alert("No se pudo encontrar una foto automática para este destino. ¡Probá con el buscador manual!");
    }
}

// mostrar galeria
async function buscarGaleriaUnsplash(query) {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=6&orientation=landscape`;
    let contenedorResultados = document.getElementById("resultados-galeria-unsplash");

    contenedorResultados.innerHTML = "<p class='col-12 text-muted text-center small py-2'>Buscando opciones... 📸</p>";

    try {
        let respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Error en la galería Unsplash");
        let datos = await respuesta.json();

        contenedorResultados.innerHTML = ""; 

        if (datos.results.length === 0) {
            contenedorResultados.innerHTML = "<p class='col-12 text-muted text-center small py-2'>No se encontraron imágenes.</p>";
            return;
        }

        datos.results.forEach(foto => {
            let col = document.createElement("div");
            col.className = "col";
            col.innerHTML = `
                <img src="${foto.urls.thumb}" class="img-fluid rounded img-thumbnail img-galeria-item" 
                     style="cursor: pointer; height: 55px; width: 100%; object-fit: cover;" 
                     alt="${foto.alt_description || 'Foto Unsplash'}">
            `;

            col.querySelector("img").onclick = function () {
                imagen_actual = foto.urls.regular; 
                actualizarPreview(); 

                document.querySelectorAll(".img-galeria-item").forEach(img => img.classList.remove("border-primary", "border-3"));
                this.classList.add("border-primary", "border-3");
            };

            contenedorResultados.appendChild(col);
        });

    } catch (error) {
        console.error(error);
        contenedorResultados.innerHTML = "<p class='col-12 text-danger text-center small py-2'>Error al conectar con la galería.</p>";
    }
}

// FUNCIONES AUXILIARES
function fechaLocal(fecha) {
    if(!fecha) return new Date();
    let partes = fecha.split("-");
    return new Date(partes[0], partes[1] - 1, partes[2]);
}

function calcularDias(ida, vuelta) {
    if(!ida || !vuelta) return 0;
    let fecha_ida = fechaLocal(ida);
    let fecha_vuelta = fechaLocal(vuelta);
    let diferencia = fecha_vuelta - fecha_ida;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
}

function formatearFecha(fecha) {
    if(!fecha) return "";
    let f = fechaLocal(fecha);
    let dia = f.getDate();
    let mes = f.getMonth();
    let anio = f.getFullYear();
    let meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return dia + " " + meses[mes] + ", " + anio;
}

// Ejecución inicial
cargarViajes();