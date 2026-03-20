import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
  KeyboardAvoidingView, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { Input } from '../../components/Input';
import { auth } from '../../services/firebase.config';
import { UserService } from '../../services/userService';
import { useUserStore } from '../../store/userStore';
import { UserProfile } from '../../models/user';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'No sé'];

interface Props {
  navigation: any;
  route: { params: { biologicalSex: string; profileData: any } };
}

export const OnboardingBiometricsScreen = ({ navigation, route }: Props) => {
  const { biologicalSex, profileData } = route.params;
  const { setProfile } = useUserStore();

  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleFinish = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setIsSaving(true);
    try {
      const fullProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: profileData.displayName,
        biologicalSex: biologicalSex as any,
        role: 'user',
        isTutor: false,
        onboardingCompleted: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        // Profile data from step 2
        ...profileData,
        // Biometrics from step 3
        weightKg: parseFloat(weightKg) || undefined,
        heightCm: parseFloat(heightCm) || undefined,
        bloodType: bloodType || undefined,
        allergies: allergies ? allergies.split(',').map(a => a.trim()).filter(Boolean) : [],
      };

      await UserService.createProfile(fullProfile);
      setProfile(fullProfile);
      // No explicit navigate — RootNavigator will react to profile being set
    } catch (e: any) {
      Alert.alert('Error al guardar', e.message);
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Progress */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
        <Text style={styles.step}>Paso 3 de 3 — ¡Último paso!</Text>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back-circle" size={32} color={colors.primary} />
        </TouchableOpacity>

        <Text style={typography.h1}>Biometría base</Text>
        <Text style={[typography.body, styles.subtitle]}>
          Estos datos opcionales mejoran las predicciones y recomendaciones médicas. Puedes completarlos luego desde tu perfil.
        </Text>

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Input label="Peso (kg)" placeholder="ej. 65" value={weightKg} onChangeText={setWeightKg} keyboardType="numeric" />
          </View>
          <View style={[styles.rowItem, { marginLeft: spacing.m }]}>
            <Input label="Talla (cm)" placeholder="ej. 165" value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" />
          </View>
        </View>

        <Text style={styles.fieldLabel}>Grupo sanguíneo</Text>
        <View style={styles.bloodGrid}>
          {BLOOD_TYPES.map(bt => (
            <TouchableOpacity
              key={bt}
              style={[styles.bloodChip, bloodType === bt && { backgroundColor: colors.primary, borderColor: colors.primary }]}
              onPress={() => setBloodType(bt === bloodType ? '' : bt)}
              activeOpacity={0.8}
            >
              <Text style={[styles.bloodChipText, bloodType === bt && { color: '#FFF' }]}>{bt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Alergias conocidas (separadas por coma)"
          placeholder="ej. Penicilina, Látex, Polen..."
          value={allergies}
          onChangeText={setAllergies}
          multiline
          numberOfLines={2}
        />

        <View style={styles.privacyBox}>
          <Ionicons name="shield-checkmark" size={20} color={colors.success} />
          <Text style={styles.privacyText}>
            Todos tus datos médicos están encriptados y solo son visibles para ti. Nunca los compartimos con terceros.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.finishButton, isSaving && styles.continueDisabled]}
          onPress={handleFinish}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={22} color="#FFF" style={{ marginRight: spacing.s }} />
              <Text style={styles.finishText}>¡Comenzar mi viaje de salud!</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFinish} disabled={isSaving}>
          <Text style={styles.skipText}>Completar después</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  progressBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: spacing.s },
  progressFill: { height: 6, backgroundColor: colors.success, borderRadius: 3 },
  step: { fontSize: 13, color: colors.success, marginBottom: spacing.l, fontWeight: '700' },
  backBtn: { marginBottom: spacing.m },
  subtitle: { color: colors.caption, marginBottom: spacing.xl, marginTop: spacing.s },
  row: { flexDirection: 'row' },
  rowItem: { flex: 1 },
  fieldLabel: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: spacing.s },
  bloodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s, marginBottom: spacing.l },
  bloodChip: {
    paddingHorizontal: spacing.m, paddingVertical: spacing.s,
    borderRadius: borderRadius.full, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  bloodChipText: { fontWeight: '600', color: colors.text, fontSize: 14 },
  privacyBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.success + '12', padding: spacing.m,
    borderRadius: borderRadius.md, marginBottom: spacing.xl,
    borderLeftWidth: 3, borderLeftColor: colors.success,
  },
  privacyText: { fontSize: 13, color: colors.caption, marginLeft: spacing.s, flex: 1, lineHeight: 18 },
  finishButton: {
    backgroundColor: colors.primary, padding: spacing.l, borderRadius: borderRadius.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.m,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 5,
  },
  continueDisabled: { backgroundColor: colors.border, shadowOpacity: 0 },
  finishText: { color: '#FFF', fontWeight: '700', fontSize: 17 },
  skipText: { textAlign: 'center', color: colors.caption, fontSize: 14, textDecorationLine: 'underline', paddingVertical: spacing.m },
});
