import React from 'react';

export default function Dashboard({ viajes }) {
    // Cálculos basados en el estado actual de los viajes
    const calculos = viajes.reduce((acumulador, viaje) => {
        if (viaje.estado === "Pendiente" || viaje.estado === "En curso") {
            acumulador.planificados++;
        } else if (viaje.estado === "Completado") {
            acumulador.completados++;
        }
        acumulador.total += parseFloat(viaje.presupuesto) || 0;
        acumulador.dias += viaje.dias || 0;
        return acumulador;
    }, { planificados: 0, completados: 0, total: 0, dias: 0 });

    return (
        <section id="dashboard">
            <h1>¡Hola, viajero!</h1>
            <p class="p-color">Resumen de tu actividad</p>

            <div class="row g-3 mt-1 dashboard-cards">
                <div class="col-12 col-sm-6 col-xl-3">
                    <article class="card dashboard-card dashboard-card-planificados border-0 h-100">
                        <div class="card-body d-flex gap-3 align-items-start">
                            <span class="dashboard-icon"><i class="bi bi-airplane"></i></span>
                            <div>
                                <p id="viajes-planificados" class="dashboard-card-valor">{calculos.planificados}</p>
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
                                <p id="viajes-completados" class="dashboard-card-valor">{calculos.completados}</p>
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
                                <p id="presupuesto-total" class="dashboard-card-valor">${calculos.total}</p>
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
                                <p id="dias-totales" class="dashboard-card-valor">{calculos.dias}</p>
                                <p class="dashboard-card-texto">Días de viaje en total</p>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}