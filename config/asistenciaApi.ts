
import axios from 'axios';
import { StorageAdapter } from './storage-adapter';


export  const apiUrl = process.env.EXPO_PUBLIC_API_URL; 


const asistenciaApi =axios.create( {
   baseURL: apiUrl,
   headers: {
     'Content-Type': 'application/json',
   },
})

//TODO: Agregar interceptores
asistenciaApi.interceptors.request.use(async (config) => {
  const token = await StorageAdapter.getItem('token');

  if (token) {
    config.headers['Authorization']  = `Bearer ${token}`;
  }
  return config;
  
})


export {
    asistenciaApi, 
}