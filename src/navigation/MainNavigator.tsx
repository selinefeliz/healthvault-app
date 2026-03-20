import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';
import { colors } from '../theme/theme';
import { useUserStore } from '../store/userStore';

// Screens
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { MedicalVaultScreen } from '../screens/records/MedicalVaultScreen';
import { MenstrualTrackerScreen } from '../screens/tracker/MenstrualTrackerScreen';
import { MedicationsScreen } from '../screens/medications/MedicationsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { MenstrualCycleScreen } from '../screens/tracker/MenstrualCycleScreen';
import { AddMedicationScreen } from '../screens/medications/AddMedicationScreen';
import { AddRecordScreen } from '../screens/records/AddRecordScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─── Sub-stacks ───────────────────────────────────────────────
const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardHome" component={DashboardScreen} />
  </Stack.Navigator>
);

const VaultStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="VaultList" component={MedicalVaultScreen} />
    <Stack.Screen name="AddRecord" component={AddRecordScreen} />
  </Stack.Navigator>
);

const TrackerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TrackerHome" component={MenstrualTrackerScreen} />
    <Stack.Screen name="CycleDetail" component={MenstrualCycleScreen} />
  </Stack.Navigator>
);

const MedsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MedsList" component={MedicationsScreen} />
    <Stack.Screen name="AddMedication" component={AddMedicationScreen} />
  </Stack.Navigator>
);

// ─── Tab Icon helper ──────────────────────────────────────────
type IconName = React.ComponentProps<typeof Ionicons>['name'];

const tabIcon = (active: IconName, inactive: IconName) =>
  ({ focused, color }: { focused: boolean; color: string }) => (
    <Ionicons name={focused ? active : inactive} size={24} color={color} />
  );

// ─── Main Tab Navigator ───────────────────────────────────────
export const MainNavigator = () => {
  const { profile } = useUserStore();
  const isFemale = profile?.biologicalSex === 'F';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.caption,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 82 : 65,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{ tabBarLabel: 'Inicio', tabBarIcon: tabIcon('home', 'home-outline') }}
      />
      <Tab.Screen
        name="Records"
        component={VaultStack}
        options={{ tabBarLabel: 'Historial', tabBarIcon: tabIcon('document-text', 'document-text-outline') }}
      />
      {/* Ciclo tab SOLO para mujeres */}
      {isFemale && (
        <Tab.Screen
          name="Tracker"
          component={TrackerStack}
          options={{
            tabBarLabel: 'Mi Ciclo',
            tabBarIcon: ({ focused, color }) => (
              <View style={{
                backgroundColor: colors.secondary + (focused ? 'FF' : '30'),
                width: 44, height: 44, borderRadius: 22,
                justifyContent: 'center', alignItems: 'center',
                marginBottom: 4,
                shadowColor: colors.secondary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: focused ? 0.4 : 0,
                shadowRadius: 8,
              }}>
                <Ionicons name="water" size={22} color={focused ? '#FFF' : colors.secondary} />
              </View>
            ),
            tabBarActiveTintColor: colors.secondary,
          }}
        />
      )}
      <Tab.Screen
        name="Medications"
        component={MedsStack}
        options={{ tabBarLabel: 'Medicación', tabBarIcon: tabIcon('medkit', 'medkit-outline') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Perfil', tabBarIcon: tabIcon('person-circle', 'person-circle-outline') }}
      />
    </Tab.Navigator>
  );
};
