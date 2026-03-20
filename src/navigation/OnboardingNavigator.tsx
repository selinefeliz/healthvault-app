import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingGenderScreen } from '../screens/onboarding/OnboardingGenderScreen';
import { OnboardingProfileScreen } from '../screens/onboarding/OnboardingProfileScreen';
import { OnboardingBiometricsScreen } from '../screens/onboarding/OnboardingBiometricsScreen';

const Stack = createNativeStackNavigator();

export const OnboardingNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="OnboardingGender" component={OnboardingGenderScreen} />
      <Stack.Screen name="OnboardingProfile" component={OnboardingProfileScreen} />
      <Stack.Screen name="OnboardingBiometrics" component={OnboardingBiometricsScreen} />
    </Stack.Navigator>
  );
};
