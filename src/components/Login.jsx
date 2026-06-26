import { useState } from "react";
import { auth } from "../utils/firebase";
import logo from "../assets/logo.png";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

const errorMessages = {
  "auth/user-not-found": "No existe una cuenta con ese email.",
  "auth/wrong-password": "Contraseña incorrecta.",
  "auth/email-already-in-use": "Ya existe una cuenta con ese email.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/invalid-email": "El email no es válido.",
  "auth/too-many-requests": "Demasiados intentos. Intentá más tarde.",
  "auth/popup-closed-by-user": "Cerraste la ventana de Google sin iniciar sesión.",
  "auth/invalid-credential": "Email o contraseña incorrectos.",
};

const getErrorMessage = (code) =>
  errorMessages[code] || "Ocurrió un error. Intentá de nuevo.";

export default function Login({ onSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("modo actual:", mode); // agregá esta línea

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Completá todos los campos.");
    setLoading(true);
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      onSuccess?.(result.user);
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Completá todos los campos.");
    setLoading(true);
    setError("");
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      onSuccess?.(result.user);
    } catch (err) {
      setError(getErrorMessage(err.code));
      console.log(err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onSuccess?.(result.user);
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="login-card p-4 p-sm-5 m-3">

        <div className="text-center mb-4">
          <img src={logo} alt="Bon Voyage" className="img-fluid" style={{ maxHeight: "55px", objectFit: "contain" }} />
        </div>

        {error && (
          <div className="alert alert-danger text-center small py-2">{error}</div>
        )}

        {/* LOGIN */}
        {mode === "login" && (
          <div id="login-box" className="form-box active">
            <h2 className="text-center brand-title h4 mb-2">¡Hola, viajero!</h2>
            <p className="text-center text-muted small mb-4">Ingresá tus datos para planificar tu próxima aventura</p>

            <form onSubmit={handleEmailLogin}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control form-control-bv"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ejemplo@correo.com"
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">Contraseña</label>
                <input
                  type="password"
                  className="form-control form-control-bv"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-bv-green w-100 py-25 shadow-sm" disabled={loading}>
                {loading ? "Cargando..." : "Iniciar Sesión"}
              </button>
            </form>

            <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1 text-muted opacity-25" />
              <span className="mx-3 text-muted small">o continúa con</span>
              <hr className="flex-grow-1 text-muted opacity-25" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="btn btn-google w-100 d-flex align-items-center justify-content-center shadow-sm py-2"
              disabled={loading}
            >
              <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <path fill="#ea4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3A11.91 11.91 0 0 0 12 0C7.27 0 3.16 2.582 1.018 6.395z"/>
                <path fill="#4285f4" d="M16.04 15.345c-1.037.691-2.4 1.127-4.04 1.127a7.077 7.077 0 0 1-6.734-4.855L1.704 15.19A11.91 11.91 0 0 0 12 24c3.273 0 6.245-1.118 8.577-3.055z"/>
                <path fill="#fbbc05" d="M5.266 14.235A7.14 7.14 0 0 1 4.91 12c0-.791.136-1.55.356-2.235L1.704 6.395A11.95 11.95 0 0 0 0 12c0 2.05.518 3.978 1.432 5.66z"/>
                <path fill="#34a853" d="M23.49 10.036H12v4.745h6.605c-.341 1.636-1.4 2.873-2.873 3.755l3.864 3.01c2.259-2.09 3.564-5.173 3.564-8.81c0-.58-.055-1.154-.164-1.7z"/>
              </svg>
              Google
            </button>

            <div className="text-center mt-4">
              <p className="mb-0 text-muted small">
                ¿Nuevo en Bon Voyage?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("register"); setError(""); }} className="switch-link">
                  Regístrate aquí
                </a>
              </p>
            </div>
          </div>
        )}

        {/* REGISTRO */}
        {mode === "register" && (
          <div id="register-box" className="form-box active">
            <h2 className="text-center brand-title h4 mb-2">Comienza a viajar</h2>
            <p className="text-center text-muted small mb-4">Crea una cuenta para guardar todos tus itinerarios</p>

            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Nombre Completo</label>
                <input
                  type="text"
                  className="form-control form-control-bv"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Tu nombre y apellido"
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control form-control-bv"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ejemplo@correo.com"
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">Contraseña</label>
                <input
                  type="password"
                  className="form-control form-control-bv"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-bv-green w-100 py-25 shadow-sm" disabled={loading}>
                {loading ? "Cargando..." : "Crear Cuenta"}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="mb-0 text-muted small">
                ¿Ya tienes una cuenta?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("login"); setError(""); }} className="switch-link">
                  Inicia sesión
                </a>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}