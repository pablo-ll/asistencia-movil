
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
    observaciones: string;
    ausente: boolean;
    permiso: boolean;
    correccion: boolean;
    esVacacion: boolean;
    esBajaMedica: boolean;
    llegadaTardeMañana: string;
    salidaTempranaMañana: string;
    llegadaTardeTarde: string;
    salidaTempranaTarde: string;
  }
  
  export interface Usuario {
    id: number;
    usuarionombre: string;
    contrasenia: string;
    roles: Role[];
    empleado: Empleado;
    providerId: string | null;
    provider: string | null;
    estado: boolean;
    fechaCreacion: string;
    fechaModificacion: string | null;
    creadoPor: string | null;
    modificadoPor: string | null;
    enabled: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    accountNonExpired: boolean;
  }
  
  export interface Role {
    id: number;
    nombre: string;
    permisos: Permiso[];
  }
  
  export interface Permiso {
    id: number;
    nombre: string;
  }
  
  export interface Empleado {
    id: number;
    cedula: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: string;
    genero: string;
    estadoCivil: string;
    direccion: string;
    telefono: string;
    email: string;
    estado: boolean;
    lugarExpedito: string;
    fotografia: string;
    apellidoCasada: string;
    antiguedad: number;
    diasVacacionesDisponibles: number;
    fechaCreacion: string;
    fechaModificacion: string;
    creadoPor: string;
    modificadoPor: string;
  }
  
  export interface EmpleadoResponse {
    id: number;
    cedula: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: string;
    genero: string;
    estadoCivil: string;
    direccion: string;
    telefono: string;
    email: string;
    estado: boolean;
    lugarExpedito: string;
    fotografia: string;
    apellidoCasada: string;
    departamentoId: number;
    cargoId: number;
    contrato: string | null;
    antiguedad: number;
    diasVacacionesDisponibles: number;
    solicitudes: Solicitud[];
    asistencias: Asistencia[];
    horariosSeleccionados: number[];
    usuario: Usuario;
    fechaCreacion: string | null;
    fechaModificacion: string | null;
    creadoPor: string | null;
    modificadoPor: string | null;
  }
  