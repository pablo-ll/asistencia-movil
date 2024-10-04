import { authCheckToken, authLogin } from "@/actions/auth/auth";
import { StorageAdapter } from "@/config/storage-adapter";
import { User } from "@/domain/entities/User";
import { AuthStatus } from "@/infrastructure/interface/auth.status";
import { create } from "zustand";


export interface AuthState {
    status: AuthStatus;
    token?: string;
    user?: User;


    login: (username: string, password: string) => Promise<boolean>;
    checkStatus: () => Promise<boolean>;
    logout:() => Promise<void>;


    
   
}


export const useAuthStore = create<AuthState>()((set, get ) => ({
    status: 'checking',
    token: undefined,
    user: undefined,    

    login: async (username: string, password: string) => {
        const resp = await authLogin(username, password);

        if (!resp) {
            set({ status: 'unauthenticated', token: undefined, user: undefined });
            return false;
        }

        await StorageAdapter.setItem('token', resp.token);
       


        set({ status: 'authenticated', token: resp.token, user: resp.user });
        return true;
    },

    checkStatus: async () => {
        
        const resp = await authCheckToken();

        console.log('Token ckeck', {resp});
        if(!resp?.token) {
           
            set({ status: 'unauthenticated', token: undefined, user: undefined });
            return false;
        }
        console.log('Token válido, autenticando...', {resp});
        await StorageAdapter.setItem('token', resp.token);
        set({ status: 'authenticated', token: resp.token, user: resp.user });
        return true;
    },

    logout: async () => {
        await StorageAdapter.removeItem('token');
        set({ status: 'unauthenticated', token: undefined, user: undefined });
    }

    }))
