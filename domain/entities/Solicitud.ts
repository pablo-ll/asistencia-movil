export interface Solicitud {
    id?: number;
    tipo: string;
    fechaInicio: string;
    fechaFin: string;
    estado?: string;
    comprobanteBajaMedica?: string;
    descripcion: string;
    comentario?: string ;
    empleadoId: number;
    
  }
  