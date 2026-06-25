// Clase Viaje pura para estructurar los datos
export class Viaje {
    constructor(imagen, color, pais, ciudad, ida, vuelta, presupuesto, notas, estado) {
        this.id = Date.now();
        this.imagen = imagen;
        this.color = color;
        this.pais = pais;
        this.ciudad = ciudad;
        this.ida = ida;
        this.vuelta = vuelta;
        this.presupuesto = presupuesto;
        this.notas = notas;
        this.estado = estado;
        this.dias = calcularDias(ida, vuelta);
    }
}

// Convertir fechas a zona horaria local
export function fechaLocal(fecha) {
    if (!fecha) return new Date();
    let partes = fecha.split("-");
    return new Date(partes[0], partes[1] - 1, partes[2]);
}

// Calcular dias del viaje
export function calcularDias(ida, vuelta) {
    if (!ida || !vuelta) return 0;
    let fecha_ida = fechaLocal(ida);
    let fecha_vuelta = fechaLocal(vuelta);
    let diferencia = fecha_vuelta - fecha_ida;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
}

// Formatea fechas para mostrarlas en pantalla
export function formatearFecha(fecha) {
    if (!fecha) return "";
    let f = fechaLocal(fecha);
    let dia = f.getDate();
    let mes = f.getMonth();
    let anio = f.getFullYear();
    let meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return dia + " " + meses[mes] + ", " + anio;
}

// Cálculos del dashboard basados en el array de viajes que le pasemos
export function calculosDashboard(listaViajes) {
    let total = 0;
    let dias = 0;
    let planificados = 0;
    let completados = 0;

    if (!listaViajes || listaViajes.length === 0) {
        return { planificados, completados, total, dias };
    }

    for (let i = 0; i < listaViajes.length; i++) {
        if (listaViajes[i].estado === "Pendiente" || listaViajes[i].estado === "En curso") {
            planificados++;
        } else if (listaViajes[i].estado === "Completado") {
            completados++;
        }

        total += parseFloat(listaViajes[i].presupuesto) || 0;
        dias += listaViajes[i].dias || 0;
    }

    return { planificados, completados, total, dias };
}

// Determinar el estado dinámicamente según la fecha actual
export function obtenerEstadoViaje(ida, vuelta) {
    let hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizamos horas para comparar solo días
    let fIda = fechaLocal(ida);
    let fVuelta = fechaLocal(vuelta);

    if (hoy < fIda) {
        return "Pendiente";
    } else if (hoy >= fIda && hoy <= fVuelta) {
        return "En curso";
    } else {
        return "Completado";
    }
}