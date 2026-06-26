import React from 'react';

export default function Header({ user, onLogout }) {
    const nombre = user?.displayName || user?.email?.split("@")[0] || "viajero";

    return (
        <header>
            <nav className="navbar justify-content-center">
                <div className="container-fluid justify-content-between">
                    <a className="navbar-brand mx-auto">
                        <img src="./src/assets/logo.png" alt="Logo Bon Voyage" width="240" height="auto" />
                    </a>
                    <div className="d-flex align-items-center gap-2">
                        <span className="small text-muted fw-semibold d-none d-sm-inline">
                            {nombre}
                        </span>
                        <button
                            onClick={onLogout}
                            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        >
                            <i className="bi bi-box-arrow-right me-1"></i>
                            Salir
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}