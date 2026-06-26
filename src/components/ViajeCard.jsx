import React from 'react';
import { formatearFecha } from '../utils/viajesHelpers';

export default function ViajeCard({ viaje, onClick }) {
    return (
        <div class="col-12 col-md-6 col-lg-4" onClick={onClick}>
            <div data-bs-toggle="modal" data-bs-target="#modal-detalles" class="card-viaje-link">
                <article class="card card-viaje border-0 h-100">
                    <div class="card-viaje-media" style={{ backgroundImage: `url('${viaje.imagen}')` }}>
                        <span class="placa-viaje" style={{ background: viaje.color }}>
                            {viaje.pais}
                            {viaje.bandera && (
                                <img
                                    src={viaje.bandera}
                                    alt={`Bandera de ${viaje.pais}`}
                                    style={{ width: '20px', marginLeft: '8px', display: 'inline-block', verticalAlign: 'middle' }}
                                />
                            )}
                        </span>
                    </div>
                    <div class="card-body card-viaje-body">
                        <h2 class="titulo-viaje">{viaje.ciudad}</h2>
                        <p class="fechas-viaje">{formatearFecha(viaje.ida)} - {formatearFecha(viaje.vuelta)}</p>
                        <p class="precio-viaje" style={{ color: viaje.color, opacity: 0.6 }}>${viaje.presupuesto}</p>
                    </div>
                </article>
            </div>
        </div>
    );
}