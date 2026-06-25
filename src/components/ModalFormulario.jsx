import React, { useState, useEffect } from 'react';
import { calcularDias, fechaLocal } from '../utils/viajesHelpers';

export default function ModalFormulario({ viajeAEditar, onGuardar, viajesExistentes }) {
    const [formData, setFormData] = useState({
        pais: '', ciudad: '', ida: '', vuelta: '', presupuesto: '', notas: '', color: '#4b9f73'
    });
    const [imagen, setImagen] = useState('https://placehold.net/default.svg');

    // Efecto para rellenar los campos si estamos editando
    useEffect(() => {
        if (viajeAEditar) {
            setFormData({
                pais: viajeAEditar.pais,
                ciudad: viajeAEditar.ciudad,
                ida: viajeAEditar.ida,
                vuelta: viajeAEditar.vuelta,
                presupuesto: viajeAEditar.presupuesto,
                notas: viajeAEditar.notas,
                color: viajeAEditar.color
            });
            setImagen(viajeAEditar.imagen);
        } else {
            setFormData({ pais: '', ciudad: '', ida: '', vuelta: '', presupuesto: '', notas: '', color: '#4b9f73' });
            setImagen('https://placehold.net/default.svg');
        }
    }, [viajeAEditar]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setImagen(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const fIda = fechaLocal(formData.ida);
        const fVuelta = fechaLocal(formData.vuelta);

        if (fVuelta < fIda) {
            alert("La fecha de vuelta no puede ser anterior a la fecha de ida");
            return;
        }

        // Validar solapamientos
        const solapado = viajesExistentes.some(v => {
            if (viajeAEditar && v.id === viajeAEditar.id) return false;
            return fIda <= fechaLocal(v.vuelta) && fVuelta >= fechaLocal(v.ida);
        });

        if (solapado) {
            alert("Ya tenés un viaje en esas fechas");
            return;
        }

        // Armamos el objeto final mapeado
        const viajeFinal = {
            id: viajeAEditar ? viajeAEditar.id : crypto.randomUUID(),
            imagen,
            dias: calcularDias(formData.ida, formData.vuelta),
            ...formData
        };

        onGuardar(viajeFinal);

        // Ocultar modal programáticamente con Bootstrap nativo
        const modalEl = document.getElementById('modal-form');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    };

    return (
        <div class="modal fade" id="modal-form" tabIndex="-1" aria-labelledby="modal-form-label" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content edit-trip-modal">
                    <div class="modal-header border-bottom-0">
                        <h1 class="modal-title fs-5" id="modal-form-label">
                            {viajeAEditar ? "Editar viaje" : "Crear viaje"}
                        </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="form-modal" onSubmit={handleSubmit}>
                            <div class="row">
                                <div class="form-section justify-content-center col-lg-6">
                                    <label class="form-label">Vista previa</label>
                                    <div class="preview-imagen card-viaje-media" style={{ backgroundImage: `url('${imagen}')` }}>
                                        <span class="placa-viaje" style={{ background: formData.color }}>
                                            {formData.pais || "País"}
                                        </span>
                                    </div>
                                </div>
                                <div class="form-section col-lg-6">
                                    <label htmlFor="imagen-viaje" class="form-label">Cargar nueva imagen</label>
                                    <div class="image-upload-wrapper">
                                        <input type="file" class="form-control" id="imagen-viaje" accept="image/*" onChange={handleImagenChange} />
                                        <small class="form-text text-muted">JPG, PNG o GIF. Tamaño máximo 5MB.</small>
                                    </div>
                                    <label htmlFor="color" class="form-label mt-3">Color de la tarjeta</label>
                                    <input type="color" class="form-control color-picker-input-large" id="color" value={formData.color} onChange={handleChange} />
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="form-section col-md-6">
                                    <label htmlFor="pais" class="form-label">País</label>
                                    <input type="text" class="form-control" id="pais" value={formData.pais} onChange={handleChange} placeholder="Ej: Francia" required />
                                </div>
                                <div class="form-section col-md-6">
                                    <label htmlFor="ciudad" class="form-label">Ciudad/es</label>
                                    <input type="text" class="form-control" id="ciudad" value={formData.ciudad} onChange={handleChange} placeholder="Ej: París y Lyon" required />
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="form-section col-md-4">
                                    <label htmlFor="ida" class="form-label">Fecha de ida</label>
                                    <input type="date" class="form-control" id="ida" value={formData.ida} onChange={handleChange} required />
                                </div>
                                <div class="form-section col-md-4">
                                    <label htmlFor="vuelta" class="form-label">Fecha de vuelta</label>
                                    <input type="date" class="form-control" id="vuelta" value={formData.vuelta} onChange={handleChange} required />
                                </div>
                                <div class="form-section col-md-4">
                                    <label htmlFor="presupuesto" class="form-label">Presupuesto estimado</label>
                                    <input type="number" class="form-control" id="presupuesto" value={formData.presupuesto} onChange={handleChange} placeholder="Ej: 1200" required />
                                </div>
                            </div>
                            <div class="form-section mt-3">
                                <label htmlFor="notas" class="form-label">Notas</label>
                                <textarea class="form-control" id="notas" rows="3" value={formData.notas} onChange={handleChange} placeholder="Ej: Preferencias de alojamiento..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0">
                        <button class="btn btn-primary boton-verde" type="submit" form="form-modal">
                            <i class="bi bi-floppy2-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}