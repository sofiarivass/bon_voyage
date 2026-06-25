import React from 'react';
import { formatearFecha } from '../utils/viajesHelpers';

export default function ModalDetalles({ viaje, onEditarClick, onEliminarClick }) {
    if (!viaje) return null;

    return (
        <div className="modal fade" id="modal-detalles" tabIndex="-1" aria-labelledby="modal-detalles-label" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content detalles-trip-modal">
                    <div className="modal-header border-bottom-0">
                        <h1 className="modal-title fs-5" id="modal-detalles-label">Detalles del viaje</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-4 align-items-start">
                            <div className="col-12 col-lg-5">
                                <div className="card border-0 h-100 shadow-sm overflow-hidden" style={{ background: viaje.color }}>
                                    <div className="card-body p-0">
                                        <div className="card-viaje-media" style={{ minHeight: '308px', backgroundImage: `url('${viaje.imagen}')` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-7">
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    <span className="badge rounded-pill text-capitalize" style={{ background: viaje.color, color: '#fff' }}>
                                        {viaje.estado}
                                    </span>
                                </div>
                                <h2 className="h3 mb-2">{viaje.ciudad}</h2>
                                <p className="text-muted mb-4 d-flex align-items-center gap-2">
                                    {viaje.pais}
                                    {viaje.bandera && (
                                        <img 
                                            src={viaje.bandera} 
                                            alt={`Bandera de ${viaje.pais}`} 
                                            style={{ width: '24px', borderRadius: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} 
                                        />
                                    )}
                                </p>

                                <div className="row g-3 mb-4">
                                    <div className="col-sm-6">
                                        <div className="p-3 rounded-3 border bg-light h-100">
                                            <small className="text-uppercase text-muted d-block mb-1">Fecha de ida</small>
                                            <strong>{formatearFecha(viaje.ida)}</strong>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="p-3 rounded-3 border bg-light h-100">
                                            <small className="text-uppercase text-muted d-block mb-1">Fecha de vuelta</small>
                                            <strong>{formatearFecha(viaje.vuelta)}</strong>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="p-3 rounded-3 border bg-light h-100">
                                            <small className="text-uppercase text-muted d-block mb-1">Duración del viaje</small>
                                            <strong>{viaje.dias} {viaje.dias === 1 ? 'día' : 'días'}</strong>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="p-3 rounded-3 border bg-light h-100">
                                            <small className="text-uppercase text-muted d-block mb-1">Presupuesto est.</small>
                                            <strong>${Number(viaje.presupuesto).toLocaleString()}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-3 rounded-3 border mt-3">
                            <small className="text-uppercase text-muted d-block mb-2">Notas</small>
                            <p className="mb-0">{viaje.notas || "Sin notas adicionales."}</p>
                        </div>
                    </div>
                    <div className="modal-footer border-top-0">
                        <button className="btn btn-primary boton-verde" data-bs-toggle="modal" data-bs-target="#modal-form" onClick={onEditarClick}>
                            <i className="bi bi-pencil-square"></i>
                        </button>
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={onEliminarClick}>
                            <i className="bi bi-trash3-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}