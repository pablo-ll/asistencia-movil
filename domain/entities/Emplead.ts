export interface Solicitud {
    id: number;
    tipo: string;
    fechaInicio: string;
    fechaFin: string;
    estado: string;
    comprobanteBajaMedica: string;
    descripcion: string;
    comentario: string | null;
    createdAt:string;
  }
  
  export interface Asistencia {
    id: number;
    fecha: string;
    horaEntrada: string;
    horaSalidaAlmuerzo: string;
    horaEntradaAlmuerzo: string;
    horaSalida: string;
  }
  
  
  
  
  export interface Empleado {
    id: number;
    cedula: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    fotografia: string;
    diasVacacionesDisponibles: number;
    solicitudes: Solicitud[];
  
  }
  