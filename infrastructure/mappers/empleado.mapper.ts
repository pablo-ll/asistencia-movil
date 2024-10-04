import { Empleado } from '@/domain/entities/Emplead';
import { EmpleadoResponse } from '../interface/empleado.responses';


export class EmpleadoMapper {

    static EmpleadoResToEntity(empleadoResponse: EmpleadoResponse):Empleado {

        return{

            id: empleadoResponse.id,
            cedula: empleadoResponse.cedula,
            nombre: empleadoResponse.nombre,
            apellidoPaterno: empleadoResponse.apellidoPaterno,
            apellidoMaterno: empleadoResponse.apellidoMaterno,
            email: empleadoResponse.email,
            fotografia: empleadoResponse.fotografia,
            diasVacacionesDisponibles: empleadoResponse.diasVacacionesDisponibles,
            solicitudes:empleadoResponse.solicitudes,
        }

    }
}