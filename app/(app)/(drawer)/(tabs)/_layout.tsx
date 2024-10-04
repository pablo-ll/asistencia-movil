import { View, Text, Button, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Tabs, router } from 'expo-router'
import {  MaterialCommunityIcons, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Stack } from 'expo-router';

export default function _layout() {
  return (
   <Tabs screenOptions={{headerLeft: () => <DrawerToggleButton tintColor='#000' />}} >

    <Tabs.Screen name='index' options={{
      tabBarIcon: ({color}) => (
        <MaterialCommunityIcons name="account-clock-outline" size={24} color={color} />
      ),
      tabBarLabel: 'Marcar Asistencia',
      headerTitle: 'Marcar Asistencia'
    }} />
    <Tabs.Screen name='solicitud' options={{
      tabBarIcon: ({color}) => (
        <FontAwesome6 name="hospital-user" size={24} color={color} />
      ),
      tabBarLabel: 'Solicitudes',
      headerTitle: 'Solicitudes',
      headerRight: () => <Pressable 
      onPress={() => router.push({
        pathname: '/solicitar',
      
        
        
      })}  
      style={styles.button}
    >
      <Ionicons name="add" size={24} color="white" />
    {/* //  <Text style={styles.buttonText}>+Solicitud</Text> */}
    </Pressable>
  
    }} />
    
  

   </Tabs>
  )
}

const styles = StyleSheet.create({
  button: {
    marginRight: 10, // Espacio a la derecha del botón
    paddingHorizontal: 15, // Espacio dentro del botón a los lados
    paddingVertical: 8, // Espacio dentro del botón arriba y abajo
    backgroundColor: '#007bff', // Color de fondo del botón
    borderRadius: 5, // Bordes redondeados del botón
  },
  buttonText: {
    color: '#fff', // Color del texto dentro del botón
    fontWeight: 'bold', // Texto en negrita
  },
});


