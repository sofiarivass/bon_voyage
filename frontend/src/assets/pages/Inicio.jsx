import React, { useState, useEffect } from 'react';


function Inicio() {



    return (
        <>
            <main>
                <div className="container">
                    {/* SECTION: DASHBOARD */}
                    <section id="dashboard">
                        <h1>¡Hola, viajero!</h1>
                        <p className="p-color">Resumen de tu actividad</p>

                        <div className="row g-3 mt-1 dashboard-cards">
                            <div className="col-12 col-sm-6 col-xl-3">
                                <article className="card dashboard-card dashboard-card-planificados border-0 h-100">
                                    <div className="card-body d-flex gap-3 align-items-start">
                                        <span className="dashboard-icon"><i className="bi bi-airplane"></i></span>
                                        <div>
                                            <p className="dashboard-card-valor">{planificados}</p>
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
                                            <p className="dashboard-card-valor">{completados}</p>
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
                                            <p className="dashboard-card-valor">${presupuestoTotal.toFixed(2)}</p>
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
                                            <p className="dashboard-card-valor">{diasTotales} días</p>
                                            <p className="dashboard-card-texto">Días de viaje en total</p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </section>

                    {/* SECTION: VIAJES */}
                    <section id="viajes" className="mt-5">
                        <div className="viajes-header d-flex justify-content-between align-items-center mb-3">
                            <h1>Mis viajes</h1>
                            <div className="viajes-acciones d-flex gap-2">
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle boton-gris" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Filtrar viajes: {filtroSeleccionado.toUpperCase()}
                                    </button>
                                    <form id="form-filtros" className="dropdown-menu p-3">
                                        {["todos", "pendiente", "en_curso", "completado"].map((tipo) => (
                                            <div className="form-check" key={tipo}>
                                                <input 
                                                    type="radio" 
                                                    className="form-check-input" 
                                                    name="radioDefault" 
                                                    id={`filtro-${tipo}`}
                                                    checked={filtroSeleccionado === tipo}
                                                    onChange={() => setFiltroSeleccionado(tipo)}
                                                />
                                                <label className="form-check-label" htmlFor={`filtro-${tipo}`}>
                                                    {tipo.replace("_", " ").charAt(0).toUpperCase() + tipo.replace("_", " ").slice(1)}
                                                </label>
                                            </div>
                                        ))}
                                    </form>
                                </div>
                                <button 
                                    className="btn btn-primary boton-verde" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#modal-form" 
                                    onClick={handleNuevoViajeClick}
                                >
                                    Nuevo viaje
                                </button>
                            </div>
                        </div>

                        {/* Renderizado dinámico de las Tarjetas/Cards */}
                        <div id="viajes-container" className="row g-3">
                            {viajesFiltrados.length === 0 ? (
                                <p className="text-muted text-center my-4">No hay viajes cargados en esta categoría.</p>
                            ) : (
                                viajesFiltrados.map((v) => (
                                    <div className="col-12 col-md-6 col-lg-4" key={v.id}>
                                        <div 
                                            className="card h-100 trip-card" 
                                            style={{ borderTop: `5px solid ${v.color || '#ccc'}`, cursor: 'pointer' }}
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal-detalles"
                                            onClick={() => setViajeSeleccionado(v)}
                                        >
                                            <img src={v.imagen} className="card-img-top" alt={v.ciudad} style={{ height: '180px', objectFit: 'cover' }} />
                                            <div className="card-body">
                                                <span className={`badge mb-2 bg-${v.estado === 'Pendiente' ? 'warning text-dark' : v.estado === 'En curso' ? 'success' : 'secondary'}`}>
                                                    {v.estado}
                                                </span>
                                                <h5 className="card-title">{v.ciudad}, {v.pais}</h5>
                                                <p className="card-text small text-muted mb-1">
                                                    <i className="bi bi-calendar-event me-1"></i>
                                                    {formatearFecha(v.ida)} - {formatearFecha(v.vuelta)} ({v.dias} días)
                                                </p>
                                                <p className="fw-bold text-success">${v.presupuesto}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Modal ver detalles viaje */}
                        <div className="modal fade" id="modal-detalles" tabIndex="-1" aria-labelledby="modal-detalles-label" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content detalles-trip-modal">
                                    <div className="modal-header border-bottom-0">
                                        <h1 className="modal-title fs-5" id="modal-detalles-label">Detalles del viaje</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div id="modal-detalle-body" className="modal-body">
                                        {viajeSeleccionado ? (
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <img src={viajeSeleccionado.imagen} alt="Viaje" className="img-fluid rounded shadow-sm" />
                                                </div>
                                                <div className="col-md-7">
                                                    <h3>{viajeSeleccionado.ciudad}, {viajeSeleccionado.pais}</h3>
                                                    <p><strong>Estado:</strong> {viajeSeleccionado.estado}</p>
                                                    <p><strong>Fechas:</strong> {formatearFecha(viajeSeleccionado.ida)} al {formatearFecha(viajeSeleccionado.vuelta)} ({viajeSeleccionado.dias} días)</p>
                                                    <p><strong>Presupuesto total:</strong> ${viajeSeleccionado.presupuesto}</p>
                                                    {viajeSeleccionado.notas && (
                                                        <div className="mt-3 p-2 bg-light rounded">
                                                            <strong>Notas:</strong>
                                                            <p className="mb-0 small text-secondary">{viajeSeleccionado.notas}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <p>No se seleccionó ningún viaje.</p>
                                        )}
                                    </div>
                                    <div className="modal-footer border-top-0">
                                        <button 
                                            id="btn-editar-viaje" 
                                            className="btn btn-primary boton-verde" 
                                            data-bs-toggle="modal" 
                                            data-bs-target="#modal-form" 
                                            onClick={handleEditarViajeClick}
                                        >
                                            <i className="bi bi-pencil-square"></i> Editar
                                        </button>
                                        <button id="btn-eliminar-viaje" type="button" className="btn btn-danger" onClick={handleEliminarViaje}>
                                            <i className="bi bi-trash3-fill"></i> Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal crear/editar viaje */}
                        <div className="modal fade" id="modal-form" tabIndex="-1" aria-labelledby="modal-form-label" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content edit-trip-modal">
                                    <div className="modal-header border-bottom-0">
                                        <h1 className="modal-title fs-5" id="modal-form-label">{editando ? "Editar Viaje" : "Nuevo Viaje"}</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form id="form-modal" onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div id="vista-previa" className="form-section justify-content-center col-lg-6 text-center">
                                                    <img src={imagenActual} alt="Preview" className="img-thumbnail" style={{ maxHeight: "200px" }} />
                                                </div>

                                                <div className="form-section col-lg-6">
                                                    <label htmlFor="imagen-viaje" className="form-label">Cargar nueva imagen</label>
                                                    <div className="image-upload-wrapper">
                                                        <input type="file" className="form-control" id="imagen-viaje" accept="image/*" onChange={handleImagenChange} />
                                                        <small className="form-text text-muted">JPG, PNG o GIF. Tamaño máximo 5MB.</small>
                                                    </div>
                                                    
                                                    <label htmlFor="color" className="form-label mt-3">Color de la tarjeta</label>
                                                    <input 
                                                        type="color" 
                                                        className="form-control color-picker-input-large" 
                                                        id="color" 
                                                        value={formData.color} 
                                                        onChange={handleInputChange} 
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                <div className="form-section col-md-6">
                                                    <label htmlFor="pais" className="form-label">País</label>
                                                    <input type="text" className="form-control" id="pais" placeholder="Ej: Francia" required value={formData.pais} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-section col-md-6">
                                                    <label htmlFor="ciudad" className="form-label">Ciudad/es</label>
                                                    <input type="text" className="form-control" id="ciudad" placeholder="Ej: París y Lyon" required value={formData.ciudad} onChange={handleInputChange} />
                                                </div>
                                            </div>
                                            
                                            <div className="row mt-3">
                                                <div className="form-section col-md-4">
                                                    <label htmlFor="ida" className="form-label">Fecha de ida</label>
                                                    <input type="date" className="form-control" id="ida" required value={formData.ida} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-section col-md-4">
                                                    <label htmlFor="vuelta" className="form-label">Fecha de vuelta</label>
                                                    <input type="date" className="form-control" id="vuelta" required value={formData.vuelta} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-section col-md-4">
                                                    <label htmlFor="presupuesto" className="form-label">Presupuesto estimado</label>
                                                    <input type="number" className="form-control" id="presupuesto" placeholder="Ej: 1200" required value={formData.presupuesto} onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="form-section mt-3">
                                                <label htmlFor="notas" className="form-label">Notas</label>
                                                <textarea className="form-control" id="notas" rows="3" placeholder="Ej: Alojamiento..." value={formData.notas} onChange={handleInputChange}></textarea>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer border-top-0">
                                        <button className="btn btn-primary boton-verde" type="submit" form="form-modal">
                                            <i className="bi bi-floppy2-fill"></i> Guardar
                                        </button>
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