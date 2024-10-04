
import { asistenciaApi } from "@/config/asistenciaApi"
import { EmpleadoResponse } from "@/infrastructure/interface/empleado.responses";
import { EmpleadoMapper } from "@/infrastructure/mappers/empleado.mapper";


export const getEmpleadoByUsuario = async ( id: number) =>{

    try{
        const { data } = await asistenciaApi.get<EmpleadoResponse>(`/empleados/buscar/usuario/${id}`);
        const empleado = EmpleadoMapper.EmpleadoResToEntity(data);
        console.log(empleado, 'data');
        return empleado;


    }catch (error){
        console.log(error);

    }
    
}