import { asistenciaApi } from '@/config/asistenciaApi'
import { User } from '@/domain/entities/User'
import { UserResponse } from '@/infrastructure/interface/auth.responses'



const returnUserToken =( data: UserResponse) => {

    const user: User = {
        id: data.id,
        username: data.username,
        message: data.message,
        status: data.status,
      
    }

    return {
        user: user,
        token: data.jwt,
    }
    
}

export const authLogin = async( username: string, password: string) => {

    try {
        const {data} = await asistenciaApi.post<UserResponse>('/auth/log-in', {username, password});
        console.log(data,'data');
        return returnUserToken(data);
        
    } catch (error) {

        console.log(error);

        return null;
        
    }
  
}


export const authCheckToken = async() => {
    try {
        const {data} = await asistenciaApi.get<UserResponse>('/auth/revalidate');

        return returnUserToken(data);

    } catch (error) {

        console.log(error);
        return null;
    }

}

