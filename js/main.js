class Viaje {
    id;
    imagen;
    paisList;
    ciudadList;
    ida;
    vuelta;
    presupuesto;
    notas;
    estado;
    dias;

    constructor(imagen, paisList, ciudadList, ida, vuelta, presupuesto, notas, estado) {
        this.id = Date.now();
        this.imagen = imagen;
        this.paisList = paisList;
        this.ciudadList = ciudadList;
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
let bandera_actual = "";


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
    bandera_actual = "";

    actualizarPreview();
});

//Lista de Paises y ciudades
const BASE_URL = 'https://countriesnow.space/api/v0.1/countries'
let paisList = document.getElementById('paisList')
let ciudadList = document.getElementById('ciudadList')


let getPais = async () => {

    paisList.innerHTML = '<option></option>';

    try{
        let data = await fetch(BASE_URL).then(response => response.json());
        const countries = data.data;
        
        countries.forEach((country) => {
            let option = document.createElement("option");
            option.textContent = country.country;
            option.value = country.country;
            paisList.appendChild(option);
        });
    } catch (error){
        console.error("Error al cargar paises:", error);
    }
}

let getCiudades = async (paisName) => {

    ciudadList.innerHTML = '<option></option>';
    ciudadList.disabled = true;

    try {
        let response = await fetch(`${BASE_URL}/cities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ country: paisName })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        let data = await response.json();
        const cities = data.data;

        if(cities.length === 0) {
            ciudadList.innerHTML = '<option> No hay ciudades disponibles </option>';
        }

        cities.forEach((city) => {
            let option = document.createElement("option");
            option.textContent = city;
            option.value = city;
            ciudadList.appendChild(option);
        });

        ciudadList.disabled = false;

    } catch (error) {
        console.error("Fallo en encontrar ciudades:", error);
        ciudadList.innerHTML = '<option value="">Error</option>';
    }
}

paisList.addEventListener('change', (event) => {
    const paisSeleccionado = event.target.value;

    if (paisSeleccionado && paisSeleccionado != "") {
        getCiudades(paisSeleccionado);
    } else {
        ciudadList.innerHTML = '<option value="">Seleccione Ciudad</option>';
        ciudadList.disabled = true;
    }
});

getPais();

//Pais y su bandera

let getBandera = async(paisName) => {

    if(!paisName || paisName.trim()==="") return;

    let imgBandera = document.getElementById('paisBandera');

    try{
        let response = await fetch(`${BASE_URL}/flag/images` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ country: paisName })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        let data = await response.json();
        
        if (data.error){
            console.error("API error", data.msg);
            return;
        }

        const flagURL = data.data.flag;

        imgBandera.src = flagURL;
        imgBandera.style.display = "block";

        // store current flag so subsequent preview updates keep it
        bandera_actual = flagURL;

        actualizarPreview(imgBandera.src);


    }catch (error){
        console.error("Fallo en encontrar bandera");
        imgBandera.style.display = "none";
        bandera_actual = "";
    }
}

paisList.addEventListener('change', (event) => {
    const paisSeleccionado = event.target.value;

    if(paisSeleccionado && paisSeleccionado != ""){
        getCiudades(paisSeleccionado);
        getBandera(paisSeleccionado);
    } else{
        ciudadList.innerHTML = '<option value="">Seleccione Ciudad</option>';
        ciudadList.disabled = true;

        document.getElementById('paisBandera').style.display = "none";
        bandera_actual = "";
    }
})

// actualizar preview en tiempo real
document.getElementById("paisList").addEventListener("input", actualizarPreview);

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

    
    document.getElementById("paisList").value = viaje_seleccionado.paisList;
    // populate cities for the selected country, then set the city value
    getCiudades(viaje_seleccionado.paisList).then(() => {
        document.getElementById("ciudadList").value = viaje_seleccionado.ciudadList;
    });
    // fetch and restore flag for the selected country
    getBandera(viaje_seleccionado.paisList);
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
function actualizarPreview(imgBandera) {

    let paisList = document.getElementById("paisList").value;

    if (imgBandera == undefined) {
        // if we don't receive a flag url, try to use the stored bandera_actual
        if (bandera_actual && bandera_actual !== "") {
            vista_previa.innerHTML = `
        <label class="form-label">Vista previa</label>
        <div class="preview-imagen card-viaje-media"
        style="background-image: url('${imagen_actual}');">
        <img id="paisBandera" src="${bandera_actual}" width="100px" high="50px">
        </div>
    `;
        } else {
            vista_previa.innerHTML = `
        <label class="form-label">Vista previa</label>
        <div class="preview-imagen card-viaje-media"
        style="background-image: url('${imagen_actual}');">
        <img id="paisBandera" src="" style="display:none" width="100px" high="50px">
        </div>
    `;
        }
    } else {
        vista_previa.innerHTML = `
            <label class="form-label">Vista previa</label>
            <div class="preview-imagen card-viaje-media"
            style="background-image: url('${imagen_actual}');">
            <img id="paisBandera" src="${imgBandera}" width="100px" high="50px">
            </div>
        `;
    }

}


// guardar viaje
function guardarViaje(img) {
    
    let paisList = document.getElementById("paisList").value;
    let ciudadList = document.getElementById("ciudadList").value;
    let ida = document.getElementById("ida").value;
    let vuelta = document.getElementById("vuelta").value;
    let presupuesto = document.getElementById("presupuesto").value;
    let notas = document.getElementById("notas").value;
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
            paisList,
            ciudadList,
            ida,
            vuelta,
            presupuesto,
            notas,
            estado,
            dias
        );

        viajes.push(viaje);
    } else {
        // editar viaje
        for (let i = 0; i < viajes.length; i++) {
            if (viajes[i].id == id) {
                viajes[i].imagen = img;
                viajes[i].paisList = paisList;
                viajes[i].ciudadList = ciudadList;
                viajes[i].ida = ida;
                viajes[i].vuelta = vuelta;
                viajes[i].presupuesto = presupuesto;
                viajes[i].notas = notas;
                viajes[i].estado = estado;
                viajes[i].dias = calcularDias(ida, vuelta);
            }
        }
    }

    // guardar cambios
    localStorage.setItem("viajes", JSON.stringify(viajes));

    // reconstruir interfaz
    cargarViajes();
}


// renderiza las cards de los viajes
function cargarViajes() {
    actualizarEstados();
    calculosDashboard();

    contenedor.innerHTML = "";

    let viajesFiltrados = [];

    // filtrar viajes según estado
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

    // metodo para ordenar por fecha de ida
    viajesFiltrados.sort(function(a, b) {
        let fechaA = fechaLocal(a.ida);
        let fechaB = fechaLocal(b.ida);
        return fechaA - fechaB;
    });

    // mensajes si no hay resultados
    if (viajes.length == 0) {
        contenedor.innerHTML = `
            <p id="no-viajes">
                No tenés viajes planificados
            </p>
        `;
        return;
    }

    if (viajesFiltrados.length == 0) {
        contenedor.innerHTML = `
            <p id="no-viajes">
                No hay viajes para este filtro
            </p>
        `;
        return;
    }

    // renderizar cards
    for (let i = 0; i < viajesFiltrados.length; i++) {
        let viaje = viajesFiltrados[i];
        let card = document.createElement("div");
        card.className = "col-12 col-md-6 col-lg-4";

        card.innerHTML = `
            <div data-bs-toggle="modal"
                data-bs-target="#modal-detalles"
                class="card-viaje-link">
                <article class="card card-viaje border-0 h-100">
                    <div class="card-viaje-media" style="background-image: url('${viaje.imagen}');">
                        <span class="placa-viaje">${viaje.paisList}</span>
                    </div>
                    <div class="card-body card-viaje-body">
                        <h2 class="titulo-viaje">${viaje.ciudadList}</h2>
                        <p class="fechas-viaje">${formatearFecha(viaje.ida)} - ${formatearFecha(viaje.vuelta)}</p>
                        <p class="precio-viaje" >$${viaje.presupuesto}</p>
                    </div>
                </article>
            </div>
        `;

        // abrir modal de detalles
        card.onclick = function() {
            viaje_seleccionado = viaje;
            modal_detalles.innerHTML = `
                <div class="row g-4 align-items-start">
                    <div class="col-12 col-lg-5">
                        <div class="card border-0 h-100 shadow-sm overflow-hidden" >

                            <div class="card-body p-0">
                                <div class="card-viaje-media" style="min-height: 308px; background-image: url('${viaje.imagen}');"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-7">
                        <div class="d-flex flex-wrap gap-2 mb-3">
                            <span class="badge rounded-pill" style="background: ${viaje.color}; color: #fff;">${viaje.estado}</span>
                        </div>
                        <h2 class="h3 mb-2">${viaje.ciudadList}</h2>
                        <p class="text-muted mb-4">${viaje.paisList}</p>
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
                <div class="p-3 rounded-3 border">
                    <small class="text-uppercase text-muted d-block mb-2">Notas</small>
                    <p class="mb-0">${viaje.notas}</p>
                </div>
            `;
        };
        contenedor.appendChild(card);
    }
}


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

        total += parseFloat(viajes[i].presupuesto);
        dias += viajes[i].dias;
    }

    if (viajes.length == 0) {
        viajes_planificados.innerText = 0;
        viajes_completados.innerText = 0;
        presupuesto_total.innerText = "$0";
        dias_totales.innerText = 0;
    } else {
        viajes_planificados.innerText = planificados;
        viajes_completados.innerText = completados;
        presupuesto_total.innerText = `$${total}`;
        dias_totales.innerText = dias;
    }
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