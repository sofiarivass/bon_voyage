import React, { useState, useEffect } from 'react';
import { fechaLocal, formatearFecha, calculosDashboard, obtenerEstadoViaje, Viaje, calcularDias } from '../components/main.js';

function Inicio() {
    // ---- ESTADOS PRINCIPALES ----
    const [viajes, setViajes] = useState([]);
    const [filtroSeleccionado, setFiltroSeleccionado] = useState("todos");
    const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
    const [editando, setEditando] = useState(false);

    // ---- ESTADOS DEL FORMULARIO DEL MODAL ----
    const [formColor, setFormColor] = useState("#000000");
    const [formPais, setFormPais] = useState("");
    const [formCiudad, setFormCiudad] = useState("");
    const [formIda, setFormIda] = useState("");
    const [formVuelta, setFormVuelta] = useState("");
    const [formPresupuesto, setFormPresupuesto] = useState("");
    const [formNotas, setFormNotas] = useState("");
    const [imagenActual, setImagenActual] = useState("https://placehold.net/default.svg");

    // 1. Carga inicial del LocalStorage
    useEffect(() => {
        const viajesGuardados = localStorage.getItem("viajes");
        if (viajesGuardados) {
            // Sincronizamos y recalculamos estados por si cambiaron de día de forma offline
            const listaParsed = JSON.parse(viajesGuardados);
            const listaActualizada = listaParsed.map(v => ({
                ...v,
                estado: obtenerEstadoViaje(v.ida, v.vuelta)
            }));
            setViajes(listaActualizada);
            localStorage.setItem("viajes", JSON.stringify(listaActualizada));
        }
    }, []);

    // 2. Filtrado y ordenamiento en tiempo real
    const viajesFiltrados = viajes
        .filter(viaje => {
            if (filtroSeleccionado === "todos") return true;
            if (filtroSeleccionado === "pendientes") return viaje.estado === "Pendiente";
            if (filtroSeleccionado === "en_curso") return viaje.estado === "En curso";
            if (filtroSeleccionado === "completados") return viaje.estado === "Completado";
            return true;
        })
        .sort((a, b) => fechaLocal(a.ida) - fechaLocal(b.ida));

    // Totales del dashboard automatizados
    const totales = calculosDashboard(viajes);

    // ---- MANEJADORES DE ACCIONES ----

    // Preparar el formulario para crear un nuevo viaje
    const abrirNuevoViaje = () => {
        setEditando(false);
        setFormColor("#198754"); // Color verde por defecto o el que prefieras
        setFormPais("");
        setFormCiudad("");
        setFormIda("");
        setFormVuelta("");
        setFormPresupuesto("");
        setFormNotas("");
        setImagenActual("https://placehold.net/default.svg");
    };

    // Cargar imagen en base64
    const manejarCambioImagen = (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagenActual(event.target.result);
            };
            reader.readAsDataURL(archivo);
        }
    };

    // Enviar el formulario (Crear o Editar)
    const guardarViajeSubmit = (event) => {
        event.preventDefault();

        // Validaciones de fechas
        let fecha_ida = fechaLocal(formIda);
        let fecha_vuelta = fechaLocal(formVuelta);
        if (fecha_vuelta < fecha_ida) {
            alert("La fecha de vuelta no puede ser anterior a la fecha de ida");
            return;
        }

        // Validar solapamiento
        for (let i = 0; i < viajes.length; i++) {
            if (editando && viajes[i].id === viajeSeleccionado?.id) {
                continue;
            }
            let ida_existente = fechaLocal(viajes[i].ida);
            let vuelta_existente = fechaLocal(viajes[i].vuelta);
            if (fecha_ida <= vuelta_existente && fecha_vuelta >= ida_existente) {
                alert("Ya tenés un viaje en esas fechas");
                return;
            }
        }

        const nuevoEstado = obtenerEstadoViaje(formIda, formVuelta);
        const nuevosDias = calcularDias(formIda, formVuelta);

        let listaActualizada;

        if (!editando) {
            // Crear nuevo viaje usando la clase unificada
            const nuevoViaje = new Viaje(
                imagenActual,
                formColor,
                formPais,
                formCiudad,
                formIda,
                formVuelta,
                formPresupuesto,
                formNotas,
                nuevoEstado
            );
            listaActualizada = [...viajes, nuevoViaje];
        } else {
            // Editar viaje existente
            listaActualizada = viajes.map(v => {
                if (v.id === viajeSeleccionado.id) {
                    return {
                        ...v,
                        imagen: imagenActual,
                        color: formColor,
                        pais: formPais,
                        ciudad: formCiudad,
                        ida: formIda,
                        vuelta: formVuelta,
                        presupuesto: formPresupuesto,
                        notas: formNotas,
                        estado: nuevoEstado,
                        dias: nuevosDias
                    };
                }
                return v;
            });
            // Actualizamos la ventana de detalles con los datos nuevos
            setViajeSeleccionado(listaActualizada.find(v => v.id === viajeSeleccionado.id));
        }

        setViajes(listaActualizada);
        localStorage.setItem("viajes", JSON.stringify(listaActualizada));

        // Cerrar el modal mediante Bootstrap nativo
        const modalElement = document.getElementById('modal-form');
        const modalInstance = window.bootstrap?.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
        modalInstance.hide();
    };

    // Configurar formulario para Editar
    const iniciarEdicion = () => {
        if (!viajeSeleccionado) return;
        setEditando(true);
        setFormColor(viajeSeleccionado.color);
        setFormPais(viajeSeleccionado.pais);
        setFormCiudad(viajeSeleccionado.ciudad);
        setFormIda(viajeSeleccionado.ida);
        setFormVuelta(viajeSeleccionado.vuelta);
        setFormPresupuesto(viajeSeleccionado.presupuesto);
        setFormNotas(viajeSeleccionado.notas);
        setImagenActual(viajeSeleccionado.imagen);
    };

    // Eliminar un viaje
    const eliminarViaje = () => {
        if (!viajeSeleccionado) return;
        let confirmar = confirm("¿Seguro que querés eliminar este viaje?");
        if (!confirmar) return;

        const listaActualizada = viajes.filter(v => v.id !== viajeSeleccionado.id);
        setViajes(listaActualizada);
        localStorage.setItem("viajes", JSON.stringify(listaActualizada));

        // Cerrar modal de detalles
        const modalElement = document.getElementById('modal-detalles');
        const modalInstance = window.bootstrap?.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
        modalInstance.hide();
        setViajeSeleccionado(null);
    };

    return (
        <>
            <main>
                <div className="container">
                    {/* DASHBOARD SECTION */}
                    <section id="dashboard">
                        <h1>¡Hola, viajero!</h1>
                        <p className="p-color">Resumen de tu actividad</p>

                        <div className="row g-3 mt-1 dashboard-cards">
                            <div className="col-12 col-sm-6 col-xl-3">
                                <article className="card dashboard-card dashboard-card-planificados border-0 h-100">
                                    <div className="card-body d-flex gap-3 align-items-start">
                                        <span className="dashboard-icon"><i className="bi bi-airplane"></i></span>
                                        <div>
                                            <p className="dashboard-card-valor">{totales.planificados}</p>
                                            <p className="dashboard-card-texto">Viajes planificados</p>
                                        </div>
                                    </div>
                                </article>
                            </div>

                            <div className="col-12 col-sm-6 col-xl-3">
                                <article className="card dashboard-card dashboard-card-completados border-0 h-100">
                                    <div className="card-body d-flex gap-3 align-items-start">
                                        <span className="dashboard-icon"><i className="bi bi-check-circle"></i></span>
                                        <div>
                                            <p className="dashboard-card-valor">{totales.completados}</p>
                                            <p className="dashboard-card-texto">Viajes completados</p>
                                        </div>
                                    </div>
                                </article>
                            </div>

                            <div className="col-12 col-sm-6 col-xl-3">
                                <article className="card dashboard-card dashboard-card-presupuesto border-0 h-100">
                                    <div className="card-body d-flex gap-3 align-items-start">
                                        <span className="dashboard-icon"><i className="bi bi-wallet2"></i></span>
                                        <div>
                                            <p className="dashboard-card-valor">${totales.total}</p>
                                            <p className="dashboard-card-texto">Presupuesto total estimado</p>
                                        </div>
                                    </div>
                                </article>
                            </div>

                            <div className="col-12 col-sm-6 col-xl-3">
                                <article className="card dashboard-card dashboard-card-dias border-0 h-100">
                                    <div className="card-body d-flex gap-3 align-items-start">
                                        <span className="dashboard-icon"><i className="bi bi-calendar3"></i></span>
                                        <div>
                                            <p className="dashboard-card-valor">{totales.dias}</p>
                                            <p className="dashboard-card-texto">Días de viaje en total</p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN MIS VIAJES */}
                    <section id="viajes">
                        <div className="viajes-header">
                            <h1>Mis viajes</h1>
                            <div className="viajes-acciones">
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle boton-gris" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Filtrar viajes
                                    </button>
                                    <form id="form-filtros" className="dropdown-menu p-3">
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="radioDefault" id="todos" checked={filtroSeleccionado === "todos"} onChange={() => setFiltroSeleccionado("todos")} />
                                            <label className="form-check-label" htmlFor="todos">Todos</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="radioDefault" id="pendientes" checked={filtroSeleccionado === "pendientes"} onChange={() => setFiltroSeleccionado("pendientes")} />
                                            <label className="form-check-label" htmlFor="pendientes">Pendientes</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="radioDefault" id="en_curso" checked={filtroSeleccionado === "en_curso"} onChange={() => setFiltroSeleccionado("en_curso")} />
                                            <label className="form-check-label" htmlFor="en_curso">En curso</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="radioDefault" id="completados" checked={filtroSeleccionado === "completados"} onChange={() => setFiltroSeleccionado("completados")} />
                                            <label className="form-check-label" htmlFor="completados">Completados</label>
                                        </div>
                                    </form>
                                </div>
                                <button onClick={abrirNuevoViaje} id="btn-nuevo-viaje" className="btn btn-primary boton-verde" data-bs-toggle="modal" data-bs-target="#modal-form" type="button">Nuevo viaje</button>
                            </div>
                        </div>

                        {/* LISTADO DINÁMICO DE TARJETAS */}
                        <div id="viajes-container" className="row g-3">
                            {viajes.length === 0 && <p id="no-viajes">No tenés viajes planificados</p>}
                            {viajes.length > 0 && viajesFiltrados.length === 0 && <p id="no-viajes">No hay viajes para este filtro</p>}

                            {viajesFiltrados.map((viaje) => (
                                <div className="col-12 col-md-6 col-lg-4" key={viaje.id}>
                                    <div onClick={() => setViajeSeleccionado(viaje)} data-bs-toggle="modal" data-bs-target="#modal-detalles" className="card-viaje-link" style={{ cursor: 'pointer' }}>
                                        <article className="card card-viaje border-0 h-100">
                                            <div className="card-viaje-media" style={{ backgroundImage: `url('${viaje.imagen}')` }}>
                                                <span className="placa-viaje" style={{ background: viaje.color }}>{viaje.pais}</span>
                                            </div>
                                            <div className="card-body card-viaje-body">
                                                <h2 className="titulo-viaje">{viaje.ciudad}</h2>
                                                <p className="fechas-viaje">{formatearFecha(viaje.ida)} - {formatearFecha(viaje.vuelta)}</p>
                                                <p className="precio-viaje" style={{ color: viaje.color, opacity: 0.8 }}>${viaje.presupuesto}</p>
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* MODAL 1: DETALLES DEL VIAJE */}
                        <div className="modal fade" id="modal-detalles" tabIndex="-1" aria-labelledby="modal-detalles-label" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content detalles-trip-modal">
                                    <div className="modal-header border-bottom-0">
                                        <h1 className="modal-title fs-5" id="modal-detalles-label">Detalles del viaje</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        {viajeSeleccionado && (
                                            <div id="modal-detalle-render">
                                                <div className="preview-imagen card-viaje-media mb-3" style={{ backgroundImage: `url('${viajeSeleccionado.imagen}')`, height: '250px', borderRadius: '8px' }}>
                                                    <span className="placa-viaje" style={{ background: viajeSeleccionado.color }}>{viajeSeleccionado.pais}</span>
                                                </div>
                                                <h3>{viajeSeleccionado.ciudad}</h3>
                                                <p><strong>Fechas:</strong> {formatearFecha(viajeSeleccionado.ida)} al {formatearFecha(viajeSeleccionado.vuelta)} ({viajeSeleccionado.dias} días)</p>
                                                <p><strong>Presupuesto:</strong> ${viajeSeleccionado.presupuesto}</p>
                                                <p><strong>Estado:</strong> <span className="badge" style={{ backgroundColor: viajeSeleccionado.color }}>{viajeSeleccionado.estado}</span></p>
                                                {viajeSeleccionado.notas && <p><strong>Notas:</strong> {viajeSeleccionado.notas}</p>}
                                            </div>
                                        )}
                                    </div>
                                    <div className="modal-footer border-top-0">
                                        <button onClick={iniciarEdicion} id="btn-editar-viaje" className="btn btn-primary boton-verde" data-bs-toggle="modal" data-bs-target="#modal-form" type="button"><i className="bi bi-pencil-square"></i></button>
                                        <button onClick={eliminarViaje} id="btn-eliminar-viaje" type="button" className="btn btn-danger"><i className="bi bi-trash3-fill"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MODAL 2: FORMULARIO (NUEVO / EDITAR) */}
                        <div className="modal fade" id="modal-form" tabIndex="-1" aria-labelledby="modal-form-label" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content edit-trip-modal">
                                    <div className="modal-header border-bottom-0">
                                        <h1 className="modal-title fs-5" id="modal-form-label">{editando ? "Editar viaje" : "Crear viaje"}</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form id="form-modal" onSubmit={guardarViajeSubmit}>
                                            <div className="row">
                                                {/* VISTA PREVIA INTEGRADA */}
                                                <div id="vista-previa" className="form-section justify-content-center col-lg-6">
                                                    <label className="form-label">Vista previa</label>
                                                    <div className="preview-imagen card-viaje-media" style={{ backgroundImage: `url('${imagenActual}')` }}>
                                                        <span className="placa-viaje" style={{ background: formColor }}>
                                                            {formPais || "País"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="form-section col-lg-6">
                                                    <label htmlFor="imagen-viaje" className="form-label">Cargar nueva imagen</label>
                                                    <div className="image-upload-wrapper">
                                                        <input type="file" className="form-control" id="imagen-viaje" accept="image/*" onChange={manejarCambioImagen} />
                                                        <small className="form-text text-muted">JPG, PNG o GIF. Tamaño máximo 5MB.</small>
                                                    </div>
                                                    <label htmlFor="color" className="form-label mt-3">Color de la tarjeta</label>
                                                    <input type="color" className="form-control color-picker-input-large" id="color" value={formColor} onChange={(e) => setFormColor(e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                <div className="form-section col-md-6">
                                                    <label htmlFor="pais" className="form-label">País</label>
                                                    <input type="text" className="form-control" id="pais" placeholder="Ej: Francia" value={formPais} onChange={(e) => setFormPais(e.target.value)} required />
                                                </div>
                                                <div className="form-section col-md-6">
                                                    <label htmlFor="ciudad" className="form-label">Ciudad/es</label>
                                                    <input type="text" className="form-control" id="ciudad" placeholder="Ej: París y Lyon" value={formCiudad} onChange={(e) => setFormCiudad(e.target.value)} required />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="form-section col-md-4">
                                                    <label htmlFor="ida" className="form-label">Fecha de ida</label>
                                                    <input type="date" className="form-control" id="ida" value={formIda} onChange={(e) => setFormIda(e.target.value)} required />
                                                </div>
                                                <div className="form-section col-md-4">
                                                    <label htmlFor="vuelta" className="form-label">Fecha de vuelta</label>
                                                    <input type="date" className="form-control" id="vuelta" value={formVuelta} onChange={(e) => setFormVuelta(e.target.value)} required />
                                                </div>
                                                <div className="form-section col-md-4">
                                                    <label htmlFor="presupuesto" className="form-label">Presupuesto estimado</label>
                                                    <input type="number" className="form-control" id="presupuesto" placeholder="Ej: 1200" value={formPresupuesto} onChange={(e) => setFormPresupuesto(e.target.value)} required />
                                                </div>
                                            </div>

                                            <div className="form-section mt-3">
                                                <label htmlFor="notas" className="form-label">Notas</label>
                                                <textarea className="form-control" id="notas" rows="3" placeholder="Ej: Preferencias de alojamiento, actividades..." value={formNotas} onChange={(e) => setFormNotas(e.target.value)}></textarea>
                                            </div>

                                            <div className="modal-footer border-top-0 px-0 mt-3">
                                                <button className="btn btn-primary boton-verde" type="submit">
                                                    <i className="bi bi-floppy2-fill"></i> Guardar
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>
                </div>
            </main>
        </>
    );
}

export default Inicio;