import React, { useState, useEffect } from 'react';
import { calcularDias, fechaLocal } from '../utils/viajesHelpers';

export default function ModalFormulario({ viajeAEditar, onGuardar, viajesExistentes }) {
    const [formData, setFormData] = useState({
        pais: '', ciudad: '', bandera: '', ida: '', vuelta: '', presupuesto: '', notas: '', color: '#4b9f73'
    });
    const [imagen, setImagen] = useState('https://placehold.net/default.svg');

    //Almacenamiento de paises y ciudades en Select
    const [paises, setPaises] = useState([]);
    const [ciudades, setCiudades] = useState([]);

    const BASE_URL = 'https://countriesnow.space/api/v0.1/countries';

    useEffect(() => {
        fetch(BASE_URL)
            .then(res => res.json())
            .then(data => {
                if (data && data.data) {
                    setPaises(data.data);
                }
            })
            .catch(err => console.error("Error al cargar países:", err));
    }, []);

    useEffect(() => {
        const paisSeleccionado = formData.pais;

        if (!paisSeleccionado) {
            setCiudades([]);
            setFormData(prev => ({ ...prev, bandera: '' }));
            return;
        }

        // Usamos esto para buscar las Ciudades
        fetch(`${BASE_URL}/cities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: paisSeleccionado })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.error && data.data) {
                setCiudades(data.data);
            } else {
                setCiudades([]);
            }
        })
        .catch(err => console.error("Fallo en encontrar ciudades:", err));

        // Usamos esto para buscar la Bandera
        fetch(`${BASE_URL}/flag/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: paisSeleccionado })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.error && data.data) {
                setFormData(prev => ({ ...prev, bandera: data.data.flag }));
            }
        })
        .catch(err => console.error("Fallo en encontrar bandera:", err));

    }, [formData.pais]);

    // Efecto para rellenar los campos si estamos editando
    useEffect(() => {
        if (viajeAEditar) {
            setFormData({
                pais: viajeAEditar.pais || '',
                ciudad: viajeAEditar.ciudad || '',
                bandera: viajeAEditar.bandera || '',
                ida: viajeAEditar.ida || '',
                vuelta: viajeAEditar.vuelta || '',
                presupuesto: viajeAEditar.presupuesto || '',
                notas: viajeAEditar.notas || '',
                color: viajeAEditar.color || '#4b9f73',
                estado: viajeAEditar.estado || 'pendiente'
            });
            setImagen(viajeAEditar.imagen || 'https://placehold.net/default.svg');
        } else {
            // Modo creación / Reset del formulario
            setFormData({ 
                pais: '', ciudad: '', bandera: '', ida: '', 
                vuelta: '', presupuesto: '', notas: '', color: '#4b9f73', estado: 'pendiente' 
            });
            setImagen('https://placehold.net/default.svg');
        }
    }, [viajeAEditar]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        
        if (id === 'pais') {
            // Si cambia el país, reseteamos la ciudad y la bandera temporalmente
            setFormData(prev => ({ ...prev, pais: value, ciudad: '', bandera: '' }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
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
            id: viajeAEditar ? viajeAEditar.id : Date.now(),
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
        <div className="modal fade" id="modal-form" tabIndex="-1" aria-labelledby="modal-form-label" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content edit-trip-modal">
                    <div className="modal-header border-bottom-0">
                        <h1 className="modal-title fs-5" id="modal-form-label">
                            {viajeAEditar ? "Editar viaje" : "Crear viaje"}
                        </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form id="form-modal" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="form-section justify-content-center col-lg-6">
                                    <label className="form-label">Vista previa</label>
                                    <div className="preview-imagen card-viaje-media" style={{ backgroundImage: `url('${imagen}')` }}>
                                        <span className="placa-viaje" style={{ background: formData.color }}>
                                            {formData.pais || "País"}
                                            {formData.bandera && (
                                                <img 
                                                    src={formData.bandera} 
                                                    alt="Bandera" 
                                                    style={{ width: '20px', marginLeft: '8px', display: 'inline-block', verticalAlign: 'middle' }} 
                                                />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="form-section col-lg-6">
                                    <label htmlFor="imagen-viaje" className="form-label">Cargar nueva imagen</label>
                                    <div className="image-upload-wrapper">
                                        <input type="file" className="form-control" id="imagen-viaje" accept="image/*" onChange={handleImagenChange} />
                                        <small className="form-text text-muted">JPG, PNG o GIF. Tamaño máximo 5MB.</small>
                                    </div>
                                    <label htmlFor="color" className="form-label mt-3">Color de la tarjeta</label>
                                    <input type="color" className="form-control color-picker-input-large" id="color" value={formData.color} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="form-section col-md-6">
                                    <label htmlFor="pais" className="form-label">País</label>
                                    <select 
                                        className="form-select" 
                                        id="pais" 
                                        value={formData.pais} 
                                        onChange={handleChange} 
                                        required
                                    >
                                        <option value="">Seleccione País</option>
                                        {paises.map((c) => (
                                            <option key={c.country} value={c.country}>{c.country}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-section col-md-6">
                                    <label htmlFor="ciudad" className="form-label">Ciudad/es</label>
                                    <select 
                                        className="form-select" 
                                        id="ciudad" 
                                        value={formData.ciudad} 
                                        onChange={handleChange} 
                                        required
                                        disabled={!formData.pais || ciudades.length === 0}
                                    >
                                        <option value="">
                                            {!formData.pais ? "Primero seleccione un país" : "Seleccione Ciudad"}
                                        </option>
                                        {ciudades.map((city) => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="form-section col-md-4">
                                    <label htmlFor="ida" className="form-label">Fecha de ida</label>
                                    <input type="date" className="form-control" id="ida" value={formData.ida} onChange={handleChange} required />
                                </div>
                                <div className="form-section col-md-4">
                                    <label htmlFor="vuelta" className="form-label">Fecha de vuelta</label>
                                    <input type="date" className="form-control" id="vuelta" value={formData.vuelta} onChange={handleChange} required />
                                </div>
                                <div className="form-section col-md-4">
                                    <label htmlFor="presupuesto" className="form-label">Presupuesto estimado</label>
                                    <input type="number" className="form-control" id="presupuesto" value={formData.presupuesto} onChange={handleChange} placeholder="Ej: 1200" required />
                                </div>
                            </div>
                            <div className="form-section mt-3">
                                <label htmlFor="notas" className="form-label">Notas</label>
                                <textarea className="form-control" id="notas" rows="3" value={formData.notas} onChange={handleChange} placeholder="Ej: Preferencias de alojamiento..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer border-top-0">
                        <button className="btn btn-primary boton-verde" type="submit" form="form-modal">
                            <i className="bi bi-floppy2-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}