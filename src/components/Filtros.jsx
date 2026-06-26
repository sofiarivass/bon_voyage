import React from 'react';

export default function Filtros({ filtroSeleccionado, setFiltroSeleccionado, onNuevoViajeClick }) {
    const opciones = [
        { id: 'todos', label: 'Todos' },
        { id: 'pendiente', label: 'Pendientes' },
        { id: 'en_curso', label: 'En curso' },
        { id: 'completado', label: 'Completados' }
    ];

    return (
        <div class="viajes-header">
            <h1>Mis viajes</h1>
            <div class="viajes-acciones">
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle boton-gris" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Filtrar viajes
                    </button>
                    <form class="dropdown-menu p-3">
                        {opciones.map((opcion) => (
                            <div class="form-check" key={opcion.id}>
                                <input 
                                    type="radio" 
                                    class="form-check-input" 
                                    name="filtroViajes" 
                                    id={opcion.id} 
                                    checked={filtroSeleccionado === opcion.id}
                                    onChange={() => setFiltroSeleccionado(opcion.id)}
                                />
                                <label class="form-check-label" htmlFor={opcion.id}>{opcion.label}</label>
                            </div>
                        ))}
                    </form>
                </div>
                <button 
                    class="btn btn-primary boton-verde" 
                    data-bs-toggle="modal" 
                    data-bs-target="#modal-form" 
                    onClick={onNuevoViajeClick}
                >
                    Nuevo viaje
                </button>
            </div>
        </div>
    );
}