import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/providers/AuthProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
      <StatusBar style="dark" />

        <Stack screenOptions={{
        headerShown: false,
      }}/>
      </AuthProvider>
    </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
