import { asistenciaApi } from "@/config/asistenciaApi"
import { Solicitud } from "@/domain/entities/Solicitud";



export const saveSolicitud = async (solicitud: Partial<Solicitud>): Promise<Solicitud> => {
    try {
      const { data } = await asistenciaApi.post<Solicitud>(`/solicitudes/crear`, solicitud);
      console.log(data, 'data');
      return data; // Asegúrate de que siempre se devuelve un valor de tipo `Solicitud`.
    } catch (error) {
      console.log(error);
      throw new Error("Error al guardar la solicitud"); // Lanza un error si algo falla.
    }
  };

export const deleteSolicitud = async ( id: number) =>{

    try{
        const { data } = await asistenciaApi.delete<Solicitud>(`/solicitudes/eliminar/${id}`);
        console.log(data, 'data');
        return data;


    }catch (error){
        console.log(error);

    }
    
}