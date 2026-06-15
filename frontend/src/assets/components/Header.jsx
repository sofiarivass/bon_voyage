import React from "react";

function Header(){
    return(
        <>
        <header>
            <nav className="navbar justify-content-center">
                <div className="container-fluid justify-content-center">

                    <img src="/src/assets/logo.png" className="Logo Bon Voyage" width="240" height="auto" alt="Logo" />
                </div>
            </nav>
        </header>
        </>
    );
}

export default Header;