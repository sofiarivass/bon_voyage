import React from 'react';
import { formatearFecha } from '../utils/viajesHelpers';

export default function ModalDetalles({ viaje, onEditarClick, onEliminarClick }) {
    if (!viaje) return null;

    return (
        <div class="modal fade" id="modal-detalles" tabIndex="-1" aria-labelledby="modal-detalles-label" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content detalles-trip-modal">
                    <div class="modal-header border-bottom-0">
                        <h1 class="modal-title fs-5" id="modal-detalles-label">Detalles del viaje</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4 align-items-start">
                            <div class="col-12 col-lg-5">
                                <div class="card border-0 h-100 shadow-sm overflow-hidden" style={{ background: viaje.color }}>
                                    <div class="card-body p-0">
                                        <div class="card-viaje-media" style={{ minHeight: '308px', backgroundImage: `url('${viaje.imagen}')` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-lg-7">
                                <div class="d-flex flex-wrap gap-2 mb-3">
                                    <span class="badge rounded-pill" style={{ background: viaje.color, color: '#fff' }}>{viaje.estado}</span>
                                </div>
                                <h2 class="h3 mb-2">{viaje.ciudad}</h2>
                                <p class="text-muted mb-4">{viaje.pais}</p>
                                <div class="row g-3 mb-4">
                                    <div class="col-sm-6">
                                        <div class="p-3 rounded-3 border bg-light h-100">
                                            <small class="text-uppercase text-muted d-block mb-1">Fecha de ida</small>
                                            <strong>{formatearFecha(viaje.ida)}</strong>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="p-3 rounded-3 border bg-light h-100">
                                            <small class="text-uppercase text-muted d-block mb-1">Fecha de vuelta</small>
                                            <strong>{formatearFecha(viaje.vuelta)}</strong>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="p-3 rounded-3 border bg-light h-100">
                                            <small class="text-uppercase text-muted d-block mb-1">Duración del viaje</small>
                                            <strong>{viaje.dias} días</strong>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="p-3 rounded-3 border bg-light h-100">
                                            <small class="text-uppercase text-muted d-block mb-1">Presupuesto est.</small>
                                            <strong>${viaje.presupuesto}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-3 rounded-3 border mt-3">
                            <small class="text-uppercase text-muted d-block mb-2">Notes</small>
                            <p class="mb-0">{viaje.notas || "Sin notas adicionales."}</p>
                        </div>
                    </div>
                    <div class="modal-footer border-top-0">
                        <button class="btn btn-primary boton-verde" data-bs-toggle="modal" data-bs-target="#modal-form" onClick={onEditarClick}>
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={onEliminarClick}>
                            <i class="bi bi-trash3-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}