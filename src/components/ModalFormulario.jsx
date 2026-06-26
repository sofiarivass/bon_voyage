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

    // ---- ESTADOS PARA UNSPLASH ----
    const UNSPLASH_ACCESS_KEY = 'GL9Xc8f5pLKivzb4S_pZ0NX18zOSOfm7xP4F4S5zzVA';
    const [mostrarGaleria, setMostrarGaleria] = useState(false);
    const [busquedaUnsplash, setBusquedaUnsplash] = useState('');
    const [resultadosUnsplash, setResultadosUnsplash] = useState([]);
    const [cargandoUnsplash, setCargandoUnsplash] = useState(false);
    const [errorUnsplash, setErrorUnsplash] = useState('');

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

        // Limpiamos Unsplash al cambiar de viaje
        setMostrarGaleria(false);
        setBusquedaUnsplash('');
        setResultadosUnsplash([]);
        setErrorUnsplash('');

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

    // ---- FUNCIONES DE UNSPLASH ----

    const handleImgAleatoria = async () => {
        const query = `${formData.ciudad} ${formData.pais}`.trim();
        if (!query) {
            alert("Por favor, ingresá un país o ciudad primero para poder buscar una foto.");
            return;
        }

        try {
            const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape`;
            const respuesta = await fetch(url);
            if (!respuesta.ok) throw new Error("Error al obtener foto aleatoria");

            const foto = await respuesta.json();
            setImagen(foto.urls.regular); // Actualiza la imagen en React
        } catch (error) {
            console.error(error);
            alert("No se pudo encontrar una foto automática para este destino. ¡Probá con el buscador manual!");
        }
    };

    const toggleGaleriaUnsplash = () => {
        setMostrarGaleria(prev => {
            const abriendo = !prev;

            // Si estamos abriendo la galería, forzamos el nuevo texto de búsqueda
            if (abriendo) {
                const query = `${formData.ciudad} ${formData.pais}`.trim();
                setBusquedaUnsplash(query);
            }

            return abriendo;
        });
    };

    const buscarGaleriaUnsplash = async () => {
        if (!busquedaUnsplash.trim()) return;

        setCargandoUnsplash(true);
        setErrorUnsplash('');
        setResultadosUnsplash([]);

        try {
            const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(busquedaUnsplash)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=6&orientation=landscape`;
            const respuesta = await fetch(url);
            if (!respuesta.ok) throw new Error("Error en la galería Unsplash");

            const datos = await respuesta.json();

            if (datos.results.length === 0) {
                setErrorUnsplash("No se encontraron imágenes.");
            } else {
                setResultadosUnsplash(datos.results);
            }
        } catch (error) {
            console.error(error);
            setErrorUnsplash("Error al conectar con la galería.");
        } finally {
            setCargandoUnsplash(false);
        }
    };

    // ---- SUBMIT DEL FORMULARIO ----

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
                                    <label className="form-label d-block">Imagen del viaje</label>

                                    {/* BOTONES DE IMAGENES */}
                                    <div className="d-flex flex-wrap gap-2 mb-2 mt-1">
                                        <label htmlFor="imagen-viaje" className="btn btn-custom-gris btn-sm mb-0 btn-redondeado">
                                            <i className="bi bi-upload"></i> Subir propia
                                        </label>
                                        <input type="file" id="imagen-viaje" accept="image/*" onChange={handleImagenChange} style={{ display: 'none' }} />

                                        <button type="button" className="btn btn-custom-azul btn-sm btn-redondeado" onClick={handleImgAleatoria}>
                                            <i className="bi bi-shuffle"></i> Aleatoria
                                        </button>

                                        <button type="button" className="btn btn-custom-verde btn-sm btn-redondeado" onClick={toggleGaleriaUnsplash}>
                                            <i className="bi bi-search"></i> Buscar en Unsplash
                                        </button>
                                    </div>

                                    {/* BUSCADOR Y GALERIA UNSPLASH CONDICIONAL */}
                                    {mostrarGaleria && (
                                        <div className="border rounded p-2 bg-light">
                                            <div className="input-group input-group-sm mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Ej: Playa, París..."
                                                    value={busquedaUnsplash}
                                                    onChange={(e) => setBusquedaUnsplash(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), buscarGaleriaUnsplash())}
                                                />
                                                <button className="btn btn-success" type="button" onClick={buscarGaleriaUnsplash}>
                                                    Buscar
                                                </button>
                                            </div>

                                            <div className="row g-1 row-cols-3 overflow-y-auto" style={{ maxHeight: '130px' }}>
                                                {cargandoUnsplash && <p className="col-12 text-muted text-center small py-2">Buscando opciones... 📸</p>}
                                                {errorUnsplash && <p className="col-12 text-danger text-center small py-2">{errorUnsplash}</p>}

                                                {!cargandoUnsplash && resultadosUnsplash.map((foto) => (
                                                    <div className="col" key={foto.id}>
                                                        <img
                                                            src={foto.urls.thumb}
                                                            className={`img-fluid rounded img-thumbnail ${imagen === foto.urls.regular ? 'border-primary border-3' : ''}`}
                                                            style={{ cursor: 'pointer', height: '55px', width: '100%', objectFit: 'cover' }}
                                                            alt={foto.alt_description || 'Foto Unsplash'}
                                                            onClick={() => setImagen(foto.urls.regular)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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