import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/logo.png'
import './assets/styles/style.css'
import './assets/components/main'

import Header from './assets/components/Header';
import Inicio from './assets/pages/Inicio';
import Footer from './assets/components/Footer';




function App() {

  return (
    <>
      <section id="center">

        <Router>
          <Header />

          <Routes>
            /*Aca iria el de Bienvenida*/
            <Route path='/' element={<Inicio />} />

          </Routes>

          <Footer />
        </Router>

      </section>

    </>
  )
}

export default App

            /*Router:es el contenedor principal/global que activa nomas la capacidad de navegacion en la app y conectar el codigo con la barra de direcciones del navegador */
            /*Routes:Es el selector, contenedor intermedio que agrupa las paginas posibles. que funciona como interruptor o selector, mira la url actul del navegador y decide cual de todas las rutas de su interior coincide para mostrar solo esa */
            /*Route:La pagina individual, es la ruta especifica, siempre necesita de dos datos claves El camino(path="/viajes") y el  componente que debe dibujar (element={Dashboard/}).*/

          /*  <Route path='/Bienvenida' element={<Bienvenida />} />*/