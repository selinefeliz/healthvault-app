import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase.config';
import { UserService } from '../services/userService';
import { useUserStore } from '../store/userStore';
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainNavigator } from './MainNavigator';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { profile, setProfile, setProfileLoaded, isProfileLoaded } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        // User is logged in — fetch their Firestore profile
        try {
          const storedProfile = await UserService.getProfile(user.uid);
          setProfile(storedProfile);
        } catch {
          setProfile(null);
        }
      } else {
        // Logged out — clear the profile
        setProfile(null);
      }

      setProfileLoaded(true);
      setIsAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // While Firebase resolves auth state or profile fetch, show spinner
  if (isAuthLoading || !isProfileLoaded) {
    return <LoadingSpinner />;
  }

  // Determine which navigator to show
  const renderNavigator = () => {
    if (!firebaseUser) {
      // No session at all → Auth (Login/Register)
      return <Stack.Screen name="AuthGroup" component={AuthNavigator} />;
    }
    if (!profile || !profile.onboardingCompleted) {
      // Has account but hasn't completed onboarding → Onboarding flow
      return <Stack.Screen name="OnboardingGroup" component={OnboardingNavigator} />;
    }
    // Fully set up → Main app
    return <Stack.Screen name="Main" component={MainNavigator} />;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {renderNavigator()}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
