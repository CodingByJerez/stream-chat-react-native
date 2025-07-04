import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ChatWrapper } from '../components/ChatWrapper';
import { AppProvider } from '../context/AppContext';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useMemo } from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <AuthProvider>
          <ChatWrapper>
            <AppProvider>
              <Stack />
            </AppProvider>
          </ChatWrapper>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
