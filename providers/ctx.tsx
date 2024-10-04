import { PropsWithChildren, useEffect } from 'react';
import { useAuthStore } from '@/store/auth/useAuthStore';

export function useSession() {
  const { checkStatus, status, logout } = useAuthStore();

  useEffect(() => {
    checkStatus(); 
  }, [])
  

}

export function SessionProvider({ children }: PropsWithChildren) {
  // No necesitas un contexto si estás usando Zustand

  return (
    <>
      {children}
    </>
  );
}
