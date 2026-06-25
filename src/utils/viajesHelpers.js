// Convertir fechas strings (YYYY-MM-DD) a objeto Date en zona horaria local
export function fechaLocal(fecha) {
    if (!fecha) return new Date();
    const [anio, mes, dia] = fecha.split("-");
    return new Date(anio, mes - 1, dia);
}

// Calcular días del viaje
export function calcularDias(ida, vuelta) {
    if (!ida || !vuelta) return 0;
    const fecha_ida = fechaLocal(ida);
    const fecha_vuelta = fechaLocal(vuelta);
    const diferencia = fecha_vuelta - fecha_ida;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
}

// Formatea fechas para mostrarlas en pantalla (Ej: 25 Jun, 2026)
export function formatearFecha(fecha) {
    if (!fecha) return "";
    const f = fechaLocal(fecha);
    const dia = f.getDate();
    const mes = f.getMonth();
    const anio = f.getFullYear();
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${dia} ${meses[mes]}, ${anio}`;
}

// Determinar el estado dinámicamente según la fecha actual
export function obtenerEstadoViaje(ida, vuelta) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fIda = fechaLocal(ida);
    const fVuelta = fechaLocal(vuelta);

    if (hoy < fIda) return "Pendiente";
    if (hoy >= fIda && hoy <= fVuelta) return "En curso";
    return "Completado";
}