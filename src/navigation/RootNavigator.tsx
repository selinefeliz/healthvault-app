import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button as RNButton } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase.config';
import { AuthNavigator } from './AuthNavigator';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AuthService } from '../services/auth';
import { colors, spacing } from '../theme/theme';

const PlaceholderScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
    <Text style={{ fontSize: 20, marginBottom: spacing.m }}>¡Bienvenido a Feliz Healthy!</Text>
    <RNButton title="Cerrar Sesión" onPress={() => AuthService.logout()} />
  </View>
);

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      if (loading) setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={PlaceholderScreen} />
        ) : (
          <Stack.Screen name="AuthGroup" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
