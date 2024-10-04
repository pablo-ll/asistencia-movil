import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet , Modal, Alert} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth/useAuthStore';
import { getEmpleadoByUsuario } from '@/actions/gestion/empleado';
import { Card, Text, Badge, ActivityIndicator, MD2Colors, Button } from 'react-native-paper';
import { Solicitud } from '@/domain/entities/Emplead';
import { deleteSolicitud } from '@/actions/gestion/solicitud';


export default function Page() {
  const { user } = useAuthStore();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null); // Tipado para la solicitud seleccionada

   console.log(user?.id, 'id')
   const queryClient = useQueryClient();

  const { isLoading, data: empleado, error } = useQuery({
    queryKey: ['empleado', user?.id],
    queryFn: () => getEmpleadoByUsuario(user?.id || 0),
    staleTime: 1000 * 60 * 60, // 1 hora
    retry: false,
    meta: {
      timeout: 10000, // 10 segundos
    },
  });


  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSolicitud(id),
    onSuccess: () => {
      // Invalida las consultas para que se actualicen los datos
      queryClient.invalidateQueries({ queryKey: ['empleado', user?.id] });
      console.log("Solicitud eliminada con éxito");
    },
    onError: (error: Error) => {
      console.error("Hubo un error al eliminar la solicitud:", error.message);
    },
  });

  const openModal = (solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedSolicitud(null);
    setModalVisible(false);
  };

 
  const eliminarSolicitud = (id: number) => {
    try{
      deleteMutation.mutate(id);
      console.log('Eliminando solicitud con id:', id);
      Alert.alert('Solicitud Eliminada');
    } catch(error){
      console.log('error');
    }
   
    // Lógica para eliminar la solicitud (por ejemplo, llamada a una API)
  };

  // Mostrar un spinner de carga mientras se obtienen los datos
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} color={MD2Colors.blue500} size="large" />
        <Text>Cargando solicitudes...</Text>
      </View>
    );
  }

  // Manejar errores
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error al cargar las solicitudes.</Text>
      </View>
    );
  }

  // Si no hay solicitudes
  if (!empleado?.solicitudes || empleado.solicitudes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No tienes solicitudes en este momento.</Text>
      </View>
    );
  }

  const getStatusStyle = (estado: string, tipo: string) => {
    if (estado === 'PENDIENTE') {
      return styles.badgePendiente;
    } else if (estado === 'APROBADA' && tipo === 'BAJA_MEDICA') {
      return styles.badgeBajaMedica;
    } else if (estado === 'APROBADA' && tipo === 'VACACION') {
      return styles.badgeVacacion;
    }
    return styles.badgeDefault; // Para cualquier otro caso
  };

  // Renderizar las solicitudes
  return  (
    <ScrollView contentContainerStyle={styles.container}>
      {empleado.solicitudes
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Ordena por fecha de creación (más reciente primero)
        .map((solicitud) => (
          <Card key={solicitud.id} style={styles.card}>
            <View style={styles.header}>
              <Badge style={getStatusStyle(solicitud.estado, solicitud.tipo)}>{solicitud.estado}</Badge>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{solicitud.tipo === 'VACACION' ? 'Vacaciones' : 'Baja médica'}</Text>
              <Text style={styles.jobTitle}>{solicitud.descripcion}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.requestDetails}>
              <View>
                <Text style={styles.requestSummary}>
                  Solicita {Math.ceil((new Date(solicitud.fechaFin).getTime() - new Date(solicitud.fechaInicio).getTime()) / (1000 * 3600 * 24)) + 1} días de ausencia 
                </Text>
                <Text style={styles.startDate}>Del {solicitud.fechaInicio}</Text>
                <Text style={styles.endDate}>Hasta {solicitud.fechaFin}</Text>
              </View>
            </View>
            {solicitud.estado === 'PENDIENTE' && (
              <Card.Actions>
                <Button onPress={() => eliminarSolicitud(solicitud.id)} textColor="#f44336" style={{ borderColor: '#f44336' }}>
                  Eliminar
                </Button>
              </Card.Actions>
            )}
            {solicitud.estado === 'RECHAZADA' && (
              <Card.Actions>
                <Button onPress={() => openModal(solicitud)}>Motivo</Button>
              </Card.Actions>
            )}
          </Card>
        ))}
      {selectedSolicitud && (
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Motivo del rechazo</Text>
              <Text style={styles.modalText}>{selectedSolicitud.comentario}</Text>
              <Button onPress={closeModal} style={styles.modalButton}>
                Cerrar
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 20,
   
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent:'flex-end',
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  statusTag: {
    backgroundColor: '#ffe082',
    color: '#f57c00',
    paddingHorizontal: 8,
    paddingVertical: 0,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  infoContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 14,
    color: '#555',
  },
  location: {
    fontSize: 14,
    color: '#555',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginVertical: 16,
  },
  requestDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  requestSummary: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  startDate: {
    fontSize: 14,
    color: '#555',
  },
  endDate: {
    fontSize: 14,
    color: '#555',
  },
  badgePendiente: {
    backgroundColor: '#ffc107', // Amarillo claro
    color: '#fff', // Naranja
    padding:0,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  badgeBajaMedica: {
    backgroundColor: '#007bff', // Azul claro
    color: '#fff', // Azul fuerte
    padding: 0,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: '500',
    justifyContent:'center'
  },
  badgeVacacion: {
    backgroundColor: '#00c853', // Verde claro
    color: '#fff', // Verde fuerte
    padding: 0,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  badgeDefault: {
    backgroundColor: '#f44336', // Gris claro
    color: '#fff', // Gris oscuro
    padding:0,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: '500',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    alignSelf: 'center',
  },
});
