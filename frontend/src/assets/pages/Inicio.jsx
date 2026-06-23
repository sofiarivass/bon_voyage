import React, { useState, useEffect } from 'react';


function Inicio() {



    return (
        <>
            <main>
        <div class="container">
            <section id="dashboard">
                <h1>¡Hola, viajero!</h1>
                <p class="p-color">Resumen de tu actividad</p>

                <div class="row g-3 mt-1 dashboard-cards">
                    <div class="col-12 col-sm-6 col-xl-3">
                        <article class="card dashboard-card dashboard-card-planificados border-0 h-100">
                            <div class="card-body d-flex gap-3 align-items-start">
                                <span class="dashboard-icon"><i class="bi bi-airplane"></i></span>
                                <div>
                                    <p id="viajes-planificados" class="dashboard-card-valor"></p>
                                    <p class="dashboard-card-texto">Viajes planificados</p>
                                </div>
                            </div>
                        </article>
                    </div>

                    <div class="col-12 col-sm-6 col-xl-3">
                        <article class="card dashboard-card dashboard-card-completados border-0 h-100">
                            <div class="card-body d-flex gap-3 align-items-start">
                                <span class="dashboard-icon"><i class="bi bi-check-circle"></i></span>
                                <div>
                                    <p id="viajes-completados" class="dashboard-card-valor"></p>
                                    <p class="dashboard-card-texto">Viajes completados</p>
                                </div>
                            </div>
                        </article>
                    </div>

                    <div class="col-12 col-sm-6 col-xl-3">
                        <article class="card dashboard-card dashboard-card-presupuesto border-0 h-100">
                            <div class="card-body d-flex gap-3 align-items-start">
                                <span class="dashboard-icon"><i class="bi bi-wallet2"></i></span>
                                <div>
                                    <p id="presupuesto-total" class="dashboard-card-valor"></p>
                                    <p class="dashboard-card-texto">Presupuesto total estimado</p>
                                </div>
                            </div>
                        </article>
                    </div>

                    <div class="col-12 col-sm-6 col-xl-3">
                        <article class="card dashboard-card dashboard-card-dias border-0 h-100">
                            <div class="card-body d-flex gap-3 align-items-start">
                                <span class="dashboard-icon"><i class="bi bi-calendar3"></i></span>
                                <div>
                                    <p id="dias-totales" class="dashboard-card-valor"></p>
                                    <p class="dashboard-card-texto">Días de viaje en total</p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>

            </section>

            <section id="viajes">
                <div class="viajes-header">
                    <h1>Mis viajes</h1>
                    <div class="viajes-acciones">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle boton-gris" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Filtrar viajes
                            </button>
                            <form id="form-filtros" class="dropdown-menu p-3">
                                <div class="form-check">
                                    <input type="radio" class="form-check-input" name="radioDefault" id="todos" checked>
                                    <label class="form-check-label" for="todos">Todos</label>
                                </div>
                                <div class="form-check">
                                    <input type="radio" class="form-check-input" name="radioDefault" id="pendientes">
                                    <label class="form-check-label" for="pendientes">Pendientes</label>
                                </div>
                                <div class="form-check">
                                    <input type="radio" class="form-check-input" name="radioDefault" id="en_curso">
                                    <label class="form-check-label" for="en_curso">En curso</label>
                                </div>
                                <div class="form-check">
                                    <input type="radio" class="form-check-input" name="radioDefault" id="completados">
                                    <label class="form-check-label" for="completados">Completados</label>
                                </div>
                            </form>
                        </div>
                        <button id="btn-nuevo-viaje" class="btn btn-primary boton-verde" data-bs-toggle="modal" data-bs-target="#modal-form" type="submit">Nuevo viaje</button>
                    </div>
                </div>

                <div id="viajes-container" class="row g-3">
                    <!-- cards generadas por js -->
                </div>


                <!-- Modal ver detalles viaje -->
                <div class="modal fade" id="modal-detalles" tabindex="-1" aria-labelledby="modal-detalles-label" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content detalles-trip-modal">
                            <div class="modal-header border-bottom-0">
                                <h1 class="modal-title fs-5" id="modal-detalles-label">Detalles del viaje</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div id="modal-detalle-body" class="modal-body">
                                <!-- detalles generados por js -->
                            </div>
                            <div class="modal-footer border-top-0">
                                <button id="btn-editar-viaje" class="btn btn-primary boton-verde" data-bs-toggle="modal" data-bs-target="#modal-form" type="submit"><i
                                        class="bi bi-pencil-square"></i></button>
                                <button id="btn-eliminar-viaje" type="button" class="btn btn-danger"><i
                                        class="bi bi-trash3-fill"></i></button>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- Modal crear/editar viaje -->
                <div class="modal fade" id="modal-form" tabindex="-1" aria-labelledby="modal-form-label" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content edit-trip-modal">
                            <div class="modal-header border-bottom-0">
                                <h1 class="modal-title fs-5" id="modal-form-label">...</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="form-modal">
        
                                    <div class="row">
                                        <div id="vista-previa" class="form-section justify-content-center col-lg-6">
                                        </div>

                                        <div class="form-section col-lg-6">
                                            <label for="imagen-viaje" class="form-label">Cargar nueva
                                                imagen</label>
                                            <div class="image-upload-wrapper">
                                                <input type="file" class="form-control" id="imagen-viaje" accept="image/*">
                                                <small class="form-text text-muted">
                                                    JPG, PNG o GIF. Tamaño máximo 5MB.
                                                </small>
                                            </div>
                                            <label for="color" class="form-label mt-3">Color de la
                                                tarjeta</label>
                                            <input type="color" class="form-control color-picker-input-large" id="color">
                                        </div>
                                    </div>


                                    <div class="row">
                                        <div class="form-section col-md-6">
                                            <label for="pais" class="form-label">País</label>
                                            <input type="text" class="form-control" id="pais" placeholder="Ej: Francia" required>
                                        </div>
                                        <div class="form-section col-md-6">
                                            <label for="ciudad" class="form-label">Ciudad/es</label>
                                            <input type="text" class="form-control" id="ciudad" placeholder="Ej: París y Lyon" required>
                                        </div>
                                    </div>
                                    <div class="row mt-4">
                                        <div class="form-section col-md-4">
                                            <label for="ida" class="form-label">Fecha de ida</label>
                                            <input type="date" class="form-control" id="ida" required>
                                        </div>
                                        <div class="form-section col-md-4">
                                            <label for="vuelta" class="form-label">Fecha de vuelta</label>
                                            <input type="date" class="form-control" id="vuelta" required>
                                        </div>

                                        <div class="form-section col-md-4">
                                            <label for="presupuesto" class="form-label">Presupuesto
                                                estimado</label>
                                            <input type="number" class="form-control" id="presupuesto" placeholder="Ej: 1200" required>
                                        </div>
                                    </div>

                                    <div class="form-section mt-4">
                                        <label for="notas" class="form-label">Notas</label>
                                        <textarea class="form-control" id="notas" rows="3" placeholder="Ej: Preferencias de alojamiento, actividades especiales, etc."></textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer border-top-0">
                                <button class="btn btn-primary boton-verde" type="submit" form="form-modal"><i class="bi bi-floppy2-fill"></i></button>
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