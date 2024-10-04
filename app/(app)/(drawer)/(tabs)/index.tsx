import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons , MaterialCommunityIcons} from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Para mostrar la fecha en español

export default function Asistencia() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar la hora y fecha cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Formato de la hora y fecha en español
  const formattedTime = format(currentTime, 'hh:mm a', { locale: es });
  const formattedDate = format(currentTime, "EEEE dd 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <View style={styles.container}>
      {/* Fecha y Hora */}
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formattedTime}</Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      {/* Botones de Entrada y Salida */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={[styles.iconContainer, styles.entryIcon]}>
        <MaterialCommunityIcons name="camera-front" size={32} color="white" />
          <Text style={styles.iconLabel}>Entrada</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.iconContainer, styles.exitIcon]}>
          <MaterialCommunityIcons name="camera-front-variant" size={32} color="white" />
          <Text style={styles.iconLabel}>Salida</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  timeContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  timeText: {
    fontSize: 48,
    color: '#2196F3',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#757575',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 300,
    marginBottom: 24,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 32,
    padding: 16,
  },
  entryIcon: {
    backgroundColor: '#80b569',
  },
  exitIcon: {
    backgroundColor: '#eaa256',
  },
  iconLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
    fontWeight: 'bold',
  },
});
