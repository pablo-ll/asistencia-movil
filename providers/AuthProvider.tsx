import { PropsWithChildren, useEffect, useState } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/store/auth/useAuthStore';
import { LoadingScreen } from '@/components/LoadingScreen';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const navigation = useNavigation();
  const { checkStatus, status } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  // Verificar el estado de autenticación al montar el componente
  useEffect(() => {
    const verifyAuthStatus = async () => {
        console.log('Iniciando verificación del estado...');
      await checkStatus();
      console.log('verificado');
      setIsReady(true); // Indica que la verificación ha terminado
    };
    verifyAuthStatus();
  }, []);

  // Redirección basada en el estado de autenticación
  useEffect(() => {
    if (isReady && status !== 'checking') {
      if (status === 'authenticated') {
        navigation.dispatch(CommonActions.reset({
          routes: [{ key: "(app)", name: "(app)" }],
        }));
      } else {
        navigation.dispatch(CommonActions.reset({
          routes: [{ key: "login", name: "login" }],
        }));
      }
    }
  }, [isReady, status]);

  // Mostrar un indicador de carga mientras se verifica el estado
  if (!isReady || status === 'checking') {
    return <LoadingScreen />; // Una pantalla de carga mientras se verifica la autenticación
  }

  return <>{children}</>;
};
