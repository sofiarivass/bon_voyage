import React from "react";

function Inicio(){
    return(
    <>
        <main>
            <div className="container">
                <section id="dashboard">
                    <h1>¡Hola, viajero!</h1>
                    <p className="p-color">Resumen de tu actividad</p>

                    <div className="row g-3 mt-1 dashboard-cards">
                        <div className="col-12 col-sm-6 col-xl-3">
                            <article className="card dashboard-card dashboard-card-planificados border-0 h-100">
                                <div className="card-body d-flex gap-3 align-items-start">
                                    <span className="dashboard-icon"><i className="bi bi-airplane"></i></span>
                                    <div>
                                        <p id="viajes-planificados" className="dashboard-card-valor"></p>
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
                                        <p id="viajes-completados" className="dashboard-card-valor"></p>
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
                                        <p id="presupuesto-total" className="dashboard-card-valor"></p>
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
                                        <p id="dias-totales" className="dashboard-card-valor"></p>
                                        <p className="dashboard-card-texto">Días de viaje en total</p>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>

                </section>

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
                                        <input type="radio" className="form-check-input" name="radioDefault" id="todos" checked/>
                                        <label className="form-check-label" htmlFor="todos">Todos</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="radioDefault" id="pendientes"/>
                                        <label className="form-check-label" htmlFor="pendientes">Pendientes</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="radioDefault" id="en_curso"/>
                                        <label className="form-check-label" htmlFor="en_curso">En curso</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="radioDefault" id="completados"/>
                                        <label className="form-check-label" htmlFor="completados">Completados</label>
                                    </div>
                                </form>
                            </div>
                            <button id="btn-nuevo-viaje" className="btn btn-primary boton-verde" data-bs-toggle="modal" data-bs-target="#modal-form" type="submit">Nuevo viaje</button>
                        </div>
                    </div>

                    <div id="viajes-container" className="row g-3">
                        /* cards generadas por js */
                    </div>


                    /* Modal ver detalles viaje */
                    <div className="modal fade" id="modal-detalles" tabIndex="-1" aria-labelledby="modal-detalles-label" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content detalles-trip-modal">
                                <div className="modal-header border-bottom-0">
                                    <h1 className="modal-title fs-5" id="modal-detalles-label">Detalles del viaje</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div id="modal-detalle-body" className="modal-body">
                                    /* detalles generados por js */
                                </div>
                                <div className="modal-footer border-top-0">
                                    <button id="btn-editar-viaje" className="btn btn-primary boton-verde" data-bs-toggle="modal" data-bs-target="#modal-form" type="submit"><i
                                            className="bi bi-pencil-square"></i></button>
                                    <button id="btn-eliminar-viaje" type="button" className="btn btn-danger"><i
                                            className="bi bi-trash3-fill"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>


                    /* Modal crear/editar viaje */
                    <div className="modal fade" id="modal-form" tabIndex="-1" aria-labelledby="modal-form-label" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content edit-trip-modal">
                                <div className="modal-header border-bottom-0">
                                    <h1 className="modal-title fs-5" id="modal-form-label">...</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form id="form-modal">
                                        /* Imagen y color picker */
                                        <div className="row">
                                            <div id="vista-previa" className="form-section justify-content-center col-lg-6">
                                                /* preview generada en js */
                                            </div>

                                            <div className="form-section col-lg-6">
                                                <label htmlFor="imagen-viaje" className="form-label">Cargar nueva
                                                    imagen</label>
                                                <div className="image-upload-wrapper">
                                                    <input type="file" className="form-control" id="imagen-viaje" accept="image/*"/>
                                                    <small className="form-text text-muted">
                                                        JPG, PNG o GIF. Tamaño máximo 5MB.
                                                    </small>
                                                </div>
                                                <label htmlFor="color" className="form-label mt-3">Color de la
                                                    tarjeta</label>
                                                <input type="color" className="form-control color-picker-input-large" id="color"/>
                                            </div>
                                        </div>

                                        /* Información del viaje */
                                        <div className="row">
                                            <div className="form-section col-md-6">
                                                <label htmlFor="pais" className="form-label">País</label>
                                                <input type="text" className="form-control" id="pais" placeholder="Ej: Francia" required/>
                                            </div>
                                            <div className="form-section col-md-6">
                                                <label htmlFor="ciudad" className="form-label">Ciudad/es</label>
                                                <input type="text" className="form-control" id="ciudad" placeholder="Ej: París y Lyon" required/>
                                            </div>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="form-section col-md-4">
                                                <label htmlFor="ida" className="form-label">Fecha de ida</label>
                                                <input type="date" className="form-control" id="ida" required/>
                                            </div>
                                            <div className="form-section col-md-4">
                                                <label htmlFor="vuelta" className="form-label">Fecha de vuelta</label>
                                                <input type="date" className="form-control" id="vuelta" required/>
                                            </div>
                                            /* Presupuesto */
                                            <div className="form-section col-md-4">
                                                <label htmlFor="presupuesto" className="form-label">Presupuesto
                                                    estimado</label>
                                                <input type="number" className="form-control" id="presupuesto" placeholder="Ej: 1200" required/>
                                            </div>
                                        </div>

                                        /* Notas */
                                        <div className="form-section mt-4">
                                            <label htmlFor="notas" className="form-label">Notas</label>
                                            <textarea className="form-control" id="notas" rows="3" placeholder="Ej: Preferencias de alojamiento, actividades especiales, etc."></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer border-top-0">
                                    <button className="btn btn-primary boton-verde" type="submit" form="form-modal"><i className="bi bi-floppy2-fill"></i></button>
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