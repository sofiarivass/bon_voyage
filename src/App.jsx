import React, { useState, useEffect } from 'react';
import { auth } from './utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Filtros from './components/Filtros';
import ViajeCard from './components/ViajeCard';
import ModalDetalles from './components/ModalDetalles';
import ModalFormulario from './components/ModalFormulario';
import { obtenerEstadoViaje, fechaLocal } from './utils/viajesHelpers';

export default function App() {
    // Estado principal: carga inicial desde LocalStorage
    const [viajes, setViajes] = useState(() => {
        const guardados = localStorage.getItem("viajes");
        return guardados ? JSON.parse(guardados) : [];
    });

    const [filtro, setFiltro] = useState("todos");
    const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
    const [editandoViaje, setEditandoViaje] = useState(null);
    const [user, setUser] = useState(null);

    // Efecto para sincronizar con LocalStorage y recalcular estados de tiempo reales continuamente
    useEffect(() => {
        const viajesActualizados = viajes.map(v => ({
            ...v,
            estado: obtenerEstadoViaje(v.ida, v.vuelta)
        }));
        
        // Evitamos bucles infinitos comparando strings
        if (JSON.stringify(viajes) !== JSON.stringify(viajesActualizados)) {
            setViajes(viajesActualizados);
        }
        localStorage.setItem("viajes", JSON.stringify(viajes));
    }, [viajes]);

    // Efecto para manejar la autenticación del usuario
    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
    });
    return () => unsubscribe();
    }, []);

    // Manejar inserción o actualización de viajes
    const handleGuardarViaje = (viajeEditado) => {
        const existe = viajes.some(v => v.id === viajeEditado.id);
        if (existe) {
            setViajes(viajes.map(v => v.id === viajeEditado.id ? viajeEditado : v));
        } else {
            setViajes([...viajes, viajeEditado]);
        }
    };

    // Manejar eliminación de viajes con confirmación
    const handleEliminarViaje = () => {
        if (viajeSeleccionado && window.confirm("¿Seguro que querés eliminar este viaje?")) {
            setViajes(viajes.filter(v => v.id !== viajeSeleccionado.id));
            setViajeSeleccionado(null);
        }
    };

    // Filtrado y ordenamiento de viajes por fecha de ida
    const viajesFiltrados = viajes
        .filter(v => {
            if (filtro === "todos") return true;
            return v.estado.toLowerCase().replace(" ", "_") === filtro;
        })
        .sort((a, b) => fechaLocal(a.ida) - fechaLocal(b.ida));


    if (!user) {
        return <Login onSuccess={(u) => setUser(u)} />;
    }
    return (
        <>
            <Header user={user} onLogout={() => signOut(auth)} />
            <main>
                <div class="container">
                    <Dashboard viajes={viajes} user={user} />
                    
                    <section id="viajes">
                        <Filtros 
                            filtroSeleccionado={filtro} 
                            setFiltroSeleccionado={setFiltro} 
                            onNuevoViajeClick={() => setEditandoViaje(null)}
                        />

                        <div id="viajes-container" class="row g-3">
                            {viajes.length === 0 ? (
                                <p id="no-viajes">No tenés viajes planificados</p>
                            ) : viajesFiltrados.length === 0 ? (
                                <p id="no-viajes">No hay viajes para este filtro</p>
                            ) : (
                                viajesFiltrados.map(viaje => (
                                    <ViajeCard 
                                        key={viaje.id} 
                                        viaje={viaje} 
                                        onClick={() => setViajeSeleccionado(viaje)} 
                                    />
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </main>

            {/* Modales globales controlados por el estado de React */}
            <ModalDetalles 
                viaje={viajeSeleccionado} 
                onEditarClick={() => setEditandoViaje(viajeSeleccionado)}
                onEliminarClick={handleEliminarViaje}
            />

            <ModalFormulario 
                viajeAEditar={editandoViaje}
                onGuardar={handleGuardarViaje}
                viajesExistentes={viajes}
            />
        </>
    );
}